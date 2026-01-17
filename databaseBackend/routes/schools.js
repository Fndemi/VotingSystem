const express = require('express');
const router = express.Router();
const School = require('../models/School');

// Get all schools
router.get('/', async (req, res) => {
  try {
    const schools = await School.find().sort({ schoolId: 1 });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new school 
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Get next school ID
    const lastSchool = await School.findOne().sort({ schoolId: -1 });
    const schoolId = lastSchool ? lastSchool.schoolId + 1 : 0;

    const school = new School({
      schoolId,
      name
    });

    await school.save();
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;