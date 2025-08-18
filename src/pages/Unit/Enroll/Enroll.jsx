import React, { useEffect, useState } from 'react';
import CourseInfo from '../../CourseDetails/CourseInfo/CourseInfo';
import './enroll.css';
import { useLocation, useNavigate } from 'react-router';
import Lessons from '../Lessons/Lessons';
import CourseIntroVideo from '../../CourseDetails/CourseInfo/CourseIntroVideo/CourseIntroVideo';
import Footer from '../../../components/Footer/Footer';

export default function Enroll() {
  const location = useLocation();
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const [showVids, setShowVids] = useState(false);
  const [itemID, setItemID] = useState(null);
  const [itemVideos, setItemVideos] = useState(null);
  const [active, setActive] = useState('bg-secondary-subtle');

  function handleShownItem(item) {
    setItemID(item?.unit_id);
    if (item?.unit_id === itemID) {
      setShowVids(!showVids);
    } else {
      setShowVids(true);
    }
    // setItemVideos(item?.videos)
    // console.log(item);
  }

  useEffect(() => {
    // console.log(location?.state?.course);
    // console.log(location?.state?.title);
    // console.log(location?.state?.description);
    // console.log(location?.state?.item);
    console.log("location?.state", location?.state?.course);
  }, []);

  return (
    <>
      <div className="coursecontentdetails">
        {location?.state == null ? (
          <>
            <div className="subscripe">
              <div className="text-center">
                <div className="fs-2 fw-semibold py-2">
                  Join Courses with Subscription Code
                </div>
                <p className="fw-medium midText">
                  Empower Yourself with Our Cutting-Edge Courses
                </p>
                <p className="fw-medium text-secondary m-auto ">
                  Stay at the forefront of knowledge with our dynamic courses
                  and instant updates
                </p>
              </div>
              <CourseIntroVideo hide={'visually-hidden'} />
            </div>
          </>
        ) : (
          <>
            <div className="infoContain">
              <div className="col-md-6 p-5 textContain">
                <div className="fs-2 fw-bold">{location?.state?.title}</div>
                {!more ? (
                  <p>
                    {location?.state?.description
                      ?.split(' ')
                      ?.slice(0, 10)
                      ?.join(' ')}{" "}
                    . . .{" "}
                    <span
                      className="fst-italic fw-light"
                      type="button"
                      onClick={() => setMore(!more)}
                    >
                      read more
                    </span>
                  </p>
                ) : (
                  <p>
                    {location?.state?.description} <br /> . . .{" "}
                    <span
                      className="fst-italic fw-light"
                      type="button"
                      onClick={() => setMore(!more)}
                    >
                      read less
                    </span>
                  </p>
                )}
                <div className="d-flex mb-3">
                  <div>
                    4.4<i className="fa-solid px-1 text-warning fa-star"></i>
                    (140 ratings)
                  </div>
                </div>
              </div>
              <div className="col-md-3 bg-white imgContain">
                <img
                  src={location?.state?.imgSrc}
                  className="w-100 "
                  alt="image"
                />
                {}
                <div className="d-flex justify-content-center mt-5">
                  <CourseInfo course={location?.state?.course} />
                </div>
              </div>
            </div>
            {}
            <div className=" courseContain">
              {}
              <h1>Course Content</h1>
              {location?.state?.course &&
                location?.state?.course?.length &&
                location?.state?.course?.map((item) => (
                  <>
                    <div
                      className="collapseItem py-3 fs-6 fw-semibold px-3 text-capitalize bg-secondary-subtle"
                      type="button"
                      onClick={() => {
                        handleShownItem(item);
                      }}
                    >
                      {item.unit_name}
                    </div>
                    <div type="button">
                      {item?.unit_id === itemID && showVids ? (
                        <>
                          {item?.videos.map((video) => (
                            <>
                              <div
                                className="contentCard d-flex gap-2 p-3"
                                // onClick={() => navigate(`/videos` ,{videoLink:video.youtube_id})}
                              >
                                <span>{video.order_no}</span>
                                <div>{video.video_title}</div>
                              </div>
                            </>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </>
                ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
