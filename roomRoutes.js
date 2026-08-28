const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('students', 'name studentId');
    res.json(rooms);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/available', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'available' });
    const availableRooms = rooms.filter(r => r.availableBeds > 0);
    res.json(availableRooms);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('students', 'name studentId department');
    res.json(room);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/:id/assign', async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);
    if (room.availableBeds <= 0) return res.status(400).json({ message: 'Room is full' });
    
    room.students.push(studentId);
    room.occupiedBeds += 1;
    if (room.occupiedBeds === room.capacity) room.status = 'occupied';
    await room.save();
    res.json(room);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id/vacate/:studentId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    room.students = room.students.filter(id => id.toString() !== req.params.studentId);
    room.occupiedBeds -= 1;
    room.status = 'available';
    await room.save();
    res.json(room);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
