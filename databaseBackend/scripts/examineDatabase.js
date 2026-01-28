const mongoose = require('mongoose');
const DelegateCandidate = require('../models/DelegateCandidate');
const Student = require('../models/Student');
require('dotenv').config();

async function examineDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Get all candidates with full details
    const candidates = await DelegateCandidate.find({}).populate('studentId');
    
    console.log(`\nFound ${candidates.length} candidates in database:`);
    
    candidates.forEach((candidate, index) => {
      console.log(`\n=== Candidate ${index + 1} ===`);
      console.log('ID:', candidate._id);
      console.log('Student:', candidate.studentId?.name || 'Unknown');
      console.log('Registration Number:', candidate.studentId?.registrationNumber || 'Unknown');
      console.log('Raw candidate object keys:', Object.keys(candidate.toObject()));
      console.log('Status:', candidate.status);
      console.log('Status type:', typeof candidate.status);
      console.log('AdminComments:', candidate.adminComments);
      console.log('AdminComments type:', typeof candidate.adminComments);
      console.log('ReviewedBy:', candidate.reviewedBy);
      console.log('ReviewedAt:', candidate.reviewedAt);
      console.log('CreatedAt:', candidate.createdAt);
      console.log('Full object:', JSON.stringify(candidate.toObject(), null, 2));
    });

    // Test the specific query used in the API
    console.log('\n=== Testing API Query ===');
    const student = await Student.findOne({
      registrationNumber: 'MED/2024/001',
      isActive: true,
    });
    
    if (student) {
      console.log('Found student:', student.name, 'ID:', student._id);
      const candidate = await DelegateCandidate.findOne({
        studentId: student._id,
        isActive: true,
      });
      
      if (candidate) {
        console.log('Found candidate via API query:');
        console.log('Status:', candidate.status);
        console.log('AdminComments:', candidate.adminComments);
        console.log('Full candidate object:', JSON.stringify(candidate.toObject(), null, 2));
      } else {
        console.log('No candidate found via API query');
      }
    } else {
      console.log('Student not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

examineDatabase();