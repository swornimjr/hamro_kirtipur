const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/auth');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  suggestListing,
} = require('../controllers/listingController');

router.get('/', getListings);
router.post('/suggest', suggestListing);
router.get('/:id', getListing);
router.post('/', requireAdmin, createListing);
router.put('/:id', requireAdmin, updateListing);
router.delete('/:id', requireAdmin, deleteListing);

module.exports = router;
