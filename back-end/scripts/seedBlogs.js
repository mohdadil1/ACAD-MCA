// One-time seed: adds a few starter posts so the /blogs page has content
// before teachers start publishing their own via the API.
//
// Safe to re-run: it looks up existing Blog docs by slug before creating
// new ones, so it won't create duplicates.
//
// Usage (from back-end/):  node scripts/seedBlogs.js

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (process.env.NODE_ENV !== 'production') {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
}

const Blog = require('../modals/Blog');

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const posts = [
  {
    slug: 'welcome-to-acad-blogs',
    title: 'Welcome to ACAD Blogs',
    summary: 'A new space for study tips, placement guidance, and updates from the ACAD team.',
    author: 'ACAD Team',
    tags: ['announcement'],
    content:
      "We're excited to launch the ACAD blog! This is where we'll share study tips, placement " +
      "preparation advice, and updates about new features on the platform.\n\n" +
      "Have something you'd like to see covered? Reach out and let us know. Happy reading!",
  },
  {
    slug: 'how-to-make-the-most-of-the-coding-sheet',
    title: 'How to Make the Most of the Coding Sheet',
    summary: 'A few tips for using the Coding Sheet effectively during interview prep.',
    author: 'ACAD Team',
    tags: ['coding', 'placements'],
    content:
      'The Coding Sheet is built to help you practice the questions that come up most often in ' +
      'company interviews. Rather than solving problems at random, work through it topic by topic ' +
      'so you build depth before breadth.\n\n' +
      "Revisit questions you struggled with after a few days -- spaced repetition is what makes " +
      "the patterns stick.",
  },
  {
    slug: 'getting-started-with-the-playground',
    title: 'Getting Started with the Playground',
    summary: 'Write and run C, C++, Java, Python or JavaScript right in your browser.',
    author: 'ACAD Team',
    tags: ['playground', 'guide'],
    content:
      'The Playground lets you write and run code in five languages without installing anything. ' +
      "It's a great place to test snippets from class, experiment with a new language, or work " +
      'through coding problems.\n\n' +
      'Just pick a language, write your code, and hit run -- the output shows up right below the editor.',
  },
];

const run = async () => {
  await mongoose.connect(mongoUri);
  console.log('DB connected');

  for (const post of posts) {
    const existing = await Blog.findOne({ slug: post.slug });
    if (existing) {
      console.log(`Skipping (already exists): ${post.slug}`);
      continue;
    }
    await Blog.create(post);
    console.log(`Created blog post: ${post.slug}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
