import React from 'react';
import './Hero.css';

const Hero = () => {
	return (
		<div className=" py-12 pb-24 text-white bg-[#393e46] font-sans force-center">
			<div className="container px-12 py-[3rem]">
				
       <div className="flex flex-wrap -mx-[15px] py-12"> 
					<div className="mx-auto col-lg-10">
          <h1 className="text-[3.5rem] font-light leading-tight mb-[1.5rem] mt-0">Welcome to ACAD MCA</h1>

						<p className="text-xl font-light mb-12">
							Tired of cluttered study resources? Or Worried about placements? ACAD MCA is here to help
							you. ACAD MCA is your virtual classroom. Its goal is to provide you all the resources you
							need during your MCA at NIT Jamshedpur. So, you'll get everything at one place, organised
							and updated.
						</p>
						<q style={{ fontStyle: 'italic' }}>Power is gained by sharing knowledge, not by hoarding it.</q>
						<br />
						<h3 className="alertHero">We've updated interview experiences.</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
