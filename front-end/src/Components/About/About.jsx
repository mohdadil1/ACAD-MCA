import React from "react";
import "font-awesome/css/font-awesome.min.css";

const About = () => {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-100">

           <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 py-12 sm:py-16 text-center">


            <div className="flex flex-wrap -mx-4 mb-12">
            <div className="w-full px-4">
              <h1 className="text-3xl font-bold mb-2 font-sans bg-gradient-to-r from-brand-600 to-cyan-600 text-transparent bg-clip-text inline-block">Our Team</h1>
              <h3 className="my-4 font-medium leading-snug font-sans text-gray-600">
                Purpose is an incredible alarm clock. So, this is a small initiative by us.
              </h3>
            </div>
          </div>


          <div className="flex flex-wrap justify-center -mx-4">

            <div className="w-full sm:w-3/4 md:w-2/3     lg:w-1/2 xl:w-1/3 px-4">


              <div className="h-full bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 flex flex-col break-words relative overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                
              
                <div className="flex-1 min-h-0 p-5">
                  
                  
                  <div className="flex flex-col items-center">
                    <img
                      className="rounded-md w-full h-auto mb-3 max-w-[85%]"
                      src="http://res.cloudinary.com/dyuw3dvko/image/upload/v1724371087/adil1_ugga81.jpg"
                      alt="Adil"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 leading-snug mb-2 mt-0 font-sans">Mohd Adil</h3>
                    <h5 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Student, NIT Jamshedpur</h5>
                    <h4 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Mern stack, Back-end Developer</h4>
                    <p className="font-medium mb-4 mt-0 font-sans">Changing the world, one commit at a time.</p>
                    <div className="flex flex-row justify-center">
                    <div className="p-6">
                    <a
                      href="https://github.com/mohdadil1/"
                      target="_blank"
                    >
                    <i className="fa fa-github text-gray-700 hover:text-brand-600 transition-colors duration-200 text-[26px]" />
                   </a>
                    </div>
                    <div className="p-6">
                    <a
                      href="https://linkedin.com/in/mohd-adil"
                      target="blank"
                    >
                     <i className="fa fa-linkedin text-gray-700 hover:text-brand-600 transition-colors duration-200 text-[26px]"/>
                    </a>
                    </div>
                    </div>
                   </div>
                   </div>
                 </div>
                 </div>

                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 px-4">
                  <div className="h-full bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 flex flex-col break-words relative overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                    <div className="flex-1 min-h-0 p-5">
                      <div className="flex flex-col items-center">
                        <img
                          className="rounded-md w-full h-auto mb-3 max-w-[85%]"
                          src="/pallavi22.jpg"
                          alt="Pallavi"
                        />
                        <h3 className="text-2xl font-bold text-gray-800 leading-snug mb-2 mt-0 font-sans">Pallavi Yadav</h3>
                        <h5 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Student, NIT Jamshedpur</h5>
                        <h4 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Front-end Developer</h4>
                        <p className="font-medium mb-4 mt-0 font-sans">Sleep over everything!.</p>
                        <div className="flex flex-row justify-center">
                          <div className="p-6">
                            <a
                              href="https://github.com/pallavi-yadav-177/"
                              target="_blank"
                            >
                              <i className="fa fa-github text-gray-700 hover:text-brand-600 transition-colors duration-200 text-[26px]" />
                            </a>
                          </div>
                          <div className="p-6">
                            <a
                              href="https://linkedin.com/inpallavi-yadav-177"
                              target="blank"
                            >
                              <i className="fa fa-linkedin text-gray-700 hover:text-brand-600 transition-colors duration-200 text-[26px]"/>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               </div>
              </div>
           </section>
           <hr className="border-0 border-t-2 border-dashed border-gray-200">
           </hr>
           <br></br>
           <section className="bg-gradient-to-b from-white to-slate-100">
           <div className="container mx-auto px-4 py-4 text-center">
           <h1 className="text-3xl font-bold mb-2 font-sans bg-gradient-to-r from-brand-600 to-cyan-600 text-transparent bg-clip-text inline-block">Contact us</h1>
           <p className="text-center mb-4 mt-0 text-gray-600">Get in touch!</p>
        <a className="p-6 text-brand-600 hover:text-brand-700 underline font-bold" href="mailto:adilm925@gmail.com">
            Mohd Adil
           </a>
            <a className="p-6 text-brand-600 hover:text-brand-700 underline font-bold" href="mailto:pallavi.yad998@gmail.com">
            Pallavi Yadav
            </a>
            </div>
           </section>
          </>
  );
}

export default About;
