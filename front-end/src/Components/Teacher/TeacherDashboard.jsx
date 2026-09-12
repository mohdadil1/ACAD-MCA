import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ORDINAL_YEAR } from '../Classroom/ordinalYear';

const apiUrl = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('TeacherToken')}` },
  withCredentials: true,
});

const emptyCourseForm = { key: '', name: '', description: '', years: 2 };
const emptySubjectForm = { subjectName: '', subjectCode: '', credits: '' };
const emptySlideForm = { heading: '', title: '', file: null };

const TeacherDashboard = ({ teacherName, setTeacherName, setIsTeacherAuthenticated }) => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseError, setCourseError] = useState('');

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);

  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
  const [subjectError, setSubjectError] = useState('');

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slideForm, setSlideForm] = useState(emptySlideForm);
  const [slideError, setSlideError] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/courses`, authHeaders());
      setCourses(res.data);
    } catch (err) {
      setCourseError('Failed to load courses.');
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadSubjects = async (course, semester) => {
    setSubjectsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/courses/${course.key}/subjects`, {
        ...authHeaders(),
        params: { semester },
      });
      setSubjects(res.data);
    } catch (err) {
      setSubjectError('Failed to load subjects.');
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      loadSubjects(selectedCourse, selectedSemester);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, selectedSemester]);

  const loadSlides = async (subjectId) => {
    setSlidesLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/subjects/${subjectId}/slides`, authHeaders());
      setSlides(res.data);
    } catch (err) {
      setSlideError('Failed to load slides.');
    } finally {
      setSlidesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      loadSlides(selectedSubject._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject]);

  const handleLogout = () => {
    localStorage.removeItem('TeacherToken');
    localStorage.removeItem('TeacherName');
    setTeacherName('');
    setIsTeacherAuthenticated(false);
    navigate('/teacher/signin');
  };

  // --- Course CRUD ---
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCourseError('');
    try {
      await axios.post(
        `${apiUrl}/courses`,
        { ...courseForm, years: Number(courseForm.years) },
        authHeaders()
      );
      setCourseForm(emptyCourseForm);
      loadCourses();
    } catch (err) {
      setCourseError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete course "${course.name}"? This also deletes all its subjects and slides.`)) return;
    try {
      await axios.delete(`${apiUrl}/courses/${course._id}`, authHeaders());
      if (selectedCourse?._id === course._id) {
        setSelectedCourse(null);
        setSelectedSubject(null);
      }
      loadCourses();
    } catch (err) {
      setCourseError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  // --- Subject CRUD ---
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubjectError('');
    try {
      await axios.post(
        `${apiUrl}/subjects`,
        {
          course: selectedCourse._id,
          semester: selectedSemester,
          subjectName: subjectForm.subjectName,
          subjectCode: subjectForm.subjectCode,
          credits: Number(subjectForm.credits) || 0,
        },
        authHeaders()
      );
      setSubjectForm(emptySubjectForm);
      loadSubjects(selectedCourse, selectedSemester);
    } catch (err) {
      setSubjectError(err.response?.data?.message || 'Failed to create subject.');
    }
  };

  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Delete subject "${subject.subjectName}"? This also deletes all its slides.`)) return;
    try {
      await axios.delete(`${apiUrl}/subjects/${subject._id}`, authHeaders());
      if (selectedSubject?._id === subject._id) setSelectedSubject(null);
      loadSubjects(selectedCourse, selectedSemester);
    } catch (err) {
      setSubjectError(err.response?.data?.message || 'Failed to delete subject.');
    }
  };

  // --- Slide CRUD ---
  const handleUploadSlide = async (e) => {
    e.preventDefault();
    setSlideError('');
    if (!slideForm.file) {
      setSlideError('Please choose a file.');
      return;
    }
    setUploading(true);
    try {
      // 1. Get a signed, short-lived upload authorization from our backend
      // (a tiny JSON request -- well under any size limit).
      const sigRes = await axios.post(
        `${apiUrl}/slides/upload-signature`,
        { filename: slideForm.file.name },
        authHeaders()
      );
      const { signature, timestamp, publicId, apiKey, cloudName } = sigRes.data;

      // 2. Upload the actual file bytes straight to Cloudinary from the
      // browser. This bypasses our Vercel backend entirely, so its 4.5MB
      // serverless request-body limit never applies to the real file --
      // only to the small JSON requests before/after it. A bare axios
      // instance is used so this request doesn't pick up our app's own
      // Authorization header or baseURL defaults.
      const cloudForm = new FormData();
      cloudForm.append('file', slideForm.file);
      cloudForm.append('api_key', apiKey);
      cloudForm.append('timestamp', timestamp);
      cloudForm.append('signature', signature);
      cloudForm.append('public_id', publicId);

      const cloudRes = await axios.create().post(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        cloudForm
      );

      // 3. Save just the resulting URL/metadata through our own backend.
      await axios.post(
        `${apiUrl}/slides`,
        {
          subject: selectedSubject._id,
          heading: slideForm.heading,
          title: slideForm.title,
          url: cloudRes.data.secure_url,
          publicId: cloudRes.data.public_id,
        },
        authHeaders()
      );

      setSlideForm(emptySlideForm);
      loadSlides(selectedSubject._id);
    } catch (err) {
      setSlideError(err.response?.data?.message || 'Failed to upload slide.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSlide = async (slide) => {
    if (!window.confirm(`Delete slide "${slide.heading}"?`)) return;
    try {
      await axios.delete(`${apiUrl}/slides/${slide._id}`, authHeaders());
      loadSlides(selectedSubject._id);
    } catch (err) {
      setSlideError(err.response?.data?.message || 'Failed to delete slide.');
    }
  };

  const semesterOptions = selectedCourse
    ? Array.from({ length: selectedCourse.years * 2 }, (_, i) => i + 1)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <div className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Teacher Portal</h1>
          {teacherName && <p className="text-sm text-slate-300">Signed in as {teacherName}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/90 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm mb-6 text-gray-500">
          <button
            className="hover:text-brand-600 font-semibold"
            onClick={() => { setSelectedCourse(null); setSelectedSubject(null); }}
          >
            Courses
          </button>
          {selectedCourse && (
            <>
              <span>/</span>
              <button
                className="hover:text-brand-600 font-semibold"
                onClick={() => setSelectedSubject(null)}
              >
                {selectedCourse.name}
              </button>
            </>
          )}
          {selectedSubject && (
            <>
              <span>/</span>
              <span className="font-semibold text-gray-700">{selectedSubject.subjectName}</span>
            </>
          )}
        </div>

        {/* Courses view */}
        {!selectedCourse && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Courses</h2>
            {courseError && <p className="text-red-500 mb-4">{courseError}</p>}

            <form onSubmit={handleCreateCourse} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Key (slug)</label>
                <input
                  value={courseForm.key}
                  onChange={(e) => setCourseForm({ ...courseForm, key: e.target.value })}
                  placeholder="e.g. bca"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                <input
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g. BCA"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                <input
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Years</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={courseForm.years}
                  onChange={(e) => setCourseForm({ ...courseForm, years: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-brand-700 hover:to-brand-600 transition-all"
              >
                Add Course
              </button>
            </form>

            {coursesLoading ? (
              <p className="text-gray-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Key: {course.key}</p>
                    <p className="text-sm text-gray-500 mb-3">{course.years} year(s)</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedCourse(course); setSelectedSemester(1); }}
                        className="bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && <p className="text-gray-500">No courses yet. Add one above.</p>}
              </div>
            )}
          </div>
        )}

        {/* Subjects view */}
        {selectedCourse && !selectedSubject && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedCourse.name} — Subjects</h2>
            {subjectError && <p className="text-red-500 mb-4">{subjectError}</p>}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem} ({ORDINAL_YEAR[Math.ceil(sem / 2)] || `Year ${Math.ceil(sem / 2)}`})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleCreateSubject} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Subject name</label>
                <input
                  value={subjectForm.subjectName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Subject code</label>
                <input
                  value={subjectForm.subjectCode}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Credits</label>
                <input
                  type="number"
                  value={subjectForm.credits}
                  onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-brand-700 hover:to-brand-600 transition-all"
              >
                Add Subject
              </button>
            </form>

            {subjectsLoading ? (
              <p className="text-gray-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div key={subject._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-lg font-bold text-gray-800">{subject.subjectName}</h3>
                    <p className="text-sm text-gray-500 mb-1">Code: {subject.subjectCode || '—'}</p>
                    <p className="text-sm text-gray-500 mb-3">Credits: {subject.credits}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSubject(subject)}
                        className="bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        Manage Slides
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject)}
                        className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && <p className="text-gray-500">No subjects for this semester yet. Add one above.</p>}
              </div>
            )}
          </div>
        )}

        {/* Slides view */}
        {selectedSubject && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedSubject.subjectName} — Slides</h2>
            {slideError && <p className="text-red-500 mb-4">{slideError}</p>}

            <form onSubmit={handleUploadSlide} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Heading</label>
                <input
                  value={slideForm.heading}
                  onChange={(e) => setSlideForm({ ...slideForm, heading: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Title</label>
                <input
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">File (PDF, PPT, ...)</label>
                <input
                  type="file"
                  onChange={(e) => setSlideForm({ ...slideForm, file: e.target.files[0] })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-brand-700 hover:to-brand-600 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading…' : 'Upload Slide'}
              </button>
            </form>

            {slidesLoading ? (
              <p className="text-gray-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slides.map((slide) => (
                  <div key={slide._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-lg font-bold text-gray-800">{slide.heading}</h3>
                    <p className="text-sm text-gray-500 mb-3">{slide.title || '—'}</p>
                    <div className="flex gap-2">
                      <a
                        href={slide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteSlide(slide)}
                        className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && <p className="text-gray-500">No slides yet. Upload one above.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
