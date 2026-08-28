const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('studentId', 'name studentId room');
    res.json(visitors);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('studentId');
    res.json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visitor record deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/approve', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { 
      status: 'approved', 
      approvedBy: req.user._id 
    }, { new: true });
    res.json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/checkin', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { 
      status: 'checked_in', 
      actualArrival: Date.now() 
    }, { new: true });
    res.json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/checkout', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { 
      status: 'checked_out', 
      actualDeparture: Date.now() 
    }, { new: true });
    res.json(visitor);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
