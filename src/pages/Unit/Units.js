import React, { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import { useLocation, useNavigate } from "react-router";
import "./units.css";
import About from "./About/About";
import Lessons from "./Lessons/Lessons";
import Books from "../Books/Books";
import UniteReviews from "./UnitReviews/UniteReviews";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { base_url } from "../../constants";
import { handleLogOut } from "../../App";
import { decryptData } from '../../utils/decrypt';

const Units = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [checkOwn, setCheckOwn] = useState(false);
  const [courseDetails, setCourseDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState("about");

  const getUnitData = () => {
    const data_send = {
      student_id: userData?.student_id,
      token_value: userData?.token_value,
      course_id: location?.state?.course?.course_id
    };

    axios
      .post(
        base_url + "/user/courses/select_course_lesson.php",
        JSON.stringify(data_send)
      )
      .then(async (res) => {
        if (res.data.status == "success") {
          setCheckOwn(res.data.message[0].videos[0].own);
          let allcourses = [...res.data.message];
          let pushedData = [];
          for (let i = 0; i < allcourses.length; i++) {
            let obj = {
              ...allcourses[i],
              show: false
            };
            pushedData.push(obj);
          }
          if (allcourses[0]?.videos[0]?.own) {
            navigate(
              "/CourseContent?course_id=" +
                allcourses[0]?.course_id +
                "&course_name=" +
                allcourses[0]?.course_name +
                "&r=" +
                allcourses[0]?.finished_rate +
                "&p=" +
                allcourses[0]?.pdf_url,
              {
                state: { course: allcourses[0] }
              }
            );
          }
          setCourseDetails(pushedData);
        } else if (res.data.status == "out") {
          localStorage.clear();

          // window.location.reload();
        }
      })
      .catch((e) => console.log(e));
  };

  const handleChange = (item) => {
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

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
  // scrollToTop()
  useEffect(() => {
    scrollToTop();
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
    getUnitData();
  }, []);

  if (!location.state) {
    navigate(-1, { replace: true });
  }

  return (
    <>
      <div className="units_page">
        <Banner
          imgSrc={location?.state?.course?.course_photo_url}
          description={location?.state?.course?.course_content}
          title={location?.state?.course?.course_name}
          item={location?.state?.course}
          course={courseDetails}
          checkOwn={checkOwn}
          handleChange={handleChange}
        />

        {}
      </div>
      <Footer />
    </>
  );
};

export default Units;
