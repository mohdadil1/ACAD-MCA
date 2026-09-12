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
					description="Love reading? You're at the right place!"
					link="/blogs"
					linkText="Go to Blogs"
				/>
				<div
					className="card flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-gray-50 border border-gray-100 rounded-xl opacity-80 cursor-not-allowed"
					aria-disabled="true"
				>
					<div className="h-1.5 w-full rounded-t-xl bg-gray-200" />
					<div className="card-body flex-1 p-5">
						<h3 className="text-2xl font-medium leading-tight mb-3 font-sans text-center text-gray-400">Placement</h3>
						<p className="card-text font-sans text-gray-400 text-center">Interview experiences and placement resources</p>
					</div>
					<div className="card-body flex justify-center p-5 pt-0">
						<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-500">
							Coming soon
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section;
