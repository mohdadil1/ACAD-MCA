import React,{Fragment} from "react";
import { Link } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ArrowForward";
import '../Cards/Cards.css';

const Cards=(props)=>{
    
    return (
        <Fragment>
            <div className="card flex flex-col min-w-0 relative bg-white border border-gray-200 rounded-md break-words max-w-[300px] sm:flex-1 sm:mb-0 sm:mx-4">
            <div className="card-body flex flex-col flex-1 min-h-0 p-5">
                <h2 className="card-title mb-3 text-3xl font-medium leading-tight mb-2 mt-0 font-sans">{props.title}</h2>

                <p className="card-text mt-0 mb-4 font-sans">Subject Code: {props.code}</p>

                    <p className="card-text font-sans">Credits:{props.credits}</p>
                    <Link to={props.link} className="mt=auto ml-auto">
                    <ArrowForward/>
                    </Link>
                </div>
            </div>
        </Fragment>
    );
};
export default Cards;