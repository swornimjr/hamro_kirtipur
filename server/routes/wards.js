const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');

// GET /api/wards — all wards (summary, no boundary polygons for perf)
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find({}, '-boundary').sort({ wardNumber: 1 });
    res.json({ success: true, data: wards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/wards/:number — single ward WITH boundary
router.get('/:number', async (req, res) => {
  try {
    const ward = await Ward.findOne({ wardNumber: parseInt(req.params.number) });
    if (!ward) return res.status(404).json({ success: false, message: 'Ward not found' });
    res.json({ success: true, data: ward });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/wards — seed/create (admin)
router.post('/', async (req, res) => {
  try {
    const ward = await Ward.create(req.body);
    res.status(201).json({ success: true, data: ward });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/wards/:number
router.put('/:number', async (req, res) => {
  try {
    const ward = await Ward.findOneAndUpdate(
      { wardNumber: parseInt(req.params.number) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!ward) return res.status(404).json({ success: false, message: 'Ward not found' });
    res.json({ success: true, data: ward });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
