const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');
const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const CouncilVote = require('../models/CouncilVote');
const Phase = require('../models/Phase');

async function checkElectionData() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB\n');

    // Check current phase
    const phase = await Phase.findOne().sort({ createdAt: -1 });
    console.log('=== CURRENT PHASE ===');
    console.log(`Phase: ${phase ? phase.currentPhase : 'No phase set'} - ${phase ? phase.phaseName : 'Unknown'}\n`);

    // Check delegate candidates
    const delegateCandidates = await DelegateCandidate.find({}).populate('studentId');
    console.log('=== DELEGATE CANDIDATES ===');
    console.log(`Total: ${delegateCandidates.length}`);
    delegateCandidates.forEach(candidate => {
      console.log(`- ${candidate.studentId?.name || 'Unknown'} (${candidate.studentId?.registrationNumber || 'No reg'}) - Status: ${candidate.status}`);
    });

    // Check delegate votes
    const delegateVotes = await DelegateVote.find({});
    console.log('\n=== DELEGATE VOTES ===');
    console.log(`Total: ${delegateVotes.length}`);

    // Check council votes
    const councilVotes = await CouncilVote.find({});
    console.log('\n=== COUNCIL VOTES ===');
    console.log(`Total: ${councilVotes.length}`);

  } catch (error) {
    console.error('Error checking election data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkElectionData();