const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  
  // Slot 0: Chairperson + Vice Chairperson
  slot0: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    position: {
      type: String,
      required: true
    }
  }],
  
  // Slot 1: Secretary General + Gender/Disability Secretary
  slot1: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    position: {
      type: String,
      required: true
    }
  }],
  
  // Slot 2: Treasurer + Sports Secretary
  slot2: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    position: {
      type: String,
      required: true
    }
  }],
  
  // Slot 3: Town Campus Secretary
  slot3: {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    position: {
      type: String,
      required: true
    }
  },
  
  // Vote tracking
  totalVotes: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Party', partySchema);
