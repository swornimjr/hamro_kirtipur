const Listing = require('../models/Listing');

// GET /api/listings
// Query params: category, ward, search, verified, lat, lng, radius (meters)
exports.getListings = async (req, res) => {
  try {
    const { category, ward, search, verified, lat, lng, radius } = req.query;
    let query = {};

    if (category) query.category = category;
    if (ward) query.ward = Number(ward);
    if (verified !== undefined) query.verified = verified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Nearby search using 2dsphere index
    if (lat && lng) {
      const listings = await Listing.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: radius ? parseInt(radius) : 2000, // default 2km
          },
        },
      });
      return res.json({ success: true, count: listings.length, data: listings });
    }

    const listings = await Listing.find(query).sort({ verified: -1, name: 1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/listings/:id
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/listings — admin create
exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!listing) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/listings/suggest — public suggestion (unverified)
exports.suggestListing = async (req, res) => {
  try {
    const suggestion = await Listing.create({
      ...req.body,
      verified: false,
      suggestedBy: req.body.suggestedBy || 'public',
    });
    res.status(201).json({ success: true, message: 'Thank you! We will review your suggestion.', data: suggestion });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
