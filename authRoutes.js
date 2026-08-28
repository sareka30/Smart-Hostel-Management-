const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Open student self-registration
router.post('/register-student', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'student', phone });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-only user creation for staff/warden/etc
router.post('/register', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password, role, phone });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password)) && user.role === role) {
      if (!user.isActive) return res.status(403).json({ message: 'Account is inactive' });
      user.lastLogin = Date.now();
      user.loginHistory.push(Date.now());
      await user.save();
      
      await AuditLog.create({
        userId: user._id, action: 'LOGIN', module: 'Auth', description: 'User logged in', ipAddress: req.ip
      });

      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email, password, or role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', protect, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Incorrect current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  console.log(`Password reset requested for: ${req.body.email}`);
  res.json({ message: 'If the email exists, a reset link will be sent.' });
});

router.get('/audit-logs', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('userId', 'name email').sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
