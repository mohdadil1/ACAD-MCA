import React, { Fragment, useEffect, useState } from 'react';
import './Semester.css';
import Cards from './Cards/Cards';
import Jumbotron from '../../UI/Jumbotron/Jumbotron';
import BackLink from '../BackLink';
import { useParams } from 'react-router';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const Semester = () => {
	const { course, year, semester } = useParams();
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const semesterNumber = parseInt((semester || '').replace('semester', ''), 10);
	const jumboTitle = semesterNumber ? `Semester ${semesterNumber}` : 'Semester';

	useEffect(() => {
		const fetchSubjects = async () => {
			setLoading(true);
			setError('');
			try {
				const res = await axios.get(`${apiUrl}/courses/${course}/subjects`, {
					params: { semester: semesterNumber },
					withCredentials: true,
				});
				setSubjects(res.data);
			} catch (err) {
				setError('Failed to load subjects. Please try again.');
			} finally {
				setLoading(false);
			}
		};
		if (course && semesterNumber) fetchSubjects();
	}, [course, semesterNumber]);

	return (
		<Fragment>
			<Jumbotron title={jumboTitle} description="You will find here subject-wise resources for this semester" />
			<BackLink to={`/classroom/${course}/${year}`} label="Back to Semesters" />
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 mb-12">
				{loading && <p className="text-center text-gray-500 font-sans">Loading subjects…</p>}
				{error && <p className="text-center text-red-500 font-sans">{error}</p>}
				{!loading && !error && subjects.length === 0 && (
					<p className="text-center text-gray-500 font-sans">No subjects have been added for this semester yet.</p>
				)}
				{!loading && !error && subjects.length > 0 && (
					<div className="card-deck">
						{subjects.map((subject) => (
							<Cards
								key={subject._id}
								title={subject.subjectName}
								link={`/classroom/${course}/${year}/${semester}/${subject._id}`}
								code={subject.subjectCode}
								credits={subject.credits}
								linkText="Go to Subject"
							/>
						))}
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default Semester;
