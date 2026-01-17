const express = require('express');
const router = express.Router();
const Phase = require('../models/Phase');

const phaseNames = [
  'Registration',
  'Candidate Registration', 
  'Delegate Voting',
  'Nominee Registration', // Exists but skipped in Web2
  'Party Registration',
  'Council Voting',
  'Ended'
];

// Web2 phase flow: 0 -> 1 -> 2 -> 4 -> 5 -> 6 (skips 3)


// Get current phase
router.get('/current', async (req, res) => {
  try {
    let phase = await Phase.findOne().sort({ createdAt: -1 });
    
    // Initialize if no phase exists
    if (!phase) {
      phase = new Phase({
        currentPhase: 0,
        phaseName: phaseNames[0]
      });
      await phase.save();
    }
    
    res.json({
      currentPhase: phase.currentPhase,
      phaseName: phase.phaseName,
      startTime: phase.startTime,
      web2Note: phase.currentPhase === 3 ? 'Phase 3 is skipped in Web2 implementation' : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to run delegate vote tally
// This automatically populates the ElectedDelegate collection when advancing from Phase 2
// It groups votes by department, finds the winner for each department, and creates ElectedDelegate records
async function runDelegateTally() {
  const DelegateVote = require('../models/DelegateVote');
  const DelegateCandidate = require('../models/DelegateCandidate');
  const ElectedDelegate = require('../models/ElectedDelegate');
  
  // Group votes by (schoolId, departmentId) and find winners
  const votes = await DelegateVote.find({});
  
  const resultsByDept = new Map();
  
  for (const vote of votes) {
    const key = `${vote.schoolId}-${vote.departmentId}`;
    if (!resultsByDept.has(key)) {
      resultsByDept.set(key, new Map());
    }
    const deptMap = resultsByDept.get(key);
    const candidateKey = String(vote.candidateId);
    deptMap.set(candidateKey, (deptMap.get(candidateKey) || 0) + 1);
  }
  
  const elected = [];
  
  for (const [key, deptMap] of resultsByDept.entries()) {
    const [schoolIdStr, departmentIdStr] = key.split('-');
    const schoolId = parseInt(schoolIdStr, 10);
    const departmentId = parseInt(departmentIdStr, 10);
    
    let winningCandidateId = null;
    let maxVotes = 0;
    
    for (const [candidateIdStr, count] of deptMap.entries()) {
      if (count > maxVotes) {
        maxVotes = count;
        winningCandidateId = candidateIdStr;
      }
    }
    
    if (!winningCandidateId) continue;
    
    // Try DelegateCandidate first, then regular Candidate
    let candidate = await DelegateCandidate.findById(winningCandidateId);
    if (!candidate) {
      const Candidate = require('../models/Candidate');
      candidate = await Candidate.findById(winningCandidateId).populate('studentId');
    }
    if (!candidate) continue;
    
    // Get studentId - handle both DelegateCandidate and regular Candidate
    const studentId = candidate.studentId._id || candidate.studentId;
    
    const existing = await ElectedDelegate.findOne({
      schoolId,
      departmentId,
    });
    
    if (existing) {
      existing.studentId = studentId;
      existing.voteCount = maxVotes;
      await existing.save();
      elected.push(existing);
    } else {
      const ed = new ElectedDelegate({
        studentId: studentId,
        schoolId,
        departmentId,
        voteCount: maxVotes,
      });
      await ed.save();
      elected.push(ed);
    }
  }
  
  return elected.length;
}

// Set phase (admin only) - Web2: warn about Phase 3
router.post('/set', async (req, res) => {
  try {
    const { phaseNumber } = req.body;
    
    if (phaseNumber < 0 || phaseNumber > 6) {
      return res.status(400).json({ error: 'Invalid phase number' });
    }
    
    // Web2: Warn if trying to set Phase 3
    if (phaseNumber === 3) {
      return res.status(400).json({ 
        error: 'Phase 3 (Nominee Registration) is skipped in Web2 implementation. Use Phase 4 (Party Registration) instead.' 
      });
    }
    
    // Get current phase to check if we're moving from Phase 2
    const currentPhase = await Phase.findOne().sort({ createdAt: -1 });
    
    // If setting phase to 4 and current phase is 2, automatically run tally
    if (phaseNumber === 4 && currentPhase && currentPhase.currentPhase === 2) {
      try {
        const electedCount = await runDelegateTally();
        console.log(`Automatically tallied ${electedCount} elected delegates when setting phase to 4`);
      } catch (tallyError) {
        console.error('Error during automatic tally:', tallyError);
        // Continue with phase setting even if tally fails
      }
    }
    
    const phase = new Phase({
      currentPhase: phaseNumber,
      phaseName: phaseNames[phaseNumber]
    });
    
    await phase.save();
    
    const message = (phaseNumber === 4 && currentPhase && currentPhase.currentPhase === 2) ?
      `Phase set to ${phaseNames[phaseNumber]}. Delegate votes tallied automatically.` :
      `Phase set to ${phaseNames[phaseNumber]}`;
    
    res.json({
      message,
      currentPhase: phase.currentPhase,
      phaseName: phase.phaseName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advance to next phase (Web2: auto-skip Phase 3)
router.post('/next', async (req, res) => {
  try {
    const currentPhase = await Phase.findOne().sort({ createdAt: -1 });
    
    if (!currentPhase || currentPhase.currentPhase >= 6) {
      return res.status(400).json({ error: 'Cannot advance phase' });
    }
    
    let nextPhaseNumber = currentPhase.currentPhase + 1;
    
    // Web2: Skip Phase 3 (Nominee Registration) - jump from 2 to 4
    if (nextPhaseNumber === 3) {
      nextPhaseNumber = 4;
    }
    
    // If advancing from Phase 2 (Delegate Voting), automatically run tally
    if (currentPhase.currentPhase === 2) {
      try {
        const electedCount = await runDelegateTally();
        console.log(`Automatically tallied ${electedCount} elected delegates when advancing from Phase 2`);
      } catch (tallyError) {
        console.error('Error during automatic tally:', tallyError);
        // Continue with phase advancement even if tally fails
        // Admin can manually run tally if needed
      }
    }
    
    const newPhase = new Phase({
      currentPhase: nextPhaseNumber,
      phaseName: phaseNames[nextPhaseNumber]
    });
    
    await newPhase.save();
    
    const message = currentPhase.currentPhase === 2 ? 
      `Skipped Phase 3, advanced to ${phaseNames[nextPhaseNumber]}. Delegate votes tallied automatically.` :
      `Advanced to ${phaseNames[nextPhaseNumber]}`;
    
    res.json({
      message,
      currentPhase: newPhase.currentPhase,
      phaseName: newPhase.phaseName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;