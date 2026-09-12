import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Card = (props) => {
  return (
    <Fragment>
      <div className="card group flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200">
        <div className="h-1.5 w-full rounded-t-xl bg-gradient-to-r from-brand-500 to-cyan-400" />
        <div className="card-body flex-1 p-5">
          <h3 className="text-2xl font-medium leading-tight mb-3 font-sans text-center text-gray-800">{props.title}</h3>

          <p className="card-text font-sans text-gray-600">{props.description}</p>
        </div>
        <div className="card-body flex justify-end p-5 pt-0">
          <Link
            to={props.link}
            className="card-link inline-flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-200"
            aria-label={props.linkText}
          >
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
