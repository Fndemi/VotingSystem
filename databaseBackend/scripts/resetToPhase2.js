const mongoose = require('mongoose');
require('dotenv').config();

const Phase = require('../models/Phase');

async function resetToPhase2() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Set phase back to 2 (Delegate Voting)
    const newPhase = new Phase({
      currentPhase: 2,
      phaseName: 'Delegate Voting'
    });

    await newPhase.save();
    console.log('Phase reset to 2 (Delegate Voting)');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetToPhase2();