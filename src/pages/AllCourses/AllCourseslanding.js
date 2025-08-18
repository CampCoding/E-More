import React, { useEffect, useState } from "react";
import "./allcourses.css";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import Footer from "../../components/Footer/Footer";
import Skeleton from "react-loading-skeleton";
import { getCourses } from "./functions/getAll";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { decryptData } from '../../utils/decrypt';

const AllCoursesLanding = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, []);

  useEffect(() => {
    getCourses(userData, setPageLoading, setCourses, setOriginalCourses, id);
  }, []);

  console.log(courses);
  return (
    <>
      <div className="allcourses">
        {}
        <div className="all_course-title">
          <h3
            style={{
              marginTop: "50px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "32px",
              fontWeight: "bold"
            }}
          >
            Tap on the university below to see the courses available to it
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              fontSize: "15px",
              color: "grey"
            }}
          >
            <p>
              {" "}
              Each University has a special courses designed to its students ,
              so we guaranteed to you a high level of education and experience.
            </p>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ margin: "20px auto" }}
            >
              Join Now And Enroll Our Courses
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllCoursesLanding;
