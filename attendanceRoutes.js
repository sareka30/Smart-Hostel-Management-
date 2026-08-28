const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('studentId', 'name studentId');
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { records } = req.body; // array of { studentId, date, status, remarks }
    const ops = records.map(record => ({
      updateOne: {
        filter: { studentId: record.studentId, date: record.date },
        update: { ...record, markedBy: req.user._id },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(ops);
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const present = await Attendance.countDocuments({ date: today, status: 'present' });
    const absent = await Attendance.countDocuments({ date: today, status: 'absent' });
    res.json({ present, absent });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/student/:id', async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.id }).sort({ date: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
