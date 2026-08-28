const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Complaint = require('../models/Complaint');
const Fee = require('../models/Fee');
const LeaveRequest = require('../models/LeaveRequest');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'email').populate('roomId', 'roomNumber block');
    res.json(students);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('roomId');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ message: 'Student marked as inactive' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id/attendance', async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.id }).sort({ date: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id/complaints', async (req, res) => {
  try {
    const records = await Complaint.find({ studentId: req.params.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id/fees', async (req, res) => {
  try {
    const records = await Fee.find({ studentId: req.params.id }).sort({ dueDate: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id/leave', async (req, res) => {
  try {
    const records = await LeaveRequest.find({ studentId: req.params.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
