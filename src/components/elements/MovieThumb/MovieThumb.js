import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./MovieThumb.css";

const MovieThumb = (props) => {
  return (
    <div>
      <div className="rmdb-moviethumb">
        {props.clickable ? (
          <Link
            to={{
              pathname: `/${props.movieId}`,
              movieName: `${props.movieName}`,
            }}
          >
            <img src={props.image} alt="moviethumb" />
          </Link>
        ) : (
          <img src={props.image} alt="moviethumb" />
        )}
      </div>

      <div className="rmdb-movieinfoo">
        <h3 className="rmdb-moviename">{props.movieName}</h3>
        <div
          className={`rmdb-movievote ${
            props.movieVote >= 9
              ? "green"
              : props.movieVote >= 7
              ? "orange"
              : "red"
          }`}
        >
          {props.movieVote}
        </div>
      </div>
    </div>
  );
};

MovieThumb.propTypes = {
  image: PropTypes.string,
  movieId: PropTypes.number,
  movieName: PropTypes.string,
};

export default MovieThumb;
