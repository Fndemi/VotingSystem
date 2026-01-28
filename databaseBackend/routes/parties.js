const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const Student = require('../models/Student');
const Phase = require('../models/Phase');
const ElectedDelegate = require('../models/ElectedDelegate');

// Helper: get latest phase number
async function getCurrentPhaseNumber() {
  const phase = await Phase.findOne().sort({ createdAt: -1 });
  return phase ? phase.currentPhase : 0;
}

// Register party with 7 nominees
router.post('/register', async (req, res) => {
  try {
    const { name, slot0, slot1, slot2, slot3 } = req.body;

    // Validate phase
    const currentPhase = await getCurrentPhaseNumber();
    if (currentPhase !== 4) {
      return res.status(400).json({ error: 'Party registration is not open at this time' });
    }

    // Validate party name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Party name is required' });
    }

    // Check if party name already exists
    const existingParty = await Party.findOne({ name: name.trim(), isActive: true });
    if (existingParty) {
      return res.status(400).json({ error: 'Party name already exists' });
    }

    // Validate all slots are provided
    if (!slot0 || slot0.length !== 2 || !slot1 || slot1.length !== 2 || 
        !slot2 || slot2.length !== 2 || !slot3) {
      return res.status(400).json({ error: 'All 7 positions must be filled' });
    }

    // Collect all student IDs
    const allStudentIds = [
      slot0[0].studentId, slot0[1].studentId,
      slot1[0].studentId, slot1[1].studentId,
      slot2[0].studentId, slot2[1].studentId,
      slot3.studentId
    ];

    // Check for duplicates
    const uniqueIds = new Set(allStudentIds.map(id => id.toString()));
    if (uniqueIds.size !== 7) {
      return res.status(400).json({ error: 'Cannot have duplicate nominees in the same party' });
    }

    // Validate all students exist and have meanScore >= 60
    const students = await Student.find({ _id: { $in: allStudentIds }, isActive: true });
    
    if (students.length !== 7) {
      return res.status(400).json({ error: 'One or more students not found' });
    }

    for (const student of students) {
      if (student.meanScore < 60) {
        return res.status(400).json({ 
          error: `${student.name} has a mean score below 60 and cannot be a nominee` 
        });
      }
    }

    // Check if any student is an elected delegate
    const electedDelegates = await ElectedDelegate.find({ studentId: { $in: allStudentIds } });
    if (electedDelegates.length > 0) {
      const delegateStudent = students.find(s => 
        electedDelegates.some(d => d.studentId.toString() === s._id.toString())
      );
      return res.status(400).json({ 
        error: `${delegateStudent.name} is an elected delegate and cannot be a party nominee` 
      });
    }

    // Check if any student is already in another party
    const existingParties = await Party.find({ isActive: true });
    for (const party of existingParties) {
      const partyStudentIds = [
        ...party.slot0.map(s => s.studentId.toString()),
        ...party.slot1.map(s => s.studentId.toString()),
        ...party.slot2.map(s => s.studentId.toString()),
        party.slot3.studentId.toString()
      ];
      
      for (const studentId of allStudentIds) {
        if (partyStudentIds.includes(studentId.toString())) {
          const student = students.find(s => s._id.toString() === studentId.toString());
          return res.status(400).json({ 
            error: `${student.name} is already registered in another party` 
          });
        }
      }
    }

    // Create party
    const party = new Party({
      name: name.trim(),
      slot0,
      slot1,
      slot2,
      slot3
    });

    await party.save();
    await party.populate('slot0.studentId slot1.studentId slot2.studentId slot3.studentId');

    res.status(201).json({
      message: 'Party registered successfully',
      party: {
        id: party._id,
        name: party.name,
        slot0: party.slot0.map(s => ({ name: s.studentId.name, position: s.position })),
        slot1: party.slot1.map(s => ({ name: s.studentId.name, position: s.position })),
        slot2: party.slot2.map(s => ({ name: s.studentId.name, position: s.position })),
        slot3: { name: party.slot3.studentId.name, position: party.slot3.position }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find({ isActive: true })
      .populate('slot0.studentId slot1.studentId slot2.studentId slot3.studentId')
      .sort({ createdAt: 1 });

    const formattedParties = parties.map(party => ({
      id: party._id,
      name: party.name,
      slot0: party.slot0.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot1: party.slot1.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot2: party.slot2.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot3: {
        studentId: party.slot3.studentId._id,
        name: party.slot3.studentId.name,
        registrationNumber: party.slot3.studentId.registrationNumber,
        position: party.slot3.position
      },
      votesPerSlot: party.votesPerSlot
    }));

    res.json(formattedParties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single party
router.get('/:partyId', async (req, res) => {
  try {
    const party = await Party.findById(req.params.partyId)
      .populate('slot0.studentId slot1.studentId slot2.studentId slot3.studentId');

    if (!party || !party.isActive) {
      return res.status(404).json({ error: 'Party not found' });
    }

    res.json({
      id: party._id,
      name: party.name,
      slot0: party.slot0.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot1: party.slot1.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot2: party.slot2.map(s => ({
        studentId: s.studentId._id,
        name: s.studentId.name,
        registrationNumber: s.studentId.registrationNumber,
        position: s.position
      })),
      slot3: {
        studentId: party.slot3.studentId._id,
        name: party.slot3.studentId.name,
        registrationNumber: party.slot3.studentId.registrationNumber,
        position: party.slot3.position
      },
      votesPerSlot: party.votesPerSlot
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
