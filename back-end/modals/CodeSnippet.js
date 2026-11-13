const mongoose = require('mongoose');

// A source-code program (currently C) a teacher shares under a subject, e.g.
// lab programs. Stored as text directly in MongoDB -- source files are tiny,
// so unlike slides there's no need to route them through Cloudinary.
// 64 KB of source is plenty for a lab program, and keeps the JSON request
// (after escaping) under express.json()'s default 100 KB body limit.
const MAX_CODE_LENGTH = 64 * 1024;

const codeSnippetSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  language: {
    type: String,
    enum: ['c'],
    default: 'c',
  },
  filename: {
    type: String,
    default: '',
    trim: true,
  },
  code: {
    type: String,
    required: true,
    maxlength: MAX_CODE_LENGTH,
  },
}, { timestamps: true });

codeSnippetSchema.index({ subject: 1 });

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
module.exports.MAX_CODE_LENGTH = MAX_CODE_LENGTH;
