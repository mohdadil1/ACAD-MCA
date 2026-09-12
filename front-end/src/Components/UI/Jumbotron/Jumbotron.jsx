import React from "react";
const Jumbotron=(props)=>{
    return(
        <div className= "font-sans bg-[#393e46] p-5 sm:p-8 md:p-16">
            <div className="container mx-auto px-2 sm:px-4">
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight mt-0 mb-2 text-white">{props.title}</h1>

               <p className="text-white text-base sm:text-lg md:text-xl font-light mt-0 mb-4 font-sans">{props.description}</p>

            </div>
        </div>
    );
};
export default Jumbotron;