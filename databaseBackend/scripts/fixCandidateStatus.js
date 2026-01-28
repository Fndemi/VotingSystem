const mongoose = require('mongoose');
const DelegateCandidate = require('../models/DelegateCandidate');
const Student = require('../models/Student');
require('dotenv').config();

async function fixCandidateStatus() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Find all candidates with undefined or null status
    const candidatesWithoutStatus = await DelegateCandidate.find({
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: undefined }
      ]
    });

    console.log(`Found ${candidatesWithoutStatus.length} candidates without proper status`);

    // Update them with default values
    const updateResult = await DelegateCandidate.updateMany(
      {
        $or: [
          { status: { $exists: false } },
          { status: null },
          { status: undefined }
        ]
      },
      {
        $set: {
          status: 'pending',
          adminComments: '',
          reviewedBy: null,
          reviewedAt: null
        }
      }
    );

    console.log(`Updated ${updateResult.modifiedCount} candidate records`);

    // Find all candidates with undefined adminComments
    const candidatesWithoutComments = await DelegateCandidate.find({
      $or: [
        { adminComments: { $exists: false } },
        { adminComments: null },
        { adminComments: undefined }
      ]
    });

    console.log(`Found ${candidatesWithoutComments.length} candidates without adminComments`);

    // Update adminComments
    const updateCommentsResult = await DelegateCandidate.updateMany(
      {
        $or: [
          { adminComments: { $exists: false } },
          { adminComments: null },
          { adminComments: undefined }
        ]
      },
      {
        $set: {
          adminComments: ''
        }
      }
    );

    console.log(`Updated ${updateCommentsResult.modifiedCount} candidate adminComments`);

    // Show all candidates after fix
    const allCandidates = await DelegateCandidate.find({}).populate('studentId');
    console.log('\nAll candidates after fix:');
    allCandidates.forEach(candidate => {
      console.log(`- ${candidate.studentId?.name || 'Unknown'} (${candidate.studentId?.registrationNumber || 'No RegNo'}): Status=${candidate.status}, Comments="${candidate.adminComments}"`);
    });

  } catch (error) {
    console.error('Error fixing candidate status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixCandidateStatus();