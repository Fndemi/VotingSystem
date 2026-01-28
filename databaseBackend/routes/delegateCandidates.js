const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const DelegateCandidate = require('../models/DelegateCandidate');
const Phase = require('../models/Phase');

// Helper: get latest phase number
async function getCurrentPhaseNumber() {
  const phase = await Phase.findOne().sort({ createdAt: -1 });
  return phase ? phase.currentPhase : 0;
}

// Register as delegate candidate (Web2, by registration number)
router.post('/register', async (req, res) => {
  try {
    console.log('Delegate candidate registration request:', req.body);
    const { registrationNumber, manifesto } = req.body;

    if (!registrationNumber) {
      console.log('Missing required field: registrationNumber');
      return res.status(400).json({ error: 'registrationNumber is required' });
    }

    console.log('Checking current phase...');
    const currentPhase = await getCurrentPhaseNumber();
    console.log('Current phase:', currentPhase);
    if (currentPhase !== 1) {
      return res.status(400).json({ error: 'Candidate registration is not open at this time' });
    }

    console.log('Looking up student with registration number:', registrationNumber);
    const student = await Student.findOne({ registrationNumber, isActive: true });
    if (!student) {
      console.log('Student not found for registration number:', registrationNumber);
      return res.status(404).json({ error: 'Student not found or inactive' });
    }
    console.log('Found student:', student.name, 'Score:', student.meanScore);

    if (student.meanScore < 60) {
      return res.status(400).json({ error: 'Mean score must be 60 or higher to register as candidate' });
    }

    console.log('Checking for existing candidate application...');
    const existing = await DelegateCandidate.findOne({ studentId: student._id, isActive: true });
    if (existing) {
      console.log('Student already has candidate application:', existing._id);
      return res.status(400).json({ error: 'Student already has a candidate application' });
    }

    console.log('Creating new candidate application...');
    const candidate = new DelegateCandidate({
      studentId: student._id,
      schoolId: student.schoolId,
      departmentId: student.departmentId,
      manifesto: manifesto || '',
      status: 'pending', // Application starts as pending
    });

    await candidate.save();
    console.log('Candidate application saved:', candidate._id);
    
    await candidate.populate('studentId');
    console.log('Candidate application populated successfully');

    res.status(201).json({
      message: 'Candidate application submitted successfully. Awaiting admin approval.',
      application: {
        id: candidate._id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        status: candidate.status,
        appliedAt: candidate.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in delegate candidate registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get candidates for a given department (only approved ones for voting)
router.get('/department/:schoolId/:departmentId', async (req, res) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    const departmentId = parseInt(req.params.departmentId, 10);

    if (Number.isNaN(schoolId) || Number.isNaN(departmentId)) {
      return res.status(400).json({ error: 'Invalid schoolId or departmentId' });
    }

    // Get approved delegate candidates for the department
    const delegateCandidates = await DelegateCandidate.find({
      schoolId,
      departmentId,
      status: 'approved',
      isActive: true,
    }).populate('studentId');

    // Filter out any with null studentId and map to response format
    const candidates = delegateCandidates
      .filter(c => c.studentId)
      .map((c) => ({
        id: c._id,
        name: c.studentId.name,
        registrationNumber: c.studentId.registrationNumber,
        manifesto: c.manifesto,
        voteCount: c.voteCount,
      }));

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching department candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get candidate status for a student
router.get('/status/:registrationNumber', async (req, res) => {
  try {
    console.log('Getting status for registration number:', req.params.registrationNumber);
    const student = await Student.findOne({
      registrationNumber: req.params.registrationNumber,
      isActive: true,
    });

    if (!student) {
      console.log('Student not found:', req.params.registrationNumber);
      return res.status(404).json({ error: 'Student not found or inactive' });
    }

    console.log('Found student:', student.name, 'ID:', student._id);
    const candidate = await DelegateCandidate.findOne({
      studentId: student._id,
      isActive: true,
    });

    if (!candidate) {
      console.log('No candidate application found for student:', student._id);
      return res.json({ isCandidate: false });
    }

    // Fix for existing candidates without status field - force update
    if (candidate.status === undefined || candidate.status === null) {
      console.log('Fixing candidate without status field');
      await DelegateCandidate.updateOne(
        { _id: candidate._id },
        { $set: { status: 'pending', adminComments: '', reviewedBy: null, reviewedAt: null } }
      );
      candidate.status = 'pending';
      candidate.adminComments = '';
      console.log('Updated candidate with default values');
    }

    console.log('Found candidate application:', {
      id: candidate._id,
      status: candidate.status,
      adminComments: candidate.adminComments,
      reviewedAt: candidate.reviewedAt
    });

    const responseData = {
      isCandidate: true,
      candidate: {
        id: candidate._id,
        manifesto: candidate.manifesto,
        voteCount: candidate.voteCount,
        status: candidate.status || 'pending',
        adminComments: candidate.adminComments || '',
        reviewedAt: candidate.reviewedAt,
        appliedAt: candidate.createdAt
      },
    };
    
    console.log('Sending response:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (error) {
    console.error('Error in status endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


// Admin: Get all pending applications
router.get('/pending', async (req, res) => {
  try {
    const applications = await DelegateCandidate.find({
      status: 'pending',
      isActive: true,
    }).populate('studentId').sort({ createdAt: -1 });

    res.json(
      applications.map((app) => ({
        id: app._id,
        name: app.studentId.name,
        registrationNumber: app.studentId.registrationNumber,
        schoolId: app.schoolId,
        departmentId: app.departmentId,
        manifesto: app.manifesto,
        appliedAt: app.createdAt,
        status: app.status,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve/Reject application
router.patch('/:applicationId/review', async (req, res) => {
  try {
    const { status, adminComments, adminId } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const application = await DelegateCandidate.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Application has already been reviewed' });
    }

    application.status = status;
    application.adminComments = adminComments || '';
    application.reviewedBy = adminId || 'admin';
    application.reviewedAt = new Date();

    await application.save();
    await application.populate('studentId');

    res.json({
      message: `Application ${status} successfully`,
      application: {
        id: application._id,
        name: application.studentId.name,
        registrationNumber: application.studentId.registrationNumber,
        status: application.status,
        adminComments: application.adminComments,
        reviewedAt: application.reviewedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});