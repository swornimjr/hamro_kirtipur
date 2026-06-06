const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'health',
        'education',
        'water',
        'garbage',
        'emergency',
        'business',
        'ward-office',
        'restaurant',
        'gym',
        'futsal',
        'mart',
        'gift-shop',
        'temple',
        'gumba',
        'stupa',
        'swimming-pool',
        'club',
      ],
    },
    ward: { type: Number, min: 1, max: 11, default: null },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    hours: { type: String, default: '' },
    // GeoJSON point for map pin
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    // Extra flexible fields per category
    // e.g. garbage: { schedule: 'Sunday, Wednesday' }
    // e.g. health: { services: ['OPD', 'Maternity'] }
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    photo: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    suggestedBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

listingSchema.index({ location: '2dsphere' });
listingSchema.index({ category: 1, ward: 1 });

module.exports = mongoose.model('Listing', listingSchema);
