const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const router = express.Router();

/**
 * POST /api/registration/validate-reg-number
 * Validate registration number and return student info for confirmation
 */
router.post('/validate-reg-number', async (req, res) => {
    try {
        const { registrationNumber } = req.body;

        if (!registrationNumber) {
            return res.status(400).json({
                success: false,
                message: 'Registration number is required'
            });
        }

        const student = await Student.findOne({ 
            registrationNumber: registrationNumber.trim(),
            isActive: true 
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Registration number not found in our records'
            });
        }

        // Return student info for confirmation (without sensitive data)
        res.json({
            success: true,
            message: 'Registration number found',
            student: {
                registrationNumber: student.registrationNumber,
                name: student.name,
                schoolName: student.schoolName,
                departmentName: student.departmentName,
                yearOfStudy: student.yearOfStudy,
                hasSetPassword: !!student.passwordHash
            }
        });

    } catch (error) {
        console.error('Registration validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Validation failed'
        });
    }
});

/**
 * POST /api/registration/setup-password
 * Set up password for first-time users
 */
router.post('/setup-password', async (req, res) => {
    try {
        const { registrationNumber, password, confirmPassword } = req.body;

        if (!registrationNumber || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const student = await Student.findOne({ 
            registrationNumber: registrationNumber.trim(),
            isActive: true 
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Registration number not found'
            });
        }

        if (student.passwordHash) {
            return res.status(400).json({
                success: false,
                message: 'Password already set. Use login instead.'
            });
        }

        // Hash and save password
        student.passwordHash = await bcrypt.hash(password, 10);
        await student.save();

        res.json({
            success: true,
            message: 'Password set successfully. You can now login.'
        });

    } catch (error) {
        console.error('Password setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to set password'
        });
    }
});

/**
 * GET /api/registration/autocomplete-reg-number
 * Autocomplete registration numbers as user types
 */
router.get('/autocomplete-reg-number', async (req, res) => {
    try {
        const { q, limit = 5 } = req.query;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        const students = await Student.find({
            registrationNumber: { $regex: `^${q}`, $options: 'i' },
            isActive: true
        })
        .select('registrationNumber name')
        .limit(parseInt(limit))
        .sort({ registrationNumber: 1 });

        const suggestions = students.map(student => ({
            registrationNumber: student.registrationNumber,
            displayText: `${student.registrationNumber} - ${student.name}`
        }));

        res.json({
            success: true,
            suggestions
        });

    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({
            success: false,
            message: 'Autocomplete failed'
        });
    }
});

module.exports = router;