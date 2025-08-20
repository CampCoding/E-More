import React, { useEffect, useState } from "react";
import SEO from "../../components/SEO/SEO";
import "./allcourses.css";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import Footer from "../../components/Footer/Footer";
import Skeleton from "react-loading-skeleton";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";
import { decryptData } from '../../utils/decrypt';

const Unitquestions = () => {
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
        course_id: id
      };
      axios
        .post(
          base_url + "/user/courses/select_course_unit.php",
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

  // ألوان الكروت
  const unitColors = [
    'from-pink-400 to-rose-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-amber-500',
    'from-blue-400 to-violet-500',
    'from-cyan-400 to-blue-500',
    'from-emerald-400 to-green-500',
    'from-orange-400 to-red-500'
  ];

  const getUnitColor = (index) => unitColors[index % unitColors.length];

  // رموز تعبيرية للوحدات
  const unitEmojis = ['📝', '🎯', '🌟', '🎪', '🎨', '🎭', '🎪', '🎨'];
  const getUnitEmoji = (index) => unitEmojis[index % unitEmojis.length];

  return (
    <>
      <SEO title="أسئلة الوحدة" lang="ar" />
      <div className="min-h-screen  bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 relative overflow-hidden">
        {/* خلفية ممتعة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-16 w-12 h-12 bg-yellow-300 rounded-full animate-bounce delay-100 opacity-60"></div>
          <div className="absolute top-32 right-24 w-8 h-8 bg-pink-400 rounded-full animate-bounce delay-300 opacity-60"></div>
          <div className="absolute bottom-32 left-32 w-10 h-10 bg-green-400 rounded-full animate-bounce delay-500 opacity-60"></div>
          <div className="absolute bottom-16 right-16 w-14 h-14 bg-blue-400 rounded-full animate-bounce delay-700 opacity-60"></div>

          <div className="absolute top-24 left-1/4 text-5xl animate-pulse opacity-40">
            🎈
          </div>
          <div className="absolute top-40 right-1/3 text-4xl animate-pulse delay-200 opacity-40">
            🎊
          </div>
          <div className="absolute bottom-40 left-1/3 text-5xl animate-pulse delay-400 opacity-40">
            🎉
          </div>
          <div className="absolute bottom-24 right-1/4 text-4xl animate-pulse delay-600 opacity-40">
            📋
          </div>
        </div>

        <div className="relative z-10 container">
          {/* العنوان */}
          <div className="text-center py-4 px-4 ">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full shadow-2xl mb-1 animate-pulse">
              <span className="text-4xl">📚</span>
            </div>

            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-600 to-indigo-600 mb-1 leading-tight">
              اختر مغامرتك التعليمية! 🚀
            </h1>

            <div className="max-w-2xl mx-auto mb-1">
              <p className="text-xl text-gray-600 font-medium mb-1">
                كل وحدة هنا رحلة ممتعة أُعدّت خصيصًا لك! 🌟
              </p>
            </div>
          </div>

          <div className=" py-1 px-1">
            {pageLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl shadow-lg p-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses && courses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {courses.map((item, index) => {
                  return (
                    <div
                      key={item.unit_id || index}
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
                      onClick={() => {
                        navigate(
                          "/questionBank/" +
                            item?.unit_id +
                            "?type=unit&course_id=" +
                            id
                        );
                      }}
                    >
                      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-transparent group-hover:border-yellow-300 transition-all duration-300 relative ">
                        {/* الشريط الملون */}
                        <div
                          className={`h-4 bg-gradient-to-r ${getUnitColor(
                            index
                          )}`}
                        ></div>

                        {/* المحتوى */}
                        <div className="p-8">
                          <div className="flex items-center justify-between mb-6">
                            {/* رقم الوحدة */}
                            <div
                              className={` w-24 h-24   bg-gradient-to-br ${getUnitColor(
                                index
                              )} rounded-full flex items-center justify-center text-white shadow-lg group-hover:animate-pulse`}
                            >
                              <span className="text-xl text-center font-bold">
                                الوحدة {index + 1}
                              </span>
                            </div>

                            {/* الرمز التعبيري */}
                            <div className="text-4xl animate-bounce group-hover:animate-spin">
                              {getUnitEmoji(index)}
                            </div>
                          </div>

                          {/* عنوان الوحدة */}
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                              {item?.unit_name}
                            </h3>

                            {/* الوصف */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-4 mb-6">
                              <p className="text-gray-600 font-medium">
                                هل أنتم مستعدون لرحلة تعليمية رائعة؟ هيا نبدأ معًا! ✨
                              </p>
                            </div>
                          </div>

                          {/* زر البداية */}
                          <div className="text-center">
                            <button
                              className={`bg-gradient-to-r ${getUnitColor(
                                index
                              )} text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transform transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110 flex items-center gap-3 mx-auto`}
                            >
                              <span className=" text-sm sm:text-lg md:text-xl">🎮</span>
                              <span className="text-sm sm:text-lg md:text-xl">لنبدأ رحلة التعلم الآن!</span>
                              <span className="text-sm sm:text-lg md:text-xl ">🚀</span>
                            </button>
                          </div>
                        </div>

                        {/* الشريط السفلي */}
                        <div
                          className={`h-3 bg-gradient-to-r ${getUnitColor(
                            index
                          )} opacity-70`}
                        ></div>

                        {/* مؤثرات */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute top-4 right-4 text-yellow-400 animate-ping">
                            ✨
                          </div>
                          <div className="absolute bottom-4 left-4 text-pink-400 animate-ping delay-200">
                            💫
                          </div>
                          <div className="absolute top-1/2 left-4 text-blue-400 animate-ping delay-400">
                            ⭐
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-auto border-4 border-orange-200">
                  <div className="text-8xl mb-6 animate-bounce">🤔</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    لا توجد وحدات بعد
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    لا تقلقوا! ستصل وحدات جديدة ممتعة قريبًا جدًا. 🌟
                  </p>
                  <div className="flex justify-center space-x-3 mb-4">
                    <span className="text-3xl animate-bounce">🔜</span>
                    <span className="text-3xl animate-bounce delay-100">
                      📚
                    </span>
                    <span className="text-3xl animate-bounce delay-200">
                      ✨
                    </span>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <p className="text-orange-600 font-medium">
                      ترقّبوا دائمًا للمزيد من المفاجآت! 🚀
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Unitquestions;
