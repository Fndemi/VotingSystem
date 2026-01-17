const mongoose = require('mongoose');

const delegateCandidateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true, // one delegate candidacy per student
  },
  schoolId: {
    type: Number,
    required: true,
  },
  departmentId: {
    type: Number,
    required: true,
  },
  manifesto: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminComments: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: String, // Admin identifier
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DelegateCandidate', delegateCandidateSchema);


