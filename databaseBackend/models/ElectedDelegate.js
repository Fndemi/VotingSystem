const mongoose = require('mongoose');

const electedDelegateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
  voteCount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// One elected delegate per (schoolId, departmentId)
electedDelegateSchema.index({ schoolId: 1, departmentId: 1 }, { unique: true });

module.exports = mongoose.model('ElectedDelegate', electedDelegateSchema);


