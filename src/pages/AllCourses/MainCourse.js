import React from "react";
import { useNavigate } from "react-router";
import { coursesTypesData } from "../Home/Courses/data";
import "./maincourse.css";
const MainCourse = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate("/units", { state: { course: course } });
      }}
      className="main_course"
    >
      <div className="image">
        <img src={course.course_photo_url} alt="" />
        <div className="price">
          <span>
            {coursesTypesData
              .filter((it) => it.id == course.type_id)
              .map((val) => val.name)}
          </span>
        </div>
      </div>
      <div className="description">
        <h4>{course.course_name}</h4>
        <p>{course.course_content}</p>
        {}
      </div>
    </div>
  );
};

export default MainCourse;
