import React from 'react';
import './courseinfo.css';
import CourseIntroVideo from './CourseIntroVideo/CourseIntroVideo';
const CourseInfo = ({ course }) => {
  // console.log(course)
  // console.log(course)
  return (
    <div className="courseinfo">
      <CourseIntroVideo course={course} />
      {}
      {}
    </div>
  );
};

export default CourseInfo;
