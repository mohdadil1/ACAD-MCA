const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  semester: {
    // 1-based semester number within the course (1, 2, 3, ...)
    type: Number,
    required: true,
    min: 1,
  },
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    default: '',
    trim: true,
  },
  credits: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

subjectSchema.index({ course: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
