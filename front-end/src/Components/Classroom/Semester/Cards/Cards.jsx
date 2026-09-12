import React,{Fragment} from "react";
import { Link } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ArrowForward";
import '../Cards/Cards.css';

const Cards=(props)=>{
    
    return (
        <Fragment>
            <div className="card group flex flex-col min-w-0 relative bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 break-words max-w-[300px] sm:flex-1 sm:mb-0 sm:mx-4 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
            <div className="card-body flex flex-col flex-1 min-h-0 p-5">
                <h2 className="card-title mb-3 text-2xl sm:text-3xl font-medium leading-tight mb-2 mt-0 font-sans text-gray-800">{props.title}</h2>

                <p className="card-text mt-0 mb-4 font-sans text-gray-600">Subject Code: {props.code}</p>

                    <p className="card-text font-sans text-gray-600">Credits: {props.credits}</p>
                    <Link
                        to={props.link}
                        className="mt-auto ml-auto inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-200"
                    >
                    <ArrowForward fontSize="small"/>
                    </Link>
                </div>
            </div>
        </Fragment>
    );
};
export default Cards;