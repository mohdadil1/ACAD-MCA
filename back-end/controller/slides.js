const path = require('path');
const cloudinary = require('../config/cloudinary');
const Slide = require('../modals/Slide');
const Subject = require('../modals/Subject');

// Vercel serverless functions cap the request body at 4.5MB, which real
// lecture slides (PPT/PDF, often several MB) blow past easily. So the file
// bytes never go through our backend at all: the browser uploads directly
// to Cloudinary using a short-lived signed request, and only the resulting
// (tiny) URL/metadata is sent to us afterward via `create`.
const buildPublicId = (originalName) => {
  // Cloudinary's "raw" resource type has no concept of a file's real format
  // beyond the extension in its delivery URL -- without one it serves the
  // file as a generic application/octet-stream, which browsers download
  // instead of rendering inline. Carry the original extension through so
  // e.g. a .pdf still ends in .pdf and opens in the viewer instead.
  const ext = path.extname(originalName || '').toLowerCase();
  const baseName = path
    .basename(originalName || 'slide', ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 80);
  return `acad-mca/slides/${baseName}-${Date.now()}${ext}`;
};

const listBySubject = async (req, res) => {
  try {
    const slides = await Slide.find({ subject: req.params.subjectId }).sort({ createdAt: 1 });
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load slides' });
  }
};

const getUploadSignature = (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: 'filename is required' });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'File storage is not configured on the server' });
    }

    const publicId = buildPublicId(filename);
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { public_id: publicId, timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      publicId,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error('Signature generation error:', err.message);
    res.status(500).json({ message: 'Failed to generate upload signature' });
  }
};

const create = async (req, res) => {
  try {
    const { subject, heading, title, url, publicId } = req.body;
    if (!subject || !heading || !url) {
      return res.status(400).json({ message: 'subject, heading and url are required' });
    }

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const slide = new Slide({ subject, heading, title: title || '', url, publicId: publicId || '' });
    await slide.save();

    res.status(201).json(slide);
  } catch (err) {
    console.error('Slide create error:', err.message);
    res.status(500).json({ message: 'Failed to save slide' });
  }
};

const remove = async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    if (slide.publicId) {
      await cloudinary.uploader.destroy(slide.publicId, { resource_type: 'raw' });
    }
    await slide.deleteOne();
    res.status(200).json({ message: 'Slide deleted' });
  } catch (err) {
    console.error('Slide delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete slide' });
  }
};

// Used when cascading a subject/course delete -- best-effort Cloudinary
// cleanup, but the DB delete of the caller still proceeds even if a
// Cloudinary call fails (a stray file there is a non-issue).
const deleteSlidesForSubject = async (subjectId) => {
  const slides = await Slide.find({ subject: subjectId });
  await Promise.all(
    slides
      .filter((slide) => slide.publicId)
      .map((slide) =>
        cloudinary.uploader.destroy(slide.publicId, { resource_type: 'raw' }).catch(() => {})
      )
  );
  await Slide.deleteMany({ subject: subjectId });
};

module.exports = { listBySubject, getUploadSignature, create, remove, deleteSlidesForSubject };
