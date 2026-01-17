const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const ElectedDelegate = require('../models/ElectedDelegate');
const Phase = require('../models/Phase');
const { authenticateToken } = require('./auth');

// Helper: get latest phase number
async function getCurrentPhaseNumber() {
  const phase = await Phase.findOne().sort({ createdAt: -1 });
  return phase ? phase.currentPhase : 0;
}

// Cast delegate vote (Web2 with authentication)
router.post('/vote', authenticateToken, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const studentId = req.user.studentId;

    console.log('Delegate vote attempt:', { candidateId, studentId });

    if (!candidateId) {
      return res.status(400).json({ error: 'candidateId is required' });
    }

    const currentPhase = await getCurrentPhaseNumber();
    if (currentPhase !== 2) {
      return res.status(400).json({ error: 'Delegate voting is not open at this time' });
    }

    const student = await Student.findById(studentId);
    if (!student || !student.isActive) {
      return res.status(404).json({ error: 'Student not found or inactive' });
    }

    console.log('Student found:', { name: student.name, schoolId: student.schoolId, departmentId: student.departmentId });

    // Find the delegate candidate
    const candidate = await DelegateCandidate.findOne({
      _id: candidateId,
      isActive: true,
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    console.log('Candidate found:', { candidateId });

    // Prevent self-voting: check if voter is the candidate
    const candidateStudentId = String(candidate.studentId);
    if (candidateStudentId === String(studentId)) {
      return res.status(400).json({ error: 'You cannot vote for yourself' });
    }

    // Check department match
    const candidateSchoolId = candidate.schoolId;
    const candidateDepartmentId = candidate.departmentId;
    
    if (
      candidateSchoolId !== student.schoolId ||
      candidateDepartmentId !== student.departmentId
    ) {
      return res.status(400).json({ error: 'Candidate is not in your department' });
    }

    const existingVote = await DelegateVote.findOne({ studentId: student._id });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for a delegate' });
    }

    const vote = new DelegateVote({
      studentId: student._id,
      candidateId: candidate._id,
      schoolId: student.schoolId,
      departmentId: student.departmentId,
    });

    console.log('Saving vote:', vote);
    const savedVote = await vote.save();
    console.log('Vote saved successfully:', savedVote);

    // Update vote count
    await DelegateCandidate.updateOne(
      { _id: candidate._id },
      { $inc: { voteCount: 1 } },
    );

    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error('Error casting delegate vote:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check all votes
router.get('/debug/votes', async (req, res) => {
  try {
    const votes = await DelegateVote.find({})
      .populate('studentId', 'name registrationNumber')
      .populate('candidateId');
    
    res.json({
      totalVotes: votes.length,
      votes: votes.map(vote => ({
        voter: vote.studentId.name,
        voterReg: vote.studentId.registrationNumber,
        candidateId: vote.candidateId,
        schoolId: vote.schoolId,
        departmentId: vote.departmentId,
        timestamp: vote.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const vote = await DelegateVote.findOne({ studentId });
    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tally votes and elect delegates per department (admin-style endpoint)
router.post('/tally', async (req, res) => {
  try {
    // Clear existing elected delegates first
    await ElectedDelegate.deleteMany({});
    
    // Get all votes and group by department
    const votes = await DelegateVote.find({});
    const votesByDept = new Map();

    // Count votes per candidate per department
    for (const vote of votes) {
      const deptKey = `${vote.schoolId}-${vote.departmentId}`;
      if (!votesByDept.has(deptKey)) {
        votesByDept.set(deptKey, new Map());
      }
      const candidateKey = String(vote.candidateId);
      const currentCount = votesByDept.get(deptKey).get(candidateKey) || 0;
      votesByDept.get(deptKey).set(candidateKey, currentCount + 1);
    }

    const elected = [];

    // Find winner for each department
    for (const [deptKey, candidateVotes] of votesByDept.entries()) {
      const [schoolIdStr, departmentIdStr] = deptKey.split('-');
      const schoolId = parseInt(schoolIdStr, 10);
      const departmentId = parseInt(departmentIdStr, 10);

      let winningCandidateId = null;
      let maxVotes = 0;

      // Find candidate with highest votes in this department
      for (const [candidateId, voteCount] of candidateVotes.entries()) {
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winningCandidateId = candidateId;
        }
      }

      if (!winningCandidateId || maxVotes === 0) continue;

      // Find the winning candidate
      const candidate = await DelegateCandidate.findById(winningCandidateId);
      
      if (!candidate) {
        console.warn(`Could not find candidate ${winningCandidateId}`);
        continue;
      }

      const studentId = candidate.studentId;

      // Create elected delegate record
      const electedDelegate = new ElectedDelegate({
        studentId: studentId,
        schoolId,
        departmentId,
        voteCount: maxVotes,
      });
      
      await electedDelegate.save();
      elected.push(electedDelegate);
    }

    res.json({
      message: 'Delegate votes tallied successfully',
      count: elected.length,
      elected: elected.map(e => ({
        schoolId: e.schoolId,
        departmentId: e.departmentId,
        voteCount: e.voteCount
      }))
    });
  } catch (error) {
    console.error('Tally error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get elected delegate for a department
router.get('/elected/:schoolId/:departmentId', async (req, res) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    const departmentId = parseInt(req.params.departmentId, 10);

    const elected = await ElectedDelegate.findOne({
      schoolId,
      departmentId,
    }).populate('studentId');

    if (!elected) {
      return res.json({ hasDelegate: false });
    }

    res.json({
      hasDelegate: true,
      delegate: {
        name: elected.studentId.name,
        registrationNumber: elected.studentId.registrationNumber,
        schoolId: elected.schoolId,
        departmentId: elected.departmentId,
        voteCount: elected.voteCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all delegate results
router.get('/results', async (req, res) => {
  try {
    const results = await ElectedDelegate.find()
      .populate('studentId', 'name registrationNumber')
      .populate('schoolId')
      .populate('departmentId')
      .sort({ schoolId: 1, departmentId: 1 });

    const School = require('../models/School');
    const Department = require('../models/Department');

    const enrichedResults = await Promise.all(results.map(async (d) => {
      const school = await School.findOne({ schoolId: d.schoolId });
      const department = await Department.findOne({ departmentId: d.departmentId });
      
      return {
        name: d.studentId.name,
        registrationNumber: d.studentId.registrationNumber,
        schoolId: d.schoolId,
        schoolName: school ? school.name : 'Unknown',
        departmentId: d.departmentId,
        departmentName: department ? department.name : 'Unknown',
        voteCount: d.voteCount,
        electedAt: d.createdAt
      };
    }));

    res.json({
      success: true,
      delegates: enrichedResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get delegate result for student's department
router.get('/my-department-result', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const elected = await ElectedDelegate.findOne({
      schoolId: student.schoolId,
      departmentId: student.departmentId,
    }).populate('studentId', 'name registrationNumber');

    if (!elected) {
      return res.json({ 
        hasDelegate: false,
        message: 'No delegate elected for your department yet'
      });
    }

    res.json({
      hasDelegate: true,
      delegate: {
        name: elected.studentId.name,
        registrationNumber: elected.studentId.registrationNumber,
        voteCount: elected.voteCount,
        electedAt: elected.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update elected delegates based on actual vote counts from DelegateVote collection
router.post('/update-elected', async (req, res) => {
  try {
    // Use the same logic as tally endpoint to ensure consistency
    const tallyResult = await new Promise((resolve, reject) => {
      // Simulate the tally logic
      (async () => {
        try {
          await ElectedDelegate.deleteMany({});
          
          const votes = await DelegateVote.find({});
          const votesByDept = new Map();

          for (const vote of votes) {
            const deptKey = `${vote.schoolId}-${vote.departmentId}`;
            if (!votesByDept.has(deptKey)) {
              votesByDept.set(deptKey, new Map());
            }
            const candidateKey = String(vote.candidateId);
            const currentCount = votesByDept.get(deptKey).get(candidateKey) || 0;
            votesByDept.get(deptKey).set(candidateKey, currentCount + 1);
          }

          const elected = [];

          for (const [deptKey, candidateVotes] of votesByDept.entries()) {
            const [schoolIdStr, departmentIdStr] = deptKey.split('-');
            const schoolId = parseInt(schoolIdStr, 10);
            const departmentId = parseInt(departmentIdStr, 10);

            let winningCandidateId = null;
            let maxVotes = 0;

            for (const [candidateId, voteCount] of candidateVotes.entries()) {
              if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winningCandidateId = candidateId;
              }
            }

            if (!winningCandidateId || maxVotes === 0) continue;

            const candidate = await DelegateCandidate.findById(winningCandidateId);
            
            if (!candidate) continue;

            const studentId = candidate.studentId;

            const electedDelegate = new ElectedDelegate({
              studentId: studentId,
              schoolId,
              departmentId,
              voteCount: maxVotes,
            });
            
            await electedDelegate.save();
            elected.push(electedDelegate);
          }
          
          resolve(elected);
        } catch (error) {
          reject(error);
        }
      })();
    });
    
    res.json({
      success: true,
      message: `Updated ${tallyResult.length} elected delegates based on actual votes`,
      count: tallyResult.length
    });
  } catch (error) {
    console.error('Update elected error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


