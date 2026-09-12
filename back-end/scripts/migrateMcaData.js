// One-time migration: seeds the existing static MCA data
// (front-end/src/New_Subjects.json + front-end/src/slides.json) into
// MongoDB as the initial Course/Subject/Slide documents, so the teacher
// portal and the DB-backed student pages have real data to start from.
//
// Safe to re-run: it looks up existing Course/Subject/Slide docs by their
// natural keys before creating new ones, so it won't create duplicates.
//
// Usage (from back-end/):  node scripts/migrateMcaData.js

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (process.env.NODE_ENV !== 'production') {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
}

const Course = require('../modals/Course');
const Subject = require('../modals/Subject');
const Slide = require('../modals/Slide');

const subjectsData = require('../../front-end/src/New_Subjects.json');
const slidesData = require('../../front-end/src/slides.json');

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const run = async () => {
  await mongoose.connect(mongoUri);
  console.log('DB connected');

  let course = await Course.findOne({ key: 'mca' });
  if (!course) {
    course = await Course.create({
      key: 'mca',
      name: 'MCA',
      description: 'Master of Computer Applications',
      years: 2,
    });
    console.log('Created course: MCA');
  } else {
    console.log('Course MCA already exists, reusing it');
  }

  // Maps the JSON's subject id (e.g. "subj1") to the Mongo _id we create,
  // so slides.json (keyed by that same subject id) can be attached below.
  const subjectIdMap = {};

  for (const semesterKey of Object.keys(subjectsData)) {
    const semesterNumber = Number(semesterKey.replace('semester', ''));
    if (!semesterNumber) continue;

    const semesterSubjects = subjectsData[semesterKey];
    for (const key of Object.keys(semesterSubjects)) {
      const raw = semesterSubjects[key];

      let subject = await Subject.findOne({
        course: course._id,
        semester: semesterNumber,
        subjectName: raw.subjectName,
      });

      if (!subject) {
        subject = await Subject.create({
          course: course._id,
          semester: semesterNumber,
          subjectName: raw.subjectName,
          subjectCode: raw.subjectCode || '',
          credits: raw.credits || 0,
        });
        console.log(`  Created subject: [sem ${semesterNumber}] ${raw.subjectName}`);
      }

      if (raw.id) {
        subjectIdMap[raw.id] = subject._id;
      }
    }
  }

  let slideCount = 0;
  for (const jsonSubjectId of Object.keys(slidesData)) {
    const subjectMongoId = subjectIdMap[jsonSubjectId];
    if (!subjectMongoId) {
      console.warn(`  Skipping slides for unknown subject id "${jsonSubjectId}" (no matching subject)`);
      continue;
    }

    for (const slideEntry of slidesData[jsonSubjectId]) {
      const existing = await Slide.findOne({
        subject: subjectMongoId,
        heading: slideEntry.heading,
      });
      if (existing) continue;

      await Slide.create({
        subject: subjectMongoId,
        heading: slideEntry.heading,
        title: slideEntry.title || '',
        url: slideEntry.url,
        publicId: '', // legacy external link, not a Cloudinary upload
      });
      slideCount += 1;
    }
  }
  console.log(`Created ${slideCount} slide(s)`);

  console.log('Migration complete.');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
