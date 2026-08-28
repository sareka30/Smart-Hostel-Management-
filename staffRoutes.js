const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().populate('userId', 'email isActive');
    res.json(staff);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/available', async (req, res) => {
  try {
    const staff = await Staff.find({ status: 'active' });
    res.json(staff);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(staff);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Staff.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ message: 'Staff deactivated' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/assign-task', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    staff.currentTasks.push(req.body.taskId);
    await staff.save();
    res.json(staff);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
