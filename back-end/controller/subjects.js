const Subject = require('../modals/Subject');
const Course = require('../modals/Course');
const { deleteSlidesForSubject } = require('./slides');

const listByCourseAndSemester = async (req, res) => {
  try {
    const course = await Course.findOne({ key: req.params.courseKey });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const semester = Number(req.query.semester);
    if (!semester) {
      return res.status(400).json({ message: 'semester query param is required' });
    }
    const subjects = await Subject.find({ course: course._id, semester }).sort({ createdAt: 1 });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load subjects' });
  }
};

const create = async (req, res) => {
  try {
    const { course, semester, subjectName, subjectCode, credits } = req.body;
    if (!course || !semester || !subjectName) {
      return res.status(400).json({ message: 'course, semester and subjectName are required' });
    }
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const subject = new Subject({ course, semester, subjectName, subjectCode, credits });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subject' });
  }
};

const update = async (req, res) => {
  try {
    const { subjectName, subjectCode, credits, semester } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectCode, credits, semester },
      { new: true, runValidators: true }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subject' });
  }
};

const remove = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    await deleteSlidesForSubject(subject._id);
    await subject.deleteOne();
    res.status(200).json({ message: 'Subject deleted' });
  } catch (err) {
    console.error('Subject delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete subject' });
  }
};

module.exports = { listByCourseAndSemester, create, update, remove };
