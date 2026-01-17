const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: String,
    required: true
  },
  meanScore: {
    type: Number,
    required: true
  },
  schoolId: {
    type: Number,
    required: true
  },
  schoolName: {
    type: String,
    required: true
  },
  departmentId: {
    type: Number,
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },
  departmentCode: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    default: null
  },
  passwordHash: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field for hasSetPassword
studentSchema.virtual('hasSetPassword').get(function() {
  return !!this.passwordHash;
});

module.exports = mongoose.model('Student', studentSchema);