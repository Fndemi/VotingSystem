const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DelegateVote = require('../models/DelegateVote');
const Candidate = require('../models/Candidate');

async function fixVoteCounts() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Get all delegate votes
    const votes = await DelegateVote.find({});
    console.log(`Found ${votes.length} delegate votes`);

    // Count votes per candidate
    const voteCounts = {};
    votes.forEach(vote => {
      const candidateId = vote.candidateId.toString();
      voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
    });

    console.log('Vote counts per candidate:', voteCounts);

    // Update each candidate's vote count
    for (const [candidateId, count] of Object.entries(voteCounts)) {
      const result = await Candidate.updateOne(
        { _id: candidateId },
        { $set: { voteCount: count } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`Updated candidate ${candidateId} vote count to ${count}`);
      } else {
        console.log(`Candidate ${candidateId} not found in Candidate collection`);
      }
    }

    console.log('Vote count fix completed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixVoteCounts();