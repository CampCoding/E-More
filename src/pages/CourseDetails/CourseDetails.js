import React, { useEffect, useState } from "react";
import "./coursedetails.css";
import Banner from "./Banner/Banner";
import CourseContent from "./CourseContent/CourseContent";
import CourseInfo from "./CourseInfo/CourseInfo";
import { useLocation, useNavigate } from "react-router";
import { MdPlayLesson } from "react-icons/md";

const CourseDetails = ({ course, handleChange, checkOwn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courseDetails, setCourseDetails] = useState([]);

  const handleEqData = () => {
    setCourseDetails(course);
  };

  const handleChangeShow = (item) => {
    handleChange(item);
    let pushedData = [];
    for (let i = 0; i < courseDetails.length; i++) {
      if (item.unit_id == courseDetails[i].unit_id) {
        let obj = {
          ...courseDetails[i],
          show: !courseDetails[i]["show"]
        };
        pushedData.push(obj);
      } else {
        let obj = {
          ...courseDetails[i],
          show: false
        };
        pushedData.push(obj);
      }
    }
    setCourseDetails(pushedData);
  };

  useEffect(() => {
    handleEqData();
    console.log(location?.state?.course);
  }, []);

  if (!location.state) {
    navigate(-1, { replace: true });
  }

  return (
    <div className="coursedetails_page">
      {}
      {course && course?.length > 0 ? (
        <div
          className={
            checkOwn ? "coursedetails_container" : "coursedetails_container"
          }
        >
          <div className={checkOwn ? "left m_au" : "left"}>
            <CourseContent
              checkOwn={checkOwn}
              course_data={location?.state?.course}
              handleChangeShow={handleChangeShow}
              course={course}
            />
          </div>
          {}
        </div>
      ) : (
        <div className="empty">
          <MdPlayLesson className="icon" />
          <h5>No Lessons</h5>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
