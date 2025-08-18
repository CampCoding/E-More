import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MdPlayLesson, MdStar, MdAccessTime, MdPeople } from "react-icons/md";
import { getCourses } from "../../AllCourses/functions/getAll";
import logo from "../../../assets/logo/medLearningHub.png";
import {
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Users,
  Clock,
  Play
} from "lucide-react";
import { decryptData } from '../../../utils/decrypt';

const Courses = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState([{}]);
  const [selectedType, setSelectedType] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const coursesTypesData = [{ id: 0, name: "كل الدورات" }];

  const getCoursesType = useCallback(() => {
    setSelectedType(coursesTypesData[0].id);
  }, []);

  const filterCourses = useCallback(() => {
    if (selectedType === 0) {
      setCoursesData(originalCourses);
    } else {
      setCoursesData(
        originalCourses.filter((item) => item.type_id === selectedType)
      );
    }
  }, [selectedType, originalCourses]);

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
    getCourses(
      decryptedUserData,
      setPageLoading,
      setCoursesData,
      setOriginalCourses,
      null,
      "home"
    );
    getCoursesType();
  }, [getCoursesType]);

  useEffect(() => {
    if (selectedType !== "") {
      filterCourses();
    }
  }, [selectedType, filterCourses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const SkeletonCard = () => (
    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded-full w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded-full w-2/3"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-gray-300 rounded-full w-20"></div>
          <div className="h-10 bg-gray-300 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-blue-200/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tl from-pink-200/30 to-orange-200/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Header Section */}
        {coursesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-blue-600 ml-2" />
              <span className="text-blue-800 font-medium text-sm">
                تجربة تعليمية متميزة
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              دورات مجانية
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              اكتشف دورات عالمية المستوى مصممة لتغيير رحلتك التعليمية وإطلاق
              العنان لإمكانياتك
            </p>
          </motion.div>
        )}

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
        >
          {pageLoading ? (
            Array(6)
              .fill()
              .map((_, index) => (
                <motion.div key={index} variants={cardVariants}>
                  <SkeletonCard />
                </motion.div>
              ))
          ) : coursesData.length > 0 ? (
            coursesData
              ?.filter((item) => item?.free === "1")
              ?.map((item, index) => (
                <motion.div
                  key={item.course_id}
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/20"
                  onClick={() => {
                    navigate(
                      item?.free === "1"
                        ? `/CourseContent?course_id=${item?.course_id}`
                        : "/supscripe",
                      { state: { course: item } }
                    );
                  }}
                >
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item?.course_photo_url || logo}
                      alt={item?.course_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Free Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        مجاني
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    <AnimatePresence>
                      {hoveredCard === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                            <Play
                              className="w-8 h-8 text-blue-600"
                              fill="black"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item?.course_name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {item?.course_content?.length > 100
                        ? item?.course_content?.substring(0, 100) + "..."
                        : item?.course_content}
                    </p>

                 

                    <motion.div
                      initial={{ x: 10, opacity: 0 }}
                      animate={{
                        x: hoveredCard === index ? 0 : 10,
                        opacity: hoveredCard === index ? 1 : 0
                      }}
                      
                      className="flex items-center mt-4 text-blue-600 font-semibold"
                    >
                      <span className="ml-2">ابدأ التعلم</span>
                      <ArrowRight className="w-4 h-4" color="black" />
                    </motion.div>
                  </div>
                </motion.div>
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-full p-8 mb-6">
                <BookOpen className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                لا توجد دورات متاحة
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                نحن نعمل بجد لنقدم لكم دورات مذهلة. عد قريبا للتحقق من
                التحديثات!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Call-to-Action Section */}
        {coursesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 ml-3" />
                  <h2 className="text-3xl font-bold">
                    هل أنت مستعد لبدء التعلم؟
                  </h2>
                </div>

                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  انضم إلى آلاف الطلاب الذين يغيرون حياتهم المهنية بالفعل من
                  خلال دوراتنا الشاملة
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/allcourses")}
                  className= "border-none inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg group"
                >
                  <span>استكشف جميع الدورات</span>
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="mr-3 w-6 h-6 group-hover:-translate-x-1 transition-transform" color="black"/>
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
