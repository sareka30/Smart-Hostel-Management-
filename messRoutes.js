const express = require('express');
const router = express.Router();
const MessMenu = require('../models/MessMenu');
const FoodFeedback = require('../models/FoodFeedback');
const FoodWaste = require('../models/FoodWaste');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/menu', async (req, res) => {
  try {
    let filter = {};
    if (req.query.date) {
      const date = new Date(req.query.date);
      date.setHours(0,0,0,0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDate };
    }
    const menus = await MessMenu.find(filter).sort({ date: 1, mealType: 1 });
    res.json(menus);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/menu', async (req, res) => {
  try {
    req.body.preparedBy = req.user._id;
    const menu = await MessMenu.create(req.body);
    res.status(201).json(menu);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/menu/:id', async (req, res) => {
  try {
    const menu = await MessMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menu);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    await MessMenu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/feedback', async (req, res) => {
  try {
    const feedback = await FoodFeedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/feedback', async (req, res) => {
  try {
    const feedback = await FoodFeedback.find().populate('studentId', 'name');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/waste', async (req, res) => {
  try {
    req.body.recordedBy = req.user._id;
    const waste = await FoodWaste.create(req.body);
    res.status(201).json(waste);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/waste', async (req, res) => {
  try {
    const waste = await FoodWaste.find().sort({ date: -1 });
    res.json(waste);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/waste/analytics', async (req, res) => {
  try {
    const stats = await FoodWaste.aggregate([
      { $group: { _id: '$mealType', totalPrepared: { $sum: '$preparedQuantity' }, totalWaste: { $sum: '$wasteQuantity' } } }
    ]);
    res.json(stats);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
