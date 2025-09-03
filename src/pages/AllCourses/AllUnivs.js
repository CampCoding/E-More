import React, { useEffect, useState } from "react";
import {
  MdPlayLesson,
  MdSchool,
  MdStar,
  MdLocationOn,
  MdGroups,
  MdEmojiEvents,
  MdBookmark,
} from "react-icons/md";
import {  Star, Sparkles, Users, GraduationCap, BookOpen, Award, Zap  } from "lucide-react";
import { decryptData } from "../../utils/decrypt";
import { MetaTags, pageMetaTags } from "../../utils/metaTags";
import axios from "axios";
import { base_url } from "../../constants";
import { useNavigate } from "react-router-dom";
import CoursesHero from "./CoursesHero";
import Footer from './../../components/Footer/Footer';

const GradeLevelsPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [userData, setUserData] = useState(null);

  // Translated labels
  const AR = {
    availableCourses: "الدورات المتاحة 📚",
    startLearning: "🎯 ابدأ التعلم",
    subscribeNow: "🔒 اشترك الآن",
    free: "مجاني",
    premium: "مميز",
    noCourses: "📚 لا توجد دورات متاحة",
    noCoursesDesc: "يتم إعداد دورات جديدة. عد قريبًا!",
    students: "طالب",
    academy: "منصة المستر الفلاح ",
    academyDesc: "تعلم الإنجليزية لجميع الأعمار! 🌍✨",
    popular: "شائع",
  };

  const mockCourses = [
    {
      course_id: 1,
      course_name: "مغامرة الحروف الإنجليزية",
      course_content:
        "مقدمة ممتعة للحروف والأصوات الإنجليزية من خلال الألعاب التفاعلية والأنشطة الملونة",
      course_photo_url:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      own: true,
      free: "1",
    },
    {
      course_id: 2,
      course_name: "بناء المفردات الممتعة",
      course_content:
        "تعلم كلمات إنجليزية جديدة من خلال القصص والأغاني والأنشطة الشيقة المصممة للعقول الصغيرة",
      course_photo_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      own: false,
      free: "0",
    },
    {
      course_id: 3,
      course_name: "ألعاب القواعد",
      course_content:
        "إتقان قواعد اللغة الإنجليزية من خلال الألعاب والتمارين التفاعلية الممتعة",
      course_photo_url:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      own: true,
      free: "1",
    },
    {
      course_id: 4,
      course_name: "الثقة في التحدث",
      course_content:
        "بناء الثقة في التحدث باللغة الإنجليزية من خلال جلسات تدريبية وأنشطة محادثة ممتعة",
      course_photo_url:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop",
      own: false,
      free: "0",
    },
    {
      course_id: 5,
      course_name: "مغامرات القراءة",
      course_content:
        "استكشاف قصص مشوقة وتحسين مهارات القراءة من خلال أدب إنجليزي مناسب للأعمار",
      course_photo_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      own: true,
      free: "1",
    },
    {
      course_id: 6,
      course_name: "ورشة الكتابة",
      course_content:
        "تعلم كتابة جمل وقصص إنجليزية جميلة من خلال تمارين كتابة إبداعية",
      course_photo_url:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      own: false,
      free: "0",
    },
  ];

  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);

  const getCourses = async () => {
    setPageLoading(true);
    const response = await axios.post(
      `${base_url}user/courses/select_courses.php`,
      {
        student_id: decryptedUserData?.student_id,
        token_value: decryptedUserData?.token_value,
      }
    );
    console.log(response.data.message);
    if (response.data.status == "success") {
      setCourses(response.data.message);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    getCourses();
    setUserData(decryptedUserData);
  }, []);

  const handleCourseClick = (course) => {
    if (!decryptedUserData?.student_id) {
      return navigate("/login");
    }
    if (course?.own || course?.free == "1") {
      console.log("Navigate to course content:", course.course_id);
      navigate("/CourseContent?course_id=" + course?.course_id);
    } else {
      console.log("Navigate to subscription page");
      navigate("/subscribe", { state: { course: course } });
    }
  };

  return (
    <>
      <MetaTags {...pageMetaTags.courses} />
      <div
        className=" bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50"
        style={{
          direction: "rtl",
          fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif",
        }}
      >
       <EnhancedHero />
        {userData ? ( 
          <div className="py-20 mt-[-30px] !rounded-t-3xl relative shadow-sm overflow-hidden z-40 bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
              {pageLoading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-3xl shadow-lg animate-pulse"
                    >
                      <div className="mb-4 w-full h-48 bg-gray-200 rounded-2xl"></div>
                      <div className="mb-2 h-6 bg-gray-200 rounded"></div>
                      <div className="mb-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : courses && courses?.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course, index) => {
                    const isHovered = hoveredCourse === course.course_id;
                    const colors = [
                      "from-pink-400 to-rose-400",
                      "from-blue-400 to-indigo-400",
                      "from-blue-400 to-cyan-400",
                      "from-green-400 to-emerald-400",
                      "from-yellow-400 to-orange-400",
                      "from-indigo-400 to-blue-400",
                    ];
                    const cardColor = colors[index % colors.length];

                    return (
                      <div
                        key={course.course_id}
                        className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border-2 border-blue-100 hover:border-blue-300 overflow-hidden ${
                          isHovered ? "scale-105" : ""
                        }`}
                        onClick={() => handleCourseClick(course)}
                        onMouseEnter={() => setHoveredCourse(course.course_id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        style={{
                          direction: "rtl",
                          fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif",
                        }}
                      >
                        {/* Course Image */}
                        <div className="overflow-hidden relative h-48 rounded-t-3xl">
                          <img
                            src={course.course_photo_url}
                            alt={course.course_name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t opacity-80 transition-opacity duration-300 ${cardColor} group-hover:opacity-60`}
                          ></div>

                          {/* Course Status Badge */}
                          <div className="absolute top-4 left-4">
                            {course?.free == "1" ? (
                              <div className="flex items-center px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                                ✓ {AR.free}
                              </div>
                            ) : (
                              <div className="flex items-center px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full">
                                ⭐ {AR.premium}
                              </div>
                            )}
                          </div>

                          {/* Play Button Overlay */}
                          <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex justify-center items-center w-16 h-16 bg-white bg-opacity-90 rounded-full shadow-lg transition-transform duration-300 transform scale-75 group-hover:scale-100">
                              <MdPlayLesson className="text-3xl text-blue-600" />
                            </div>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-6">
                          <h3 className="mb-3 text-xl font-bold text-right text-gray-900 transition-colors duration-300 group-hover:text-blue-600 line-clamp-2">
                            {course.course_name}
                          </h3>
                          <p className="mb-4 leading-relaxed text-right text-gray-600 line-clamp-3">
                            {course.course_content?.length > 100
                              ? course.course_content?.substring(0, 100) + "..."
                              : course.course_content}
                          </p>

                          {/* Action Button */}
                          <div
                            className={`px-6 py-3 w-full font-bold text-center text-white bg-gradient-to-r rounded-2xl transition-all duration-300 transform cursor-pointer ${cardColor} group-hover:shadow-lg group-hover:scale-105`}
                            style={{ marginTop: 12 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCourseClick(course);
                            }}
                          >
                            <span className="flex gap-2 justify-center items-center">
                              {course?.own || course?.free == "1"
                                ? AR.startLearning
                                : AR.subscribeNow}
                              <MdPlayLesson className="ml-2" />
                            </span>
                          </div>
                        </div>

                        {/* Floating Background Elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full opacity-30 blur-xl transition-transform duration-500 transform translate-x-10 -translate-y-10 group-hover:scale-150"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-100 rounded-full opacity-40 blur-lg transition-transform duration-500 transform -translate-x-8 translate-y-8 group-hover:scale-125"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="p-12 mx-auto max-w-md bg-white rounded-3xl border-2 border-blue-100 shadow-lg">
                    <div className="flex justify-center items-center mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full">
                      <MdPlayLesson className="text-4xl text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      {AR.noCourses}
                    </h3>
                    <p className="mb-6 text-gray-600">{AR.noCoursesDesc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <CoursesHero />
        )}
        {/* Footer */}
        <div className="mt-[-30px] relative z-40">

       <Footer />
        </div>
      </div>
    </>
  );
};

export default GradeLevelsPage;





const EnhancedHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  


  const AR = {
    academy: "منصة المستر الفلاح ",
    availableCourses: "الدورات المتاحة",
    students: "طالب"
  };

  const floatingElements = [
    { icon: BookOpen, delay: 0, position: 'top-20 left-20' },
    { icon: Award, delay: 0.5, position: 'top-32 right-32' },
    { icon: Zap, delay: 1, position: 'bottom-40 left-40' },
    { icon: Sparkles, delay: 1.5, position: 'bottom-20 right-20' }
  ];

  return (
    <div className="overflow-hidden relative  bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Dynamic gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0.2) 100%)`
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute right-10 top-20 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl animate-bounce" 
             style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} animate-bounce opacity-20`}
          style={{
            animationDelay: `${element.delay}s`,
            animationDuration: '3s'
          }}
        >
          <element.icon className="w-8 h-8 text-white" />
        </div>
      ))}
      
      {/* Main content */}
      <div className="relative flex items-center my-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Academy badge with glassmorphism */}
          <div 
            className="inline-flex items-center px-8 py-4 mb-8 text-lg font-bold text-white bg-white/10 rounded-full shadow-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Star className={`ml-3 text-yellow-400 transition-transform duration-300 ${isHovered ? 'rotate-180 scale-110' : ''}`} />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {AR.academy}
            </span>
            <Sparkles className="mr-3 text-cyan-400" />
          </div>

          {/* Main heading with enhanced typography */}
          <div className="mb-8">
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-8xl lg:text-5l">
              <span className="block bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                {AR.availableCourses}
              </span>

            </h1>
          </div>

          {/* Enhanced description */}
          <p className="mx-auto mb-12 max-w-4xl text-xl md:text-2xl leading-relaxed text-white/90 font-light">
            <span className="bg-gradient-to-r from-cyan-200 to-pink-200 bg-clip-text text-transparent font-medium">
              استكشف مجموعة متنوعة من الدورات المصممة لجميع المستويات والأعمار!
            </span>
            <br />
            <span className="text-lg text-white/70 mt-2 block">
              رحلة تعليمية استثنائية تنتظرك مع أفضل المدربين والتقنيات الحديثة
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

