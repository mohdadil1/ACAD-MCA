import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Card = (props) => {
  return (
    <Fragment>
      <div className="card flex flex-col w-full max-w-[18rem] m-2 sm:m-4 bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="card-body flex-1 p-5">
          <h3 className="text-2xl font-medium leading-tight mb-3 font-sans text-center">{props.title}</h3>

          <p className="card-text font-sans">{props.description}</p>
        </div>
        <div className="card-body flex justify-end p-5 pt-0">
          <Link to={props.link} className="card-link text-gray-700 hover:text-blue-600" aria-label={props.linkText}>
            <ArrowForwardIcon />
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
