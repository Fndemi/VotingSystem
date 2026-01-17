const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const School = require('../models/School');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ departmentId: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get departments by school
router.get('/school/:schoolId', async (req, res) => {
  try {
    const departments = await Department.find({ 
      schoolId: parseInt(req.params.schoolId) 
    }).sort({ departmentId: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new department
router.post('/', async (req, res) => {
  try {
    const { name, code, schoolId } = req.body;
    
    // Get school name
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    // Get next department ID
    const lastDept = await Department.findOne().sort({ departmentId: -1 });
    const departmentId = lastDept ? lastDept.departmentId + 1 : 0;
    
    const department = new Department({
      departmentId,
      name,
      code,
      schoolId,
      schoolName: school.name
    });
    
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;