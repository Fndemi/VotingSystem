const mongoose = require('mongoose');

const delegateVoteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true, // one vote per student
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DelegateCandidate',
    required: true,
  },
  schoolId: {
    type: Number,
    required: true,
  },
  departmentId: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DelegateVote', delegateVoteSchema);


