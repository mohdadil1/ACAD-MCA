import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Jumbotron from '../UI/Jumbotron/Jumbotron';

const apiUrl = import.meta.env.VITE_API_URL;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/blogs`, { withCredentials: true });
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <Fragment>
      <Jumbotron title="Blogs" description="Love reading? You're at the right place!" />
      <div className="classroom">
        {loading && (
          <p className="text-center text-gray-500 font-sans py-8">Loading blogs…</p>
        )}
        {error && (
          <p className="text-center text-red-500 font-sans py-8">{error}</p>
        )}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-center text-gray-500 font-sans py-8">No blog posts yet. Check back soon!</p>
        )}
        {!loading && !error && blogs.length > 0 && (
          <div className="card-deck">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog.slug}`}
                className="card group flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                <div className="flex-1 p-5 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 font-sans">{blog.title}</h3>
                  <p className="text-gray-600 font-sans">{blog.summary}</p>
                  <p className="text-sm text-gray-400 font-sans mt-3">
                    {blog.author} &middot; {formatDate(blog.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Blogs;
