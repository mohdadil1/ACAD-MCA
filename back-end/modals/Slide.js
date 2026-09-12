const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  url: {
    // Cloudinary secure_url the student's viewer loads
    type: String,
    required: true,
  },
  publicId: {
    // Cloudinary public_id, needed to delete the file from Cloudinary later.
    // Empty for legacy slides that just point at an external link (e.g.
    // migrated Google Drive links) rather than a Cloudinary-hosted upload.
    type: String,
    default: '',
  },
}, { timestamps: true });

slideSchema.index({ subject: 1 });

module.exports = mongoose.model('Slide', slideSchema);
