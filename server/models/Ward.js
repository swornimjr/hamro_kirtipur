const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardNumber: { type: Number, required: true, unique: true, min: 1, max: 11 },
  name: { type: String, default: '' }, // e.g. "Kirtipur-1"
  chairperson: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  officeHours: { type: String, default: 'Sun–Fri, 10am–5pm' },
  officeAddress: { type: String, default: '' },
  garbageSchedule: {
    days: { type: [String], default: [] }, // ['Sunday', 'Wednesday']
    time: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  population: { type: Number, default: null },
  area: { type: String, default: '' }, // e.g. "Naya Bazaar, Panga"
  // GeoJSON polygon for ward boundary (paste from OpenStreetMap/Overpass)
  boundary: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], default: [] },
  },
});

module.exports = mongoose.model('Ward', wardSchema);
