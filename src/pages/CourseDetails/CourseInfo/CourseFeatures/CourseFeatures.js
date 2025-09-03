import React from "react";
import "./coursefeatures.css";
const CourseFeatures = ({ course }) => {
  return (
    <div className="coursefeature">
      <h4>Round Features</h4>
      <div>
        <h5>Lectures</h5>
        <p>{course.lecatures}</p>
      </div>
      <div>
        <h5>Duration</h5>
        <p>{course.duration}</p>
      </div>
      <div>
        <h5>Level</h5>
        <p>{course.skil_lev}</p>
      </div>
    </div>
  );
};

export default CourseFeatures;
