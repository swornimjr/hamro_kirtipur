const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['police', 'ambulance', 'fire', 'hospital', 'municipality', 'other'],
    required: true,
  },
  phone: { type: String, required: true },
  altPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  available24h: { type: Boolean, default: false },
  notes: { type: String, default: '' },
});

module.exports = mongoose.model('Emergency', emergencySchema);
