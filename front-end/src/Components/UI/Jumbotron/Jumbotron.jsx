import React from "react";
const Jumbotron=(props)=>{
    return(
        <div className="relative overflow-hidden font-sans bg-brand-dark p-5 sm:p-8 md:p-16">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="relative container mx-auto px-2 sm:px-4">
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight mt-0 mb-2 text-white">{props.title}</h1>

               <p className="text-slate-200/90 text-base sm:text-lg md:text-xl font-light mt-0 mb-4 font-sans">{props.description}</p>

            </div>
        </div>
    );
};
export default Jumbotron;