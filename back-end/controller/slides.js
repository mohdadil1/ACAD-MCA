const path = require('path');
const cloudinary = require('../config/cloudinary');
const Slide = require('../modals/Slide');
const Subject = require('../modals/Subject');

const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
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
    const publicId = `${baseName}-${Date.now()}${ext}`;

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'acad-mca/slides', public_id: publicId },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const listBySubject = async (req, res) => {
  try {
    const slides = await Slide.find({ subject: req.params.subjectId }).sort({ createdAt: 1 });
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load slides' });
  }
};

const upload = async (req, res) => {
  try {
    const { subject, heading, title } = req.body;
    if (!subject || !heading) {
      return res.status(400).json({ message: 'subject and heading are required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'A file is required' });
    }

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'File storage is not configured on the server' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);

    const slide = new Slide({
      subject,
      heading,
      title: title || '',
      url: result.secure_url,
      publicId: result.public_id,
    });
    await slide.save();

    res.status(201).json(slide);
  } catch (err) {
    console.error('Slide upload error:', err.message);
    res.status(500).json({ message: 'Failed to upload slide' });
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

module.exports = { listBySubject, upload, remove, deleteSlidesForSubject };
