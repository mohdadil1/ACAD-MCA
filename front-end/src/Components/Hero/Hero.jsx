import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
	return (
		<div className="relative overflow-hidden py-8 sm:py-12 pb-16 sm:pb-24 text-white bg-brand-dark font-sans force-center">
			<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

			<div className="relative container mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-[3rem]">

       <div className="flex flex-wrap -mx-[15px] py-6 sm:py-12">
					<div className="mx-auto w-full lg:w-10/12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-light leading-tight mb-4 sm:mb-[1.5rem] mt-0">
						Welcome to{' '}
						<span className="font-semibold bg-gradient-to-r from-brand-300 via-cyan-300 to-brand-200 text-transparent bg-clip-text">
							ACAD
						</span>
					</h1>

						<p className="text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 text-slate-200/90 max-w-3xl mx-auto">
							Tired of cluttered study resources? Or worried about placements? ACAD is here to help
							you. ACAD is your virtual classroom, built to bring together everything you need
							across your courses and semesters. So, you'll get everything at one place, organised
							and updated.
						</p>

						<div className="mb-8 sm:mb-10">
							<Link
								to="/classroom"
								className="inline-block bg-gradient-to-r from-brand-500 to-cyan-400 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-brand-900/40 hover:shadow-brand-500/40 hover:scale-[1.03] transition-all duration-200"
							>
								Go to Classroom
							</Link>
						</div>

						<q className="block text-slate-300/80 italic">Power is gained by sharing knowledge, not by hoarding it.</q>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
