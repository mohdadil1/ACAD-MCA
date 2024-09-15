import React, { Fragment, useState } from 'react';
import Cards from './Cards/Cards';
import Jumbotron from '../../../UI/Jumbotron/Jumbotron';
import { useParams } from 'react-router';
import slides from '../../../../slides.json';  
import './Subjects.css';
import Modal from '../../../Modal/Modal';
import { ReferenceDataContext } from '../../../Context/referenceDataContext';

const Subjects = () => {
	const { subject } = useParams();
    
	const cardsContainer = [];
	const [url, setUrl] = useState('');
	const [modalTitle, setModalTitle] = useState('');
	const [showModal, setShowModal] = useState(false);  

	
	if (slides[subject]) {
		for (let slide of slides[subject]) {
			var heading = slide.heading;
			var title = slide.title;

			cardsContainer.push(
                <Cards
                    heading={heading}
                    title={title}
                    key={slide.id}
                    id={slide.id}
                    url={slide.url}
                />
            );
		}
	} else {
		console.error(`No slides found for subject: ${subject}`);
	}

	return (
		<Fragment>
			<ReferenceDataContext.Provider value={{ url, setUrl, modalTitle, setModalTitle, showModal, setShowModal }}>
				<Jumbotron title="Teacher's Section" description="Here are all the slides which you need..." />
				<div className="container p-24 mb-12">
					<div className="card-deck gap-6">{cardsContainer}</div>
				</div>
				{showModal && <Modal />} {/* Conditionally render the modal */}
			</ReferenceDataContext.Provider>
		</Fragment>
	);
};

export default Subjects;
