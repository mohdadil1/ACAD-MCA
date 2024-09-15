import React from "react";
const Jumbotron=(props)=>{
    return(
        <div className= "font-sans bg-[#393e46]  p-5 md:p-16">
            <div className="container">
            <h1 className="font-sans text-[3.5rem] font-light leading-tight mt-0 mb-2 text-white">{props.title}</h1>

               <p className="text-white text-xl font-light mt-0 mb-4 font-sans">{props.description}</p>

            </div>
        </div>
    );
};
export default Jumbotron;