const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  currentPhase: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 6
  },
  phaseName: {
    type: String,
    required: true,
    enum: ['Registration', 'Candidate Registration', 'Delegate Voting', 'Nominee Registration', 'Party Registration', 'Council Voting', 'Ended']
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Phase', phaseSchema);