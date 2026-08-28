const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('studentId', 'name studentId');
    res.json(leaves);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/pending', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'pending' }).populate('studentId', 'name studentId');
    res.json(leaves);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate('studentId');
    res.json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave request deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/approve', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      approvedBy: req.user._id,
      approvedAt: Date.now()
    }, { new: true });
    res.json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/reject', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      approvedBy: req.user._id,
      approvedAt: Date.now(),
      rejectionReason: req.body.reason
    }, { new: true });
    res.json(leave);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
