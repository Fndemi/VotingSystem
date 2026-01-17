const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');
const DelegateCandidate = require('../models/DelegateCandidate');
const DelegateVote = require('../models/DelegateVote');
const ElectedDelegate = require('../models/ElectedDelegate');
const Party = require('../models/Party');
const CouncilVote = require('../models/CouncilVote');
const Phase = require('../models/Phase');

async function resetElection() {
  try {
    // Check if DATABASE_URL is loaded
    if (!process.env.DATABASE_URL) {
      console.error('ERROR: DATABASE_URL is not set in .env file');
      console.error('Please make sure you have a .env file in the databaseBackend directory with:');
      console.error('DATABASE_URL=mongodb://your-connection-string');
      process.exit(1);
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== RESETTING ELECTION ===\n');

    // Clear all votes
    const votesDeleted = await DelegateVote.deleteMany({});
    console.log(`✓ Deleted ${votesDeleted.deletedCount} delegate votes`);

    const councilVotesDeleted = await CouncilVote.deleteMany({});
    console.log(`✓ Deleted ${councilVotesDeleted.deletedCount} council votes`);

    // Clear all candidates
    const delegateCandidatesDeleted = await DelegateCandidate.deleteMany({});
    console.log(`✓ Deleted ${delegateCandidatesDeleted.deletedCount} delegate candidates`);

    // Clear elected delegates
    const electedDelegatesDeleted = await ElectedDelegate.deleteMany({});
    console.log(`✓ Deleted ${electedDelegatesDeleted.deletedCount} elected delegates`);

    // Clear parties
    const partiesDeleted = await Party.deleteMany({});
    console.log(`✓ Deleted ${partiesDeleted.deletedCount} parties`);

    // Reset student passwords (keep students but clear registration)
    const studentsUpdated = await Student.updateMany(
      {},
      {
        $unset: {
          passwordHash: 1,
          walletAddress: 1,
          lastLogin: 1
        },
        $set: {
          loginAttempts: 0,
          isLocked: false,
          lockUntil: null
        }
      }
    );
    console.log(`✓ Reset passwords for ${studentsUpdated.modifiedCount} students`);

    // Reset phase to 0 (Registration)
    await Phase.deleteMany({});
    const newPhase = new Phase({
      currentPhase: 0,
      phaseName: 'Registration',
    });
    await newPhase.save();
    console.log(`✓ Reset phase to 0 (Registration)`);

    console.log('\n=== ELECTION RESET COMPLETE ===');
    console.log('\nNext steps:');
    console.log('1. Students kept but passwords cleared');
    console.log('2. Students need to set new passwords');
    console.log('3. Phase reset to 0 (Registration)');
    console.log('4. Start testing from password setup');

  } catch (error) {
    console.error('Error resetting election:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the reset
resetElection();

