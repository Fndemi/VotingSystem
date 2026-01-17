const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const ElectedDelegate = require('../models/ElectedDelegate');
const Candidate = require('../models/Candidate');
const Student = require('../models/Student');

async function populateElectedDelegates() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Clear existing elected delegates
    await ElectedDelegate.deleteMany({});
    console.log('Cleared existing elected delegates');

    // Get all votes and count them properly per department
    const votes = await DelegateVote.find({});
    console.log(`Found ${votes.length} total votes`);
    
    if (votes.length === 0) {
      console.log('No votes found, no delegates to elect');
      return;
    }

    // Group votes by department and count per candidate
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

    console.log(`Processing ${votesByDept.size} departments`);

    // Find winner for each department
    const electedDelegates = [];
    
    for (const [deptKey, candidateVotes] of votesByDept.entries()) {
      const [schoolIdStr, departmentIdStr] = deptKey.split('-');
      const schoolId = parseInt(schoolIdStr, 10);
      const departmentId = parseInt(departmentIdStr, 10);

      let winningCandidateId = null;
      let maxVotes = 0;

      // Find candidate with highest votes in this department
      for (const [candidateId, voteCount] of candidateVotes.entries()) {
        console.log(`  Dept ${deptKey}: Candidate ${candidateId} has ${voteCount} votes`);
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winningCandidateId = candidateId;
        }
      }

      if (!winningCandidateId || maxVotes === 0) {
        console.log(`No winner found for department ${deptKey}`);
        continue;
      }

      // Find the winning candidate in either collection
      let candidate = await DelegateCandidate.findById(winningCandidateId);
      let studentId;
      
      if (candidate) {
        studentId = candidate.studentId;
        console.log(`Winner in dept ${deptKey}: DelegateCandidate ${winningCandidateId} with ${maxVotes} votes`);
      } else {
        candidate = await Candidate.findById(winningCandidateId).populate('studentId');
        if (candidate) {
          studentId = candidate.studentId._id;
          console.log(`Winner in dept ${deptKey}: Regular Candidate ${winningCandidateId} with ${maxVotes} votes`);
        }
      }

      if (!studentId) {
        console.warn(`Could not find candidate ${winningCandidateId} in either collection`);
        continue;
      }

      const electedDelegate = new ElectedDelegate({
        studentId: studentId,
        schoolId,
        departmentId,
        voteCount: maxVotes
      });
      
      electedDelegates.push(electedDelegate);
    }

    if (electedDelegates.length > 0) {
      await ElectedDelegate.insertMany(electedDelegates);
    }
    
    console.log(`Successfully elected ${electedDelegates.length} delegates:`);
    electedDelegates.forEach(delegate => {
      console.log(`- School ${delegate.schoolId}, Dept ${delegate.departmentId}: ${delegate.voteCount} votes`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

populateElectedDelegates();