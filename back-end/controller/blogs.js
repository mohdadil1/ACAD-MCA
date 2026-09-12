const Blog = require('../modals/Blog');

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Appends -2, -3, ... until the slug is free (excluding excludeId when updating).
const uniqueSlug = async (baseSlug, excludeId) => {
  let slug = baseSlug;
  let suffix = 2;
  while (await Blog.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

const list = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug summary author tags coverImage createdAt');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load blogs' });
  }
};

const getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load blog post' });
  }
};

const create = async (req, res) => {
  try {
    const { title, summary, content, author, coverImage, tags, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }
    const slug = await uniqueSlug(slugify(title));
    const blog = new Blog({ title, slug, summary, content, author, coverImage, tags, published });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create blog post' });
  }
};

const update = async (req, res) => {
  try {
    const { title, summary, content, author, coverImage, tags, published } = req.body;
    const updates = { summary, content, author, coverImage, tags, published };
    if (title) {
      updates.title = title;
      const existing = await Blog.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (slugify(title) !== slugify(existing.title)) {
        updates.slug = await uniqueSlug(slugify(title), req.params.id);
      }
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update blog post' });
  }
};

const remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
};

module.exports = { list, getBySlug, create, update, remove };
