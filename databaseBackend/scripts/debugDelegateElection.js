const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const ElectedDelegate = require('../models/ElectedDelegate');
const Phase = require('../models/Phase');
const Student = require('../models/Student');

async function debugDelegateElection() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Check current phase
    const currentPhase = await Phase.findOne().sort({ createdAt: -1 });
    console.log('\n=== CURRENT PHASE ===');
    console.log('Phase:', currentPhase ? currentPhase.currentPhase : 'No phase set');
    console.log('Phase Name:', currentPhase ? currentPhase.phaseName : 'N/A');

    // Check delegate candidates
    const candidates = await DelegateCandidate.find({}).populate('studentId');
    console.log('\n=== DELEGATE CANDIDATES ===');
    console.log('Total candidates:', candidates.length);
    candidates.forEach(candidate => {
      console.log(`- ${candidate.studentId.name} (${candidate.studentId.registrationNumber})`);
      console.log(`  School: ${candidate.schoolId}, Dept: ${candidate.departmentId}`);
      console.log(`  Status: ${candidate.status}, Vote Count: ${candidate.voteCount}`);
      console.log(`  Active: ${candidate.isActive}`);
    });

    // Check delegate votes
    const votes = await DelegateVote.find({}).populate('studentId').populate('candidateId');
    console.log('\n=== DELEGATE VOTES ===');
    console.log('Total votes:', votes.length);
    
    // Group votes by department
    const votesByDept = {};
    votes.forEach(vote => {
      const key = `${vote.schoolId}-${vote.departmentId}`;
      if (!votesByDept[key]) {
        votesByDept[key] = {};
      }
      const candidateId = vote.candidateId._id.toString();
      votesByDept[key][candidateId] = (votesByDept[key][candidateId] || 0) + 1;
    });

    console.log('Votes by department:');
    Object.entries(votesByDept).forEach(([deptKey, candidateVotes]) => {
      console.log(`\nDepartment ${deptKey}:`);
      Object.entries(candidateVotes).forEach(([candidateId, count]) => {
        const candidate = candidates.find(c => c._id.toString() === candidateId);
        const candidateName = candidate ? candidate.studentId.name : 'Unknown';
        console.log(`  ${candidateName}: ${count} votes`);
      });
    });

    // Check elected delegates
    const electedDelegates = await ElectedDelegate.find({}).populate('studentId');
    console.log('\n=== ELECTED DELEGATES ===');
    console.log('Total elected delegates:', electedDelegates.length);
    electedDelegates.forEach(delegate => {
      console.log(`- ${delegate.studentId.name} (${delegate.studentId.registrationNumber})`);
      console.log(`  School: ${delegate.schoolId}, Dept: ${delegate.departmentId}`);
      console.log(`  Vote Count: ${delegate.voteCount}`);
      console.log(`  Elected At: ${delegate.createdAt}`);
    });

    if (electedDelegates.length === 0) {
      console.log('\n=== ANALYSIS ===');
      console.log('No elected delegates found. Possible issues:');
      console.log('1. Tally endpoint has not been called');
      console.log('2. No votes were cast');
      console.log('3. Error in tally logic');
      
      if (votes.length > 0) {
        console.log('\nSince votes exist, you should run the tally endpoint:');
        console.log('POST /api/delegate-voting/tally');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugDelegateElection();