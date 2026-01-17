const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const router = express.Router();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Contract ABI for VoterRegistry (simplified)
const VOTER_REGISTRY_ABI = [
    "function isRegisteredVoter(address voterAddress) external view returns (bool)",
    "function getVoterDetails(address voterAddress) external view returns (bool isRegistered, uint256 schoolId, uint256 departmentId, uint256 meanScore, string memory studentRegNumber, uint256 registrationTimestamp)"
];

// Contract address (update with your deployed contract address)
const CONTRACT_ADDRESS = process.env.VOTER_REGISTRY_CONTRACT_ADDRESS;

// RPC URL for blockchain connection
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

/**
 * POST /api/auth/admin-login
 * Authenticate admin with username and password
 */
router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        const admin = await Admin.findOne({ username, isActive: true });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const payload = {
            adminId: admin._id,
            username: admin.username,
            role: admin.role,
            authType: 'admin'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: payload
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/web2-login
 * Authenticate student with registration number and password
 */
router.post('/web2-login', async (req, res) => {
    try {
        const { registrationNumber, password } = req.body;

        if (!registrationNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Registration number and password are required'
            });
        }

        const student = await Student.findOne({ 
            registrationNumber: registrationNumber.trim(),
            isActive: true 
        });

        if (!student || !student.passwordHash) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or not registered. Please register first.',
                redirectToRegister: true
            });
        }

        // Check if account is locked
        if (student.isLocked && student.lockUntil && student.lockUntil > new Date()) {
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked. Try again later.'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.passwordHash);
        if (!isValidPassword) {
            // Increment login attempts
            student.loginAttempts += 1;
            if (student.loginAttempts >= 3) {
                student.isLocked = true;
                student.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            }
            await student.save();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        student.loginAttempts = 0;
        student.isLocked = false;
        student.lockUntil = null;
        student.lastLogin = new Date();
        await student.save();

        // Create JWT payload
        const payload = {
            studentId: student._id,
            registrationNumber: student.registrationNumber,
            name: student.name,
            schoolId: student.schoolId,
            departmentId: student.departmentId,
            authType: 'web2'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: payload
        });

    } catch (error) {
        console.error('Web2 login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/change-password
 * Change student password
 */
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new passwords are required'
            });
        }

        if (newPassword.length < 4) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 4 characters'
            });
        }

        const student = await Student.findById(req.user.studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, student.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        student.passwordHash = await bcrypt.hash(newPassword, 10);
        await student.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

/**
 * POST /api/auth/metamask-login
 * Authenticate user with MetaMask signature and return JWT
 */
router.post('/metamask-login', async (req, res) => {
    try {
        const { walletAddress, signature, message } = req.body;

        // Validate required fields
        if (!walletAddress || !signature || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: walletAddress, signature, message'
            });
        }

        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        // Check if user is registered in the contract
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTER_REGISTRY_ABI, provider);
        
        const isRegistered = await contract.isRegisteredVoter(walletAddress);
        
        if (!isRegistered) {
            return res.status(403).json({
                success: false,
                message: 'Wallet address not registered as voter'
            });
        }

        // Get voter details from contract
        const voterDetails = await contract.getVoterDetails(walletAddress);
        
        // Create JWT payload
        const payload = {
            walletAddress: walletAddress.toLowerCase(),
            schoolId: voterDetails.schoolId.toString(),
            departmentId: voterDetails.departmentId.toString(),
            meanScore: voterDetails.meanScore.toString(),
            studentRegNumber: voterDetails.studentRegNumber,
            isRegistered: true
        };

        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            message: 'Authentication successful',
            token,
            user: payload
        });

    } catch (error) {
        console.error('MetaMask login error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/verify-token
 * Verify JWT token and return user data
 */
router.post('/verify-token', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token required'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        res.json({
            success: true,
            message: 'Token valid',
            user: decoded
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Validate token and return user info
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentId);
    if (!student || !student.isActive) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      user: {
        id: student._id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        email: student.email,
        schoolId: student.schoolId,
        schoolName: student.schoolName,
        departmentId: student.departmentId,
        departmentName: student.departmentName,
        departmentCode: student.departmentCode,
        yearOfStudy: student.yearOfStudy,
        meanScore: student.meanScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, authenticateToken };