const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('studentId', 'name').populate('assignedTo', 'name');
    res.json(complaints);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('studentId').populate('assignedTo');
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const count = await Complaint.countDocuments();
    req.body.complaintId = `CMP${(count + 1).toString().padStart(4, '0')}`;
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/assign', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { 
      assignedTo: req.body.assignedTo, 
      status: 'assigned',
      assignedAt: Date.now()
    }, { new: true });
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    const update = { status };
    if (status === 'resolved') update.resolvedAt = Date.now();
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
      $set: update,
      $push: { timeline: { action: `Status changed to ${status}`, by: req.user.name, timestamp: Date.now(), note } }
    }, { new: true });
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
