const mongoose = require('mongoose');

const councilVoteSchema = new mongoose.Schema({
  delegateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  slotId: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
}, {
  timestamps: true
});

// Ensure delegate can only vote once per slot
councilVoteSchema.index({ delegateId: 1, slotId: 1 }, { unique: true });

module.exports = mongoose.model('CouncilVote', councilVoteSchema);
