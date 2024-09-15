import React, { Fragment, useEffect, useState } from 'react';
import './Placement.css';
import Cards from './Cards';
import Jumbotron from '../UI/Jumbotron/Jumbotron';
import { PlacementData } from '../../placementExp';
import Modal from '../Modal/Modal';
import { ReferenceDataContext } from '../Context/referenceDataContext';

const Placement = () => {
	const [url, setUrl] = useState('');
	const [modalTitle, setModalTitle] = useState('');
    const [showModal, setShowModal] = useState(false);  
	const [placementCardData, setPlacementCardData] = useState([]);

	const prepareCardsData = () => {
		let j = 0;
		const cardsContainer = [];
		const years = [2021, 2020];

		for (var i = 0; i < PlacementData.companies.length; i++) {
			cardsContainer.push(<h2 className="yearTitle text-3xl font-medium leading-snug mb-2.5 mt-0 font-sans" key={`year-${years[i]}`}>{years[i]}</h2>);

			for (var key in PlacementData.companies[i][years[j]]) {
				var obj = PlacementData.companies[i][years[j]][key];
				var src = obj.src;
				var ctc = obj.ctc;
				cardsContainer.push(<Cards src={src} CompanyName={obj.CompanyName} ctc={ctc} key={obj.id} url={obj.url} />);
			}
			j += 1;
		}
		setPlacementCardData(cardsContainer);
	}

	useEffect(() => {
		prepareCardsData();
	}, [])

	return (
		<Fragment>
			<ReferenceDataContext.Provider value={{ url, setUrl, modalTitle, setModalTitle, showModal, setShowModal }}> 
				<Jumbotron
					title="Placement Experiences"
					description="List of relevant interview experiences shared by students for students."
				/>
				<div className="classroom">
					<div className="card-deck flex flex-wrap gap-6">{placementCardData}</div>
				</div>
				<Modal />
			</ReferenceDataContext.Provider>
		</Fragment>
	);
};

export default Placement;
