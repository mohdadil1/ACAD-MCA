import React from "react";
import "font-awesome/css/font-awesome.min.css";

const About = () => {
  return (
    <>
      <section>
        
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4 py-12 text-center">
          
          
            <div className="flex flex-wrap -mx-4 mb-12">
            <div className="w-full px-4">
              <h1 className="text-3xl font-bold text-gray-700 mb-2 font-sans">Our Team</h1>
              <h3 className="my-4 font-medium leading-snug font-sans">
                Purpose is an incredible alarm clock. So, this is a small initiative by us.
              </h3>
            </div>
          </div>

          
          <div className="flex flex-wrap justify-center -mx-4">
            
            <div className="w-full sm:w-3/4 md:w-2/3     lg:w-1/2 xl:w-1/3 px-4">
              
              
              <div className="h-full bg-white border border-gray-200 shadow-md transition-all duration-100 ease-in flex flex-col break-words relative">
                
              
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
                    <i className="fa fa-github text-gray-700 text-[26px]" />
                   </a>
                    </div>
                    <div className="p-6">
                    <a 
                      href="https://linkedin.com/in/mohd-adil"
                      target="blank"
                    >
                     <i className="fa fa-linkedin text-gray-700 text-[26px]"/>
                    </a>
                    </div>
                    </div>
                   </div>
                   </div>
                 </div>
                 </div>
                 {/* card 2*/}
                {/*}
                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 px-4">
                 <div className="h-full bg-white border border-gray-200 shadow-md transition-all duration-100 ease-in flex flex-col break-words relative">
                <div className="flex-1 min-h-0 p-5">
                 <div className="flex flex-col items-center">
                    <img
                      className="rounded-md w-full h-auto mb-3 max-w-[75%]"
                      src="http://res.cloudinary.com/dyuw3dvko/image/upload/v1724338621/pallavi1_roqeep.jpg"
                      alt="Pallavi"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 leading-snug mb-2 mt-0 font-sans">Pallavi Yadav</h3>
                    <h5 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Student, NIT Jamshedpur</h5>
                    <h4 className="text-xl font-medium leading-snug mb-2 mt-0 font-sans">Full stack, front-end Developer</h4>
                    <p className="font-medium mb-4 mt-0 font-sans">Sleep over everything!.</p>
                    <div className="flex flex-row justify-center">
                    <div className="p-6">
                    <a
                      href="https://github.com/pallavi-yadav-177/"
                      target="_blank"
                    >
                     <i className="fa fa-github text-gray-700 text-[26px]" />
                    </a>
                     </div>
                     <div className="p-6">
                     <a 
                      href="https://linkedin.com/inpallavi-yadav-177"
                      target="blank"
                    >
                     <i className="fa fa-linkedin text-gray-700 text-[26px]"/>
                    </a>
                    </div>
                    </div>
                   </div> 
                  </div>
                 </div>
                </div>
                { */}
               </div>
              </div>
           </section>
           <hr className="border-0 border-t-2 border-dashed border-gray-900">
           </hr>
           <br></br>
           <section>
           <div className="container mx-auto px-4 text-center">
           <h1 className="text-3xl font-bold text-gray-700 mb-2 font-sans">Contact us</h1>
           <p className="text-center mb-4 mt-0">Get in touch!</p>
        <a className="p-6 text-blue-600 underline font-bold"href="mailto:mohdadil9559@iclout.com.com">
            Mohd Adil
           </a>
           {/* }
            <a className="text-blue-600 underline font-bold" href="mailto:pallavi.yad998@gmail.com">
            Pallavi Yadav
            </a>
           {*/}
            </div>
           </section>
          </>
  );
}

export default About;
