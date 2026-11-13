const CodeSnippet = require('../modals/CodeSnippet');
const { MAX_CODE_LENGTH } = require('../modals/CodeSnippet');
const Subject = require('../modals/Subject');

const listBySubject = async (req, res) => {
  try {
    const codes = await CodeSnippet.find({ subject: req.params.subjectId }).sort({ createdAt: 1 });
    res.status(200).json(codes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load programs' });
  }
};

const validate = ({ title, code }) => {
  if (!title || !title.trim()) return 'title is required';
  if (typeof code !== 'string' || !code.trim()) return 'code is required';
  if (code.length > MAX_CODE_LENGTH) return `code must be under ${MAX_CODE_LENGTH / 1024} KB`;
  return null;
};

const create = async (req, res) => {
  try {
    const { subject, title, description, filename, code } = req.body;
    if (!subject) {
      return res.status(400).json({ message: 'subject is required' });
    }
    const error = validate({ title, code });
    if (error) {
      return res.status(400).json({ message: error });
    }

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const snippet = new CodeSnippet({
      subject,
      title,
      description: description || '',
      filename: filename || '',
      language: 'c',
      code,
    });
    await snippet.save();
    res.status(201).json(snippet);
  } catch (err) {
    console.error('Code create error:', err.message);
    res.status(500).json({ message: 'Failed to save program' });
  }
};

const update = async (req, res) => {
  try {
    const { title, description, filename, code } = req.body;
    const error = validate({ title, code });
    if (error) {
      return res.status(400).json({ message: error });
    }
    const snippet = await CodeSnippet.findByIdAndUpdate(
      req.params.id,
      { title, description: description || '', filename: filename || '', code },
      { new: true, runValidators: true }
    );
    if (!snippet) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json(snippet);
  } catch (err) {
    console.error('Code update error:', err.message);
    res.status(500).json({ message: 'Failed to update program' });
  }
};

const remove = async (req, res) => {
  try {
    const snippet = await CodeSnippet.findByIdAndDelete(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete program' });
  }
};

// Used when cascading a subject/course delete.
const deleteCodesForSubject = (subjectId) => CodeSnippet.deleteMany({ subject: subjectId });

module.exports = { listBySubject, create, update, remove, deleteCodesForSubject };
