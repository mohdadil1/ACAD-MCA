import React from 'react';
import '../Section/Section.css';
import Card from '../UI/Card/Card';

const Section = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full bg-gray-200 p-8 ">
			<div className="card-deck">
				<Card
					title="Classroom"
					description="Find class notes, teacher's slides and other related stuffs"
					link="/classroom"
					linkText="Go to Classroom"
				/>
				<Card
					title="Coding Sheet "
					description="Coding question for the companies"
					link="/coding"
					linkText="Placement"
				/>
				<Card
					title="Blogs"
					description="Love Reading? You're at the right place!"
					link="/blogs"
					linkText="Stay Tuned"
				/>
			</div>
		</div>
	);
};

export default Section;
