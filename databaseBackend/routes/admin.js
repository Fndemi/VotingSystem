const express = require('express');
const router = express.Router();

// Import models
const Student = require('../models/Student');
const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const ElectedDelegate = require('../models/ElectedDelegate');
const Party = require('../models/Party');
const CouncilVote = require('../models/CouncilVote');
const Phase = require('../models/Phase');

// Reset election endpoint
router.post('/reset-election', async (req, res) => {
  try {
    console.log('Starting election reset...');

    // Clear all votes
    const votesDeleted = await DelegateVote.deleteMany({});
    console.log(`Deleted ${votesDeleted.deletedCount} delegate votes`);

    const councilVotesDeleted = await CouncilVote.deleteMany({});
    console.log(`Deleted ${councilVotesDeleted.deletedCount} council votes`);

    // Clear all candidates
    const delegateCandidatesDeleted = await DelegateCandidate.deleteMany({});
    console.log(`Deleted ${delegateCandidatesDeleted.deletedCount} delegate candidates`);

    // Clear elected delegates
    const electedDelegatesDeleted = await ElectedDelegate.deleteMany({});
    console.log(`Deleted ${electedDelegatesDeleted.deletedCount} elected delegates`);

    // Clear parties
    const partiesDeleted = await Party.deleteMany({});
    console.log(`Deleted ${partiesDeleted.deletedCount} parties`);

    // Reset student passwords (keep students but clear registration)
    const studentsUpdated = await Student.updateMany(
      {},
      {
        $unset: {
          passwordHash: 1,
          walletAddress: 1,
          lastLogin: 1,
          hasVotedDelegate: 1
        },
        $set: {
          loginAttempts: 0,
          isLocked: false,
          lockUntil: null
        }
      }
    );
    console.log(`Reset passwords for ${studentsUpdated.modifiedCount} students`);

    // Reset phase to 0 (Registration)
    await Phase.deleteMany({});
    const newPhase = new Phase({
      currentPhase: 0,
      phaseName: 'Registration',
    });
    await newPhase.save();
    console.log('Reset phase to 0 (Registration)');

    console.log('Election reset complete');

    res.json({
      success: true,
      message: 'Election reset successfully',
      details: {
        delegateVotesDeleted: votesDeleted.deletedCount,
        councilVotesDeleted: councilVotesDeleted.deletedCount,
        candidatesDeleted: delegateCandidatesDeleted.deletedCount,
        electedDelegatesDeleted: electedDelegatesDeleted.deletedCount,
        partiesDeleted: partiesDeleted.deletedCount,
        studentsReset: studentsUpdated.modifiedCount,
        phaseReset: true
      }
    });

  } catch (error) {
    console.error('Error resetting election:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset election',
      details: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working', timestamp: new Date() });
});

module.exports = router;