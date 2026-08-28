const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const emergencies = await Emergency.find().populate('studentId', 'name room').sort({ reportedAt: -1 });
    res.json(emergencies);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/active', async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: { $in: ['active', 'acknowledged', 'responding'] } });
    res.json(emergencies);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const emergency = await Emergency.create(req.body);
    // Real-time alert would be emitted here via socket
    req.app.get('io').emit('emergency:alert', emergency);
    res.status(201).json(emergency);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/acknowledge', async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, { 
      status: 'acknowledged', 
      acknowledgedBy: req.user._id, 
      acknowledgedAt: Date.now() 
    }, { new: true });
    res.json(emergency);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/resolve', async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, { 
      status: 'resolved', 
      resolvedBy: req.user._id, 
      resolvedAt: Date.now(),
      notes: req.body.notes
    }, { new: true });
    res.json(emergency);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
