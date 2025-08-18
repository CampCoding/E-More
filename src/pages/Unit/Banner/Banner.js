import React, { useState } from 'react';
import './banner.css';
import { useNavigate } from 'react-router';
const Banner = ({
  title,
  description,
  imgSrc,
  course,
  item,
  checkOwn,
  handleChange
}) => {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  return (
    <div className="course_banner">
      <div className="d-flex w-100 align-items-center justify-content-center courseContain">
        <div className="right">
          <img src={imgSrc} alt="img" />
        </div>
        <div className="left text-dark">
          {}
          <h4>In {title}</h4>
          {!more ? (
            <p>
              {description?.split(' ').slice(0, 15).join(' ')} . . .{" "}
              <span
                className="fst-italic fw-light"
                type="button"
                onClick={() => setMore(!more)}
              >
                read more
              </span>
            </p>
          ) : (
            <p>
              {description}
              <span
                className="fst-italic fw-light"
                type="button"
                onClick={() => setMore(!more)}
              >
                . . .read less
              </span>
            </p>
          )}
          <div className="d-flex mb-3">
            {}
            <div>
              4.4<i className="fa-solid px-1 text-warning fa-star"></i>(140
              ratings)
            </div>
          </div>
          <h6 onClick={() => console.log(course)}>
            I Hope You Get A Good information
          </h6>
          {}
          <button
            onClick={() =>
              navigate(`/enroll`, {
                state: {
                  course: course,
                  title: title,
                  description: description,
                  item: item,
                  imgSrc: imgSrc
                }
              })
            }
            className="btn btn-dark w-100 rounded-0 my-3"
          >
            Go To Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
