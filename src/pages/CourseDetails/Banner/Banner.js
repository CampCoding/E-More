import React from 'react';
import './banner.css';
const Banner = () => {
  return (
    <div className="course_banner">
      <div className="banner2">
        <div className="left">
          <h5>Welcome To You My Doctor</h5>
          <p>
            This is The Description Of My Course In this System and we Will
            Explain All This in This Course
          </p>
          <h6>I Hope You Get A Good information</h6>
        </div>
        <div className="right">
          <img src={require("../../../assets/books.png")} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
