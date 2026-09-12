import React, { Fragment, useEffect, useState } from 'react';
import Cards from './Cards/Cards';
import Jumbotron from '../../../UI/Jumbotron/Jumbotron';
import BackLink from '../../BackLink';
import { useParams } from 'react-router';
import axios from 'axios';
import './Subjects.css';
import Modal from '../../../Modal/Modal';
import { ReferenceDataContext } from '../../../Context/referenceDataContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Subjects = () => {
	const { course, year, semester, subject } = useParams();

	const [slides, setSlides] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [url, setUrl] = useState('');
	const [modalTitle, setModalTitle] = useState('');
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchSlides = async () => {
			setLoading(true);
			setError('');
			try {
				const res = await axios.get(`${apiUrl}/subjects/${subject}/slides`, { withCredentials: true });
				setSlides(res.data);
			} catch (err) {
				setError('Failed to load slides. Please try again.');
			} finally {
				setLoading(false);
			}
		};
		if (subject) fetchSlides();
	}, [subject]);

	return (
		<Fragment>
			<ReferenceDataContext.Provider value={{ url, setUrl, modalTitle, setModalTitle, showModal, setShowModal }}>
				<Jumbotron title="Teacher's Section" description="Here are all the slides which you need..." />
				<BackLink to={`/classroom/${course}/${year}/${semester}`} label="Back to Subjects" />
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 mb-12">
					{loading && <p className="text-center text-gray-500 font-sans">Loading slides…</p>}
					{error && <p className="text-center text-red-500 font-sans">{error}</p>}
					{!loading && !error && slides.length === 0 && (
						<p className="text-center text-gray-500 font-sans">No slides have been added for this subject yet.</p>
					)}
					{!loading && !error && slides.length > 0 && (
						<div className="card-deck gap-6">
							{slides.map((slide) => (
								<Cards
									key={slide._id}
									heading={slide.heading}
									title={slide.title}
									id={slide._id}
									url={slide.url}
								/>
							))}
						</div>
					)}
				</div>
				{showModal && <Modal />} {/* Conditionally render the modal */}
			</ReferenceDataContext.Provider>
		</Fragment>
	);
};

export default Subjects;
