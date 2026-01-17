const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CouncilVote = require('../models/CouncilVote');
const Party = require('../models/Party');
const ElectedDelegate = require('../models/ElectedDelegate');
const Phase = require('../models/Phase');
const { authenticateToken } = require('./auth');

// Helper: get latest phase number
async function getCurrentPhaseNumber() {
  const phase = await Phase.findOne().sort({ createdAt: -1 });
  return phase ? phase.currentPhase : 0;
}

// Cast votes (one party per slot)
router.post('/vote', authenticateToken, async (req, res) => {
  try {
    const { votes } = req.body; // Array: [{ slotId, partyId }, ...]
    const studentId = req.user.studentId;

    // Drop old index if it exists
    try {
      await CouncilVote.collection.dropIndex('delegateId_1_partyId_1');
      console.log('Dropped old index');
    } catch (err) {
      // Index doesn't exist, ignore
    }

    // Validate phase
    const currentPhase = await getCurrentPhaseNumber();
    if (currentPhase !== 5) {
      return res.status(400).json({ error: 'Council voting is not open at this time' });
    }

    // Validate inputs
    if (!votes || !Array.isArray(votes)) {
      return res.status(400).json({ error: 'Votes array is required' });
    }

    // Check if user is an elected delegate
    const delegate = await ElectedDelegate.findOne({ studentId });
    if (!delegate) {
      return res.status(403).json({ error: 'Only elected delegates can vote' });
    }

    // Check if delegate has already voted
    const existingVotes = await CouncilVote.find({ delegateId: studentId });
    if (existingVotes.length > 0) {
      return res.status(400).json({ error: 'You have already cast your votes' });
    }

    // Validate that we have exactly 4 votes (one per slot)
    if (votes.length !== 4) {
      return res.status(400).json({ error: 'Must vote for exactly 4 slots' });
    }

    // Validate slot IDs are 0, 1, 2, 3
    const slotIds = votes.map(v => v.slotId).sort();
    if (JSON.stringify(slotIds) !== JSON.stringify([0, 1, 2, 3])) {
      return res.status(400).json({ error: 'Must vote for all 4 slots (0, 1, 2, 3)' });
    }

    // Validate all parties exist
    console.log('Received votes:', votes);
    const uniquePartyIds = [...new Set(votes.map(v => v.partyId))];
    console.log('Unique party IDs:', uniquePartyIds);
    
    const partyObjectIds = uniquePartyIds.map(id => new mongoose.Types.ObjectId(id));
    const parties = await Party.find({ _id: { $in: partyObjectIds }, isActive: true });
    console.log('Found parties:', parties.length, 'Expected:', uniquePartyIds.length);
    
    if (parties.length !== uniquePartyIds.length) {
      return res.status(404).json({ error: 'One or more parties not found' });
    }

    // Create vote documents
    const voteDocuments = votes.map(vote => ({
      delegateId: studentId,
      partyId: vote.partyId,
      slotId: vote.slotId
    }));

    await CouncilVote.insertMany(voteDocuments);

    res.json({ message: 'Votes cast successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get voting status for authenticated delegate
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.studentId;

    // Check if user is a delegate
    const delegate = await ElectedDelegate.findOne({ studentId });
    if (!delegate) {
      return res.json({ isDelegate: false });
    }

    // Get votes
    const votes = await CouncilVote.find({ delegateId: studentId }).populate('partyId');

    const hasVoted = votes.length > 0;
    
    const status = {
      isDelegate: true,
      hasVoted,
      votes: votes.map(vote => ({
        slotId: vote.slotId,
        partyId: vote.partyId._id,
        partyName: vote.partyId.name
      }))
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tally votes and determine winners (admin only)
router.post('/tally', async (req, res) => {
  try {
    const currentPhase = await getCurrentPhaseNumber();
    if (currentPhase !== 5) {
      return res.status(400).json({ error: 'Can only tally during council voting phase' });
    }

    // Count votes per party per slot
    const slotResults = {};
    for (let slotId = 0; slotId < 4; slotId++) {
      const votes = await CouncilVote.find({ slotId }).populate('partyId');
      const voteCounts = {};
      
      votes.forEach(vote => {
        const partyId = vote.partyId._id.toString();
        voteCounts[partyId] = (voteCounts[partyId] || 0) + 1;
      });
      
      slotResults[slotId] = voteCounts;
    }

    // Get all parties with their nominees
    const parties = await Party.find({ isActive: true })
      .populate('slot0.studentId slot1.studentId slot2.studentId slot3.studentId');

    const results = {
      slotResults,
      parties: parties.map(party => ({
        partyId: party._id,
        partyName: party.name,
        nominees: {
          slot0: party.slot0.map(s => ({ name: s.studentId.name, position: s.position })),
          slot1: party.slot1.map(s => ({ name: s.studentId.name, position: s.position })),
          slot2: party.slot2.map(s => ({ name: s.studentId.name, position: s.position })),
          slot3: { name: party.slot3.studentId.name, position: party.slot3.position }
        }
      }))
    };

    res.json({
      message: 'Votes tallied successfully',
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results
router.get('/results', async (req, res) => {
  try {
    // Count votes per party per slot
    const slotResults = {};
    const winners = {};
    
    for (let slotId = 0; slotId < 4; slotId++) {
      const votes = await CouncilVote.find({ slotId }).populate('partyId');
      const voteCounts = {};
      
      votes.forEach(vote => {
        const partyId = vote.partyId._id.toString();
        voteCounts[partyId] = (voteCounts[partyId] || 0) + 1;
      });
      
      slotResults[slotId] = voteCounts;
      
      // Find winner for this slot
      let maxVotes = 0;
      let winningPartyId = null;
      for (const [partyId, voteCount] of Object.entries(voteCounts)) {
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winningPartyId = partyId;
        }
      }
      winners[slotId] = { partyId: winningPartyId, votes: maxVotes };
    }

    const parties = await Party.find({ isActive: true })
      .populate('slot0.studentId slot1.studentId slot2.studentId slot3.studentId');

    const slotNames = [
      'Chairperson & Vice Chairperson',
      'Secretary General & Gender/Disability Secretary',
      'Treasurer & Sports Secretary',
      'Town Campus Secretary'
    ];

    const results = parties.map(party => ({
      partyId: party._id,
      partyName: party.name,
      slotVotes: {
        slot0: slotResults[0][party._id.toString()] || 0,
        slot1: slotResults[1][party._id.toString()] || 0,
        slot2: slotResults[2][party._id.toString()] || 0,
        slot3: slotResults[3][party._id.toString()] || 0
      },
      nominees: {
        slot0: party.slot0.map(s => ({
          name: s.studentId.name,
          registrationNumber: s.studentId.registrationNumber,
          position: s.position
        })),
        slot1: party.slot1.map(s => ({
          name: s.studentId.name,
          registrationNumber: s.studentId.registrationNumber,
          position: s.position
        })),
        slot2: party.slot2.map(s => ({
          name: s.studentId.name,
          registrationNumber: s.studentId.registrationNumber,
          position: s.position
        })),
        slot3: {
          name: party.slot3.studentId.name,
          registrationNumber: party.slot3.studentId.registrationNumber,
          position: party.slot3.position
        }
      }
    }));

    // Add winner details
    const winnerDetails = {};
    for (let slotId = 0; slotId < 4; slotId++) {
      if (winners[slotId].partyId) {
        const winningParty = parties.find(p => p._id.toString() === winners[slotId].partyId);
        if (winningParty) {
          winnerDetails[slotId] = {
            slotName: slotNames[slotId],
            partyName: winningParty.name,
            votes: winners[slotId].votes,
            winners: slotId === 3 
              ? [{
                  name: winningParty.slot3.studentId.name,
                  registrationNumber: winningParty.slot3.studentId.registrationNumber,
                  position: winningParty.slot3.position,
                  schoolName: winningParty.slot3.studentId.schoolName,
                  departmentName: winningParty.slot3.studentId.departmentName
                }]
              : winningParty[`slot${slotId}`].map(s => ({
                  name: s.studentId.name,
                  registrationNumber: s.studentId.registrationNumber,
                  position: s.position,
                  schoolName: s.studentId.schoolName,
                  departmentName: s.studentId.departmentName
                }))
          };
        }
      }
    }

    console.log('Council Results:', JSON.stringify({ parties: results, winners: winnerDetails }, null, 2));
    res.json({ parties: results, winners: winnerDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all delegate votes (admin view)
router.get('/all-votes', async (req, res) => {
  try {
    const votes = await CouncilVote.find()
      .populate('delegateId', 'name registrationNumber')
      .populate('partyId', 'name')
      .sort({ delegateId: 1, slotId: 1 });

    // Group by delegate
    const votesByDelegate = {};
    votes.forEach(vote => {
      const delegateId = vote.delegateId._id.toString();
      if (!votesByDelegate[delegateId]) {
        votesByDelegate[delegateId] = {
          delegateName: vote.delegateId.name,
          registrationNumber: vote.delegateId.registrationNumber,
          votes: []
        };
      }
      votesByDelegate[delegateId].votes.push({
        slotId: vote.slotId,
        partyName: vote.partyId.name
      });
    });

    res.json(Object.values(votesByDelegate));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getSlotName(slotId) {
  const names = [
    'Chairperson + Vice Chairperson',
    'Secretary General + Gender/Disability Secretary',
    'Treasurer + Sports Secretary',
    'Town Campus Secretary'
  ];
  return names[slotId];
}

module.exports = router;
