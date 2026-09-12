const mongoose = require('mongoose');

const teacherInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index -- MongoDB automatically deletes an invite once it expires, so
// unused/expired codes don't pile up.
teacherInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TeacherInvite', teacherInviteSchema);
