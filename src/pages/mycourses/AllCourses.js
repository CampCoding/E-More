import React, { useEffect, useState } from "react";
import { MdPlayLesson } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import "./allcourses.css";
import "./maincourse.css";
import { getCourses } from "./functions/getAll";
import { useDispatch } from "react-redux";
import ContentLoader from "react-content-loader";
import { decryptData } from '../../utils/decrypt';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(false);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
    getCourses(
      decryptedUserData,
      setPageLoading,
      setCourses,
      setOriginalCourses,
      dispatch
    );
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div className="allcourses">
        <AllCoursesBanner
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />

        <div className="py-3 courses_content">
          {!courses ? (
            <div style={{ width: "100vw " }}>
              <ContentLoader
                viewBox="0 0 980 320"
                speed={1}
                // backgroundColor={'green'}
              >
                {}
                <rect x="10" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="350" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
              </ContentLoader>
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item, index) => {
              return (
                <div
                  key={item.course_id}
                  className="course-card"
                  onClick={() => {
                    if(!userData?.student_id){
                      return navigate("/login")
                    }
                    return item?.own
                      ? navigate(
                          "/CourseContent?course_id=" +
                            item?.course_id +
                            "&course_name=" +
                            item?.course_name +
                            "&r=" +
                            item?.finished_rate +
                            "&p=" +
                            item?.pdf_url,
                          {
                            state: { course: item }
                          }
                        )
                      : navigate("/Subscribe");
                  }}
                >
                  <div class="main">
                    <img
                      class="tokenImage"
                      src={item?.course_photo_url}
                      alt=""
                    />

                    <div className="course-content-body">
                      <h4>{item?.course_name}</h4>
                      <p class="description">
                        {item?.course_content?.length > 50
                          ? item?.course_content?.substring(0, 50) + "..."
                          : item?.course_content}
                      </p>
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
      </div>
    </div>
  );
};

export default MyCourses;
