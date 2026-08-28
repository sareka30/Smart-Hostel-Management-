const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find().populate('studentId', 'name studentId blockName');
    res.json(fees);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    req.body.generatedBy = req.user._id;
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fee);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/student/:id', async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.id }).sort({ dueDate: -1 });
    res.json(fees);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Fee.aggregate([
      { $group: { _id: '$status', totalAmount: { $sum: '$amount' }, collectedAmount: { $sum: '$paidAmount' } } }
    ]);
    res.json(stats);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/overdue', async (req, res) => {
  try {
    const fees = await Fee.find({ status: { $in: ['pending', 'overdue'] }, dueDate: { $lt: new Date() } }).populate('studentId', 'name studentId');
    res.json(fees);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
