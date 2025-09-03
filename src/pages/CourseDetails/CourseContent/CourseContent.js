import React, { useState } from "react";
import "./coursecontent.css";
import { useLocation, useNavigate } from "react-router";
import { IoChevronUp, IoChevronDown, IoChevronForward } from "react-icons/io5";
import { Axios } from "../../../components/axios/index";
import { toast } from "react-toastify";
const CourseContent = ({ course, handleChangeShow, course_data, checkOwn }) => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <div className="coursecontent">
      <div className="course_features">
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "20px",
            justifyContent: "center"
          }}
        >
          <span>{course_data?.course_name}</span>
          {}
        </h4>
        {course &&
          course?.map((item, index) => {
            return (
              <div
                onClick={() => {
                  handleChangeShow(item);
                }}
                key={index}
                className="content_div accordion-item "
              >
                <h4>
                  <span>{item?.unit_name}</span>
                  <span>
                    {item.show ? <IoChevronDown /> : <IoChevronForward />}
                  </span>
                </h4>
                <div className={item.show ? "videos show" : "videos hide"}>
                  {item?.videos?.map((video, ind) => {
                    return (
                      <div key={index} className="video">
                        <div
                          onClick={() => {
                            if (video.own) {
                              // const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                              //   const match = video.youtube_id.match(regExp);
                              //   console.log(match)
                              //   return (match && match[2].length === 11)
                              //     ? match[2]
                              //     : null;
                              navigate("/lessonvideo", {
                                state: { video, item }
                              });
                            } else {
                              toast.warn("Please subscribe first");
                              return;
                            }
                          }}
                          className="left"
                        >
                          <span>
                            {video?.order_no < 10
                              ? "0" + video?.order_no
                              : video?.order_no}
                          </span>
                          <h5>
                            {video.video_title}{" "}
                            {video?.video_duration
                              ? video?.video_duration
                              : null}
                          </h5>
                        </div>
                        <div className="rowDiv">
                          {}
                          <img
                            onClick={() => {
                              if (video.own) {
                                // const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                //   const match = video.youtube_id.match(regExp);
                                //   console.log(match)
                                //   return (match && match[2].length === 11)
                                //     ? match[2]
                                //     : null;
                                navigate("/lessonvideo", {
                                  state: { video, item }
                                });
                              } else {
                                toast.warn("Please subscribe first");
                                return;
                              }
                            }}
                            src={require("../../../assets/play.png")}
                            alt=""
                          />
                          {}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CourseContent;
