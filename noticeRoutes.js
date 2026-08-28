const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.query.audience) {
      filter.targetAudience = { $in: ['all', req.query.audience] };
      filter.isActive = true;
    }
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    req.body.postedBy = req.user._id;
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notice);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
