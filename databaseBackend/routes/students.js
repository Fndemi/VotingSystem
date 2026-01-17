const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcrypt');

// Simple student registration
router.post('/register', async (req, res) => {
  try {
    const { registrationNumber, name, email, password } = req.body;
    
    if (!registrationNumber || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ registrationNumber });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this registration number already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const student = new Student({
      registrationNumber,
      name,
      email,
      passwordHash,
      isActive: true
    });
    
    await student.save();
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all registration numbers for login dropdown
router.get('/registration-numbers', async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }, 'registrationNumber name');
    const regNumbers = students.map(student => ({
      registrationNumber: student.registrationNumber,
      name: student.name
    }));
    res.json(regNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search students for autocomplete
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    // Create more flexible search patterns
    const searchTerm = q ? q.trim() : '';
    if (!searchTerm) {
      return res.json([]);
    }
    const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    
    // Search with multiple criteria for better matching
    const students = await Student.find({
      isActive: true,
      $or: [
        { registrationNumber: searchRegex },
        { name: searchRegex },
        { registrationNumber: { $regex: searchTerm.split('').join('.*'), $options: 'i' } },
        { name: { $regex: searchTerm.split(' ').join('.*'), $options: 'i' } }
      ]
    }, 'registrationNumber name email schoolName departmentName')
    .limit(parseInt(limit))
    .sort({ 
      // Prioritize exact matches first
      registrationNumber: 1,
      name: 1
    });
    
    // Remove duplicates and format results
    const uniqueStudents = students.filter((student, index, self) => 
      index === self.findIndex(s => s.registrationNumber === student.registrationNumber)
    );
    
    const results = uniqueStudents.map(student => ({
      registrationNumber: student.registrationNumber,
      name: student.name,
      email: student.email,
      schoolName: student.schoolName,
      departmentName: student.departmentName
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup password for first-time login
router.post('/setup-password', async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;
    
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    
    const student = await Student.findOne({ registrationNumber, isActive: true });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (student.passwordHash) {
      return res.status(400).json({ error: 'Password already set' });
    }
    
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);
    
    student.passwordHash = passwordHash;
    await student.save();
    
    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const students = await Student.find({ 
      departmentId: parseInt(req.params.departmentId),
      isActive: true 
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by school
router.get('/school/:schoolId', async (req, res) => {
  try {
    const students = await Student.find({ 
      schoolId: parseInt(req.params.schoolId),
      isActive: true 
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by registration number
router.get('/registration/:regNo(*)', async (req, res) => {
  try {
    // Decode the registration number to handle forward slashes
    const regNo = decodeURIComponent(req.params.regNo);
    const student = await Student.findOne({ 
      registrationNumber: regNo,
      isActive: true 
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student wallet address
router.patch('/:id/wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    // Validate wallet address format
    if (!walletAddress || typeof walletAddress !== 'string' || 
        !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { walletAddress },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;