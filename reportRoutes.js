const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Room = require('../models/Room');
const Attendance = require('../models/Attendance');
const Complaint = require('../models/Complaint');
const Fee = require('../models/Fee');
const MessMenu = require('../models/MessMenu');
const Maintenance = require('../models/Maintenance');
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Dashboard comprehensive stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const rooms = await Room.find();
    let totalCapacity = 0, occupiedBeds = 0;
    rooms.forEach(r => { totalCapacity += r.capacity; occupiedBeds += r.occupiedBeds; });
    const today = new Date();
    today.setHours(0,0,0,0);
    const presentToday = await Attendance.countDocuments({ date: today, status: 'present' });
    const activeComplaints = await Complaint.countDocuments({ status: { $ne: 'closed' } });
    const activeMaintenance = await Maintenance.countDocuments({ status: { $ne: 'closed' } });
    const pendingFeesCount = await Fee.countDocuments({ status: 'pending' });
    
    res.json({
      students: totalStudents,
      occupancy: { total: totalCapacity, occupied: occupiedBeds, vacant: totalCapacity - occupiedBeds },
      attendanceToday: presentToday,
      activeComplaints,
      activeMaintenance,
      pendingFeesCount
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/students', async (req, res) => {
  try { const data = await Student.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/rooms', async (req, res) => {
  try { const data = await Room.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/attendance', async (req, res) => {
  try { const data = await Attendance.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/complaints', async (req, res) => {
  try { const data = await Complaint.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/fees', async (req, res) => {
  try { const data = await Fee.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/mess', async (req, res) => {
  try { const data = await MessMenu.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/maintenance', async (req, res) => {
  try { const data = await Maintenance.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/visitors', async (req, res) => {
  try { const data = await Visitor.find(); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
