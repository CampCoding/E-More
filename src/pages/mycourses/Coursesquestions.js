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

const Coursesquestions = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(false);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const userData = decryptData(localData);
    getCourses(
      userData,
      setPageLoading,
      setCourses,
      setOriginalCourses,
      dispatch
    );
  }, []);

  // Fun colors for course cards
  const cardColors = [
    'from-pink-400 to-blue-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-pink-500',
    'from-indigo-400 to-blue-500'
  ];

  const getRandomColor = (index) => cardColors[index % cardColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Fun Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-green-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-10 right-10 w-7 h-7 bg-blue-400 rounded-full animate-bounce delay-700"></div>

        {/* Fun Shapes */}
        <div className="absolute top-32 left-1/4 text-4xl animate-pulse">
          ⭐
        </div>
        <div className="absolute top-16 right-1/3 text-3xl animate-pulse delay-200">
          🌟
        </div>
        <div className="absolute bottom-32 left-1/3 text-4xl animate-pulse delay-400">
          ✨
        </div>
        <div className="absolute bottom-16 right-1/4 text-3xl animate-pulse delay-600">
          🎯
        </div>
      </div>

      <div className="relative z-10" style={{ padding: "20px" }}>
        {/* Fun Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg mb-4 animate-pulse">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-600 to-blue-600 mb-2">
            Fun English Courses! 🎉
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Choose your adventure and start learning!
          </p>
        </div>

        <div className="allcourses">
          <div className="mb-8">
            <AllCoursesBanner
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
            />
          </div>

          <div className="!p-3">
            {!courses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl shadow-lg p-6 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : courses && courses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 !min-w-[100%]">
                {courses.map((item, index) => {
                  return (
                    <div
                      key={item.course_id}
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
                      onClick={() => {
                        return navigate("/questionsunits/" + item?.course_id);
                      }}
                    >
                      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-transparent group-hover:border-yellow-300 transition-all duration-300">
                        {/* Fun Gradient Header */}
                        <div
                          className={`h-3 bg-gradient-to-r ${getRandomColor(
                            index
                          )}`}
                        ></div>

                        {/* Course Image */}
                        <div className="relative p-4 pb-2">
                          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                            <img
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                              src={item?.course_photo_url}
                              alt={item?.course_name}
                            />
                            {/* Fun Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Fun Badge */}
                            <div className="absolute top-3 right-3">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${getRandomColor(
                                  index
                                )} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse`}
                              >
                                {index + 1}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-4 pt-2">
                          <div className="course-content-body text-center">
                            <h4 className="h-[50px] text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                              {item?.course_name}
                            </h4>

                            {/* Fun Description */}
                            <div className="bg-gradient-to-r flex items-center justify-center from-blue-50 to-blue-50 rounded-2xl p-3 mb-4 h-[70px]">
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {item?.course_content?.length > 80
                                  ? item?.course_content?.substring(0, 80) +
                                    "..."
                                  : item?.course_content ||
                                    "Start your fun learning journey with this amazing course!"}
                              </p>
                            </div>

                            {/* Fun Action Button */}
                            <div className="flex justify-center">
                              <button
                                className={`bg-gradient-to-r ${getRandomColor(
                                  index
                                )} text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 flex items-center space-x-2 border-none`}
                              >
                                <span>🎮</span>
                                <span>Let's Start!</span>
                                <span>🚀</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Fun Bottom Border */}
                        <div
                          className={`h-2 bg-gradient-to-r ${getRandomColor(
                            index
                          )} opacity-50`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                  {/* Sad but cute empty state */}
                  <div className="text-8xl mb-6 animate-bounce">😢</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Oops! No Courses Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Don't worry! New fun courses are coming soon. Check back
                    later for exciting English adventures!
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="text-2xl animate-bounce">🔜</span>
                    <span className="text-2xl animate-bounce delay-100">
                      📚
                    </span>
                    <span className="text-2xl animate-bounce delay-200">
                      ✨
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coursesquestions;
