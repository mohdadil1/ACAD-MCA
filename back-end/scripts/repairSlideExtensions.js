// One-time repair: finds Slide docs whose Cloudinary publicId has no file
// extension (uploaded before the extension fix), downloads each file,
// sniffs its real format from magic bytes, renames the Cloudinary asset to
// include the correct extension, and updates the Slide's url/publicId.
//
// Usage (from back-end/):
//   DRY_RUN=1 node scripts/repairSlideExtensions.js   (preview only)
//   node scripts/repairSlideExtensions.js             (apply)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
if (process.env.NODE_ENV !== 'production') require('dns').setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Slide = require('../modals/Slide');

const DRY_RUN = process.env.DRY_RUN === '1';

const sniffExtension = (buf) => {
  const head = buf.subarray(0, 8);
  if (head.subarray(0, 4).toString('latin1') === '%PDF') return '.pdf';
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return '.png';
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return '.jpg';
  if (head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0) {
    // Old-style OLE compound file (.ppt/.doc/.xls). Program/stream
    // identifiers appear as plain ASCII/UTF-16LE text inside the file, so a
    // substring search is a reasonable heuristic without full OLE parsing.
    const text = buf.toString('latin1');
    if (text.includes('PowerPoint')) return '.ppt';
    if (text.includes('Word.Document') || text.includes('MSWordDoc')) return '.doc';
    if (text.includes('Excel.Sheet') || text.includes('Workbook')) return '.xls';
    return '.ole (ppt/doc/xls -- ambiguous)';
  }
  if (head[0] === 0x50 && head[1] === 0x4b && (head[2] === 0x03 || head[2] === 0x05 || head[2] === 0x07)) {
    // Zip-based OOXML: sniff for the entry name that identifies the type.
    const text = buf.toString('latin1');
    if (text.includes('ppt/presentation.xml')) return '.pptx';
    if (text.includes('word/document.xml')) return '.docx';
    if (text.includes('xl/workbook.xml')) return '.xlsx';
    return '.zip (unrecognized office/zip format)';
  }
  return null; // unknown
};

const uploadBufferToCloudinary = (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', public_id: publicId },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const run = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  console.log('DB connected. DRY_RUN =', DRY_RUN);

  const slides = await Slide.find({ publicId: { $ne: '' } });
  // Match both never-renamed ids (no dot at all) and ones a previous, buggy
  // rename-only pass already touched (dot present, but Cloudinary's
  // content-type metadata still wasn't recomputed -- see below).
  const withoutExtension = slides.filter((s) => s.publicId);

  console.log(`Found ${withoutExtension.length} slide(s) to check/repair.\n`);

  for (const slide of withoutExtension) {
    process.stdout.write(`- ${slide.heading} (${slide.publicId}) ... `);
    try {
      const res = await fetch(slide.url);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = sniffExtension(buf);

      if (!ext || ext.includes('ambiguous') || ext.includes('unrecognized')) {
        console.log(`SKIPPED (${ext || 'unknown format'}, ${buf.length} bytes)`);
        continue;
      }

      const oldPublicId = slide.publicId;
      const basePublicId = oldPublicId.replace(/\.[a-zA-Z0-9]+$/, '');
      // Always append a fresh timestamp so this is a genuinely new asset --
      // Cloudinary derives content-type/disposition once at upload time, so
      // even re-using the same public_id string on a fresh upload call is
      // what actually fixes it (a rename of the existing asset does not).
      const newPublicId = `${basePublicId}-fixed-${Date.now()}${ext}`;

      console.log(`detected ${ext} -> re-uploading as ${newPublicId}`);

      if (!DRY_RUN) {
        // A rename alone doesn't work here: Cloudinary's raw resource type
        // fixes its content-type/disposition behavior at upload time based
        // on the public_id given then, and doesn't recompute it on rename.
        // So re-upload the actual bytes under the new (extensioned)
        // public_id, then remove the old one.
        const result = await uploadBufferToCloudinary(buf, newPublicId);
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' }).catch(() => {});
        slide.publicId = result.public_id;
        slide.url = result.secure_url;
        await slide.save();
      }
    } catch (err) {
      console.log('ERROR:', err.message);
    }
  }

  console.log('\nDone.');
  await mongoose.disconnect();
};

run();
