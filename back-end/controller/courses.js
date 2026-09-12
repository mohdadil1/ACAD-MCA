const Course = require('../modals/Course');
const Subject = require('../modals/Subject');
const { deleteSlidesForSubject } = require('./slides');

const list = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load courses' });
  }
};

const create = async (req, res) => {
  try {
    const { key, name, description, years } = req.body;
    if (!key || !name || !years) {
      return res.status(400).json({ message: 'key, name and years are required' });
    }
    const existing = await Course.findOne({ key: key.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'A course with this key already exists' });
    }
    const course = new Course({ key: key.toLowerCase(), name, description, years });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course' });
  }
};

const update = async (req, res) => {
  try {
    const { name, description, years } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, description, years },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course' });
  }
};

const remove = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const subjects = await Subject.find({ course: course._id });
    for (const subject of subjects) {
      await deleteSlidesForSubject(subject._id);
    }
    await Subject.deleteMany({ course: course._id });
    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    console.error('Course delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

module.exports = { list, create, update, remove };
