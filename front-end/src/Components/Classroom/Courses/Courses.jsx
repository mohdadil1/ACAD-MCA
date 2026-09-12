import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Jumbotron from '../../UI/Jumbotron/Jumbotron';

// years: how many years the course runs (2 for postgraduate, 3 for undergraduate),
// used to generate the Year -> Semester hierarchy under /classroom/:course.
export const COURSES = [
  { id: 'bca', name: 'BCA', description: 'Bachelor of Computer Applications', available: false, years: 3 },
  { id: 'bsc', name: 'BSC', description: 'Bachelor of Science', available: false, years: 3 },
  { id: 'mca', name: 'MCA', description: 'Master of Computer Applications', available: true, years: 2 },
  { id: 'msc', name: 'MSC', description: 'Master of Science', available: false, years: 2 },
];

export const ORDINAL_YEAR = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year' };

const Courses = () => {
  return (
    <Fragment>
      <Jumbotron title="Choose Your Course" description="Select your course to explore semester-wise class resources" />
      <div className="classroom">
        <div className="card-deck">
          {COURSES.map((course) =>
            course.available ? (
              <Link
                key={course.id}
                to={`/classroom/${course.id}`}
                className="card group flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                <div className="flex-1 p-5 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 font-sans">{course.name}</h3>
                  <p className="text-gray-600 font-sans">{course.description}</p>
                </div>
              </Link>
            ) : (
              <div
                key={course.id}
                className="card flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden opacity-80 cursor-not-allowed"
                aria-disabled="true"
              >
                <div className="h-1.5 w-full bg-gray-200" />
                <div className="flex-1 p-5 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-gray-400 mb-2 font-sans">{course.name}</h3>
                  <p className="text-gray-400 font-sans mb-3">{course.description}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-500">
                    Coming soon
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Courses;
