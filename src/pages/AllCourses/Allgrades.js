import React, { useEffect, useState } from "react";
import "./allcourses.css";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import Footer from "../../components/Footer/Footer";
import Skeleton from "react-loading-skeleton";
// import { getCourses } from "./functions/getAll";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";
import { decryptData } from '../../utils/decrypt';

const AllUnivs = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const { id } = useParams();
  const [exams, setExams] = useState([]);
  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, []);

  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        university_id: id
      };
      axios
        .post(
          base_url + "/user/grades/select_grade_university.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status == "success") {
            setCourses(res.data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setPageLoading(false);
        });
    };
    getCourses();
  }, []);
  return (
    <>
      <div className="allcourses grades">
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
            Each University has a special courses designed to its students , so
            we guaranteed to you a high level of education and experience.
          </p>
        </div>
        {}
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: 900 }}>
          Grades
        </h2>

        <div className="courses_content py-2">
          {pageLoading ? (
            <div style={{ width: "100vw " }}>
              <Skeleton count={12} height={34} />
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item, index) => {
              return (
                <div
                  key={item.university_id}
                  className="course-card"
                  onClick={() => {
                    navigate("/allcourses/" + item?.grade_id);
                  }}
                >
                  <div class="main">
                    <div className="course-title unive_Title">
                      <h2 style={{ fontSize: "33px" }}>{item?.grade_name}</h2>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <MdPlayLesson className="icon" />
              <h5>No Courses</h5>
            </div>
          )}
        </div>
        {}
      </div>
      <Footer />
    </>
  );
};

export default AllUnivs;
