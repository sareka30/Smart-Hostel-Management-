const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/low-stock', async (req, res) => {
  try {
    const items = await Inventory.find({ $expr: { $lte: ['$availableQuantity', 5] } });
    res.json(items);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const count = await Inventory.countDocuments();
    req.body.itemId = `INV${(count + 1).toString().padStart(4, '0')}`;
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/audit', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, { lastAuditDate: Date.now(), status: req.body.status }, { new: true });
    res.json(item);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory item deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
