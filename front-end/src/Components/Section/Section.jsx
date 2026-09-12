import React from 'react';
import '../Section/Section.css';
import Card from '../UI/Card/Card';

const Section = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full bg-gradient-to-b from-white to-slate-100 p-4 sm:p-8 sm:py-16">
			<div className="card-deck">
				<Card
					title="Courses"
					description="Find class notes, teacher's slides, and other related resources"
					link="/classroom"
					linkText="Go to Courses"
				/>
				<Card
					title="Coding Sheet "
					description="Practice coding questions for company interviews"
					link="/coding"
					linkText="Go to Coding Sheet"
				/>
				<Card
					title="Playground"
					description="Write and run C, C++, Java, Python or JavaScript right in your browser"
					link="/playground"
					linkText="Go to Playground"
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
