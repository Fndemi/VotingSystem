const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const DelegateCandidate = require('../models/DelegateCandidate');
const ElectedDelegate = require('../models/ElectedDelegate');

async function updateElectedDelegates() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    
    // Clear existing elected delegates
    await ElectedDelegate.deleteMany({});
    
    // Get all candidates with votes, grouped by department
    const candidates = await DelegateCandidate.aggregate([
      { $match: { isActive: true, voteCount: { $gt: 0 } } },
      { $sort: { voteCount: -1 } },
      {
        $group: {
          _id: { schoolId: '$schoolId', departmentId: '$departmentId' },
          winner: { $first: '$$ROOT' }
        }
      }
    ]);
    
    // Create elected delegates from winners
    const electedDelegates = candidates.map(group => ({
      studentId: group.winner.studentId,
      schoolId: group.winner.schoolId,
      departmentId: group.winner.departmentId,
      voteCount: group.winner.voteCount
    }));
    
    if (electedDelegates.length > 0) {
      await ElectedDelegate.insertMany(electedDelegates);
    }
    
    return electedDelegates.length;
  } catch (error) {
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { updateElectedDelegates };

// Run if called directly
if (require.main === module) {
  updateElectedDelegates()
    .then(count => console.log(`Updated ${count} elected delegates`))
    .catch(console.error);
}