const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const requests = await Maintenance.find().populate('assignedTo', 'name');
    res.json(requests);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Maintenance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id).populate('assignedTo');
    res.json(request);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const count = await Maintenance.countDocuments();
    req.body.requestId = `MN${(count + 1).toString().padStart(4, '0')}`;
    const request = await Maintenance.create(req.body);
    res.status(201).json(request);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(request);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance request deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/assign', async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndUpdate(req.params.id, { 
      assignedTo: req.body.assignedTo, 
      status: 'assigned',
      assignedAt: Date.now()
    }, { new: true });
    res.json(request);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'completed') update.completedAt = Date.now();
    const request = await Maintenance.findByIdAndUpdate(req.params.id, {
      $set: update,
      $push: { timeline: { action: `Status changed to ${status}`, by: req.user.name, timestamp: Date.now() } }
    }, { new: true });
    res.json(request);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
