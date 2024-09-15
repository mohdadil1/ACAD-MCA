import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Card = (props) => {
  return (
    <Fragment>
      <div
        className="card "
        style={{
          display: "inline-block",
          width: "18rem",
          margin: "1rem 1rem 1rem 1rem",
        }}
      >
        <div className=" card-body">

        <h3 className="text-2xl font-medium leading-tight mb-3 font-sans text-center">{props.title}</h3>

          <p className="card-text font-sans">{props.description}</p>
        </div>
        <div className="card-body float-right">
          <Link to={props.link} className="card-link">
            <ArrowForwardIcon />
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
