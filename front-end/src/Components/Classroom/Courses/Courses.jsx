import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Jumbotron from '../../UI/Jumbotron/Jumbotron';

const apiUrl = import.meta.env.VITE_API_URL;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/courses`, { withCredentials: true });
        setCourses(res.data);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Fragment>
      <Jumbotron title="Choose Your Course" description="Select your course to explore semester-wise class resources" />
      <div className="classroom">
        {loading && (
          <p className="text-center text-gray-500 font-sans py-8">Loading courses…</p>
        )}
        {error && (
          <p className="text-center text-red-500 font-sans py-8">{error}</p>
        )}
        {!loading && !error && courses.length === 0 && (
          <p className="text-center text-gray-500 font-sans py-8">No courses have been added yet. Check back soon!</p>
        )}
        {!loading && !error && courses.length > 0 && (
          <div className="card-deck">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/classroom/${course.key}`}
                className="card group flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                <div className="flex-1 p-5 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 font-sans">{course.name}</h3>
                  <p className="text-gray-600 font-sans">{course.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Courses;
