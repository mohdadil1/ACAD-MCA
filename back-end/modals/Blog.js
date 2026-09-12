const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    // URL-friendly identifier derived from the title, e.g. "how-to-crack-mca-placements"
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  summary: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'ACAD Team',
  },
  coverImage: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
