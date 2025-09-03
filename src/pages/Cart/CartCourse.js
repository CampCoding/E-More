import React from "react";
import "./cart.css";
const CartCourse = ({ course }) => {
  return (
    <div className="cart_course">
      <div className="left">
        <img src={course.img} alt="" />
      </div>
      <div className="right">
        <h4>{course.title}</h4>
        <p>{course.duration}</p>
        <p>{course.doctore}</p>
        <p>{course.description}</p>
        <div className="feats">
          {course.features.map((item, index) => {
            return (
              <h4>
                <img src={require("../../assets/true.png")} alt="" />
                <span>{item.name}</span>
              </h4>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CartCourse;
