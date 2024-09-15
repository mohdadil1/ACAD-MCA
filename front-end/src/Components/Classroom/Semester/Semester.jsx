import React, { Fragment } from 'react';
import './Semester.css';
import Cards from './Cards/Cards';
import Jumbotron from '../../UI/Jumbotron/Jumbotron';
import { useParams } from 'react-router';
import * as subjects from '../../../New_Subjects.json';

const Semester = () => {
	const { semester } = useParams();
	const cardsContainer = [];

	let jumboTitle = semester === 'semester1' ? 'Semester 1' 
	: semester === 'semester2' ? 'Semester 2' 
	: semester === 'semester3' ? 'Semester 3' 
	: semester === 'semester4' ? 'Semester 4' 
	: semester === 'semester5' ? 'Semester 5' 
	: 'Semester 6';

	for (let key in subjects.default[semester]) {
		var obj = subjects.default[semester][key];
		var title = obj.subjectName;
		var code = obj.subjectCode;
		var credits = obj.credits;
		cardsContainer.push(
			<Cards
				title={title}
				link={`/classroom/${semester}/${obj.id}`}
				code={code}
				credits={credits}
				linkText="Go to Subject1"
				key={obj.id}
			/>
		);
	}
	return (
		<Fragment>
			<Jumbotron title={jumboTitle} description="You will find here subject-wise resources for this semester" />
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 p-24 mb-12">
				<div className="card-deck">{cardsContainer}</div>
			</div>
		</Fragment>
	);
};

export default Semester;
