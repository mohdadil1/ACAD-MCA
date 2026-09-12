const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  key: {
    // URL-friendly slug, e.g. "mca", "bca" -- what the frontend routes on
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  years: {
    // how many years the course runs (2 for postgraduate, 3 for undergraduate)
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
