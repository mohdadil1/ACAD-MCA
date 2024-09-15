import React, { Fragment, useContext } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ReferenceDataContext } from '../Context/referenceDataContext';

const Card = (props) => {
	const { setUrl, setModalTitle, setShowModal } = useContext(ReferenceDataContext); 

	return (
		<Fragment>
			<div className="card ">
				<img className="card-img-top" src={props.src} alt="Company logo" style={{ height: '140px' }} />
				<div className="card-body d-flex flex-column">
					<h3 className="card-title">{props.CompanyName}</h3>
					<p className="card-text">CTC: {props.ctc}</p>
					<button
						type="button"
						className="bg-blue-500 border border-blue-500 text-white font-medium text-base leading-6 py-2 px-4 rounded-md transition-colors duration-150 ease-in-out select-none mt-auto "
						data-toggle="modal"
						data-target="#exampleModal"
						onClick={() => {
							setUrl(props.url);
							setModalTitle(props.CompanyName);
                            setShowModal(true);  
						}}
						id={props.id}
					>
						Read <ArrowForwardIcon />
					</button>
				</div>
			</div>
		</Fragment>
	);
};

export default Card;
