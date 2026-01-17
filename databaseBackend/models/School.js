const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('School', schoolSchema);