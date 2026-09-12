import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Jumbotron from '../UI/Jumbotron/Jumbotron';
import BackLink from '../Classroom/BackLink';

const apiUrl = import.meta.env.VITE_API_URL;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${apiUrl}/blogs/${slug}`, { withCredentials: true });
        setBlog(res.data);
      } catch (err) {
        setError('This blog post could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="text-center text-gray-500 font-sans py-8">Loading blog post…</p>;
  }

  if (error || !blog) {
    return (
      <Fragment>
        <BackLink to="/blogs" label="Back to Blogs" />
        <p className="text-center text-red-500 font-sans py-8">{error}</p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Jumbotron title={blog.title} description={blog.summary} />
      <BackLink to="/blogs" label="Back to Blogs" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-3xl">
        <p className="text-sm text-gray-400 font-sans mb-6">
          {blog.author} &middot; {formatDate(blog.createdAt)}
        </p>
        <div className="font-sans text-gray-700 leading-relaxed space-y-4">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default BlogPost;
