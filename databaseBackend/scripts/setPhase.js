const mongoose = require('mongoose');
const Phase = require('../models/Phase');

// Set phase to Candidate Registration for testing
async function setPhase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockvote');
    
    const phase = new Phase({
      currentPhase: 1,
      phaseName: 'Candidate Registration'
    });
    
    await phase.save();
    console.log('Phase set to: Candidate Registration');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setPhase();