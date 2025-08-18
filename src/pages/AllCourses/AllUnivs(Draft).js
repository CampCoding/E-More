import React, { useEffect, useState } from "react";
import {
  MdPlayLesson,
  MdSchool,
  MdStar,
  MdLocationOn,
  MdGroups,
  MdEmojiEvents,
  MdBookmark,
  MdArrowBack
} from "react-icons/md";
import { ArrowLeft, Star } from "lucide-react";
import { decryptData } from '../../utils/decrypt';
import { MetaTags, pageMetaTags } from "../../utils/metaTags";

const GradeLevelsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeCourses, setGradeCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [userData, setUserData] = useState(null);

  // Translated labels
  const AR = {
    backToGrades: 'العودة إلى الصفوف',
    availableCourses: 'الدورات المتاحة 📚',
    startLearning: '🎯 ابدأ التعلم',
    subscribeNow: '🔒 اشترك الآن',
    free: 'مجاني',
    premium: 'مميز',
    noCourses: '📚 لا توجد دورات متاحة',
    noCoursesDesc: 'يتم إعداد دورات جديدة لهذا الصف. عد قريبًا!',
    backToGradesBtn: '🔙 العودة إلى الصفوف',
    chooseGrade: '📚 اختر الصف الدراسي',
    chooseGradeDesc: 'حدد صفك الحالي لاستكشاف الدورات المصممة خصيصًا لك!',
    students: 'طالب',
    gradeLevels: 'صف دراسي',
    comingSoon: '🏗️ الصفوف قادمة قريبًا!',
    comingSoonDesc: 'نقوم بإعداد دورات مذهلة لكل صف دراسي. ترقب التحديثات!',
    notifyMe: '📧 أبلغني',
    whySpecial: '🌟 لماذا برامجنا مميزة',
    whySpecialDesc: 'تعلم مناسب للعمر مصمم لكل مرحلة من مراحل تطور طفلك',
    ageAppropriate: 'مناسب للعمر',
    ageAppropriateDesc: 'محتوى مصمم خصيصًا لكل صف دراسي',
    progressive: 'تعلم تدريجي',
    progressiveDesc: 'المهارات تتطور بشكل طبيعي من صف لآخر',
    peerLearning: 'تعلم جماعي',
    peerLearningDesc: 'يتعلم الطلاب مع أقرانهم',
    curriculumAligned: 'متوافق مع المنهج',
    curriculumAlignedDesc: 'يتوافق مع المناهج والمعايير التعليمية',
    ctaTitle: 'هل أنت مستعد لبدء رحلة التعلم حسب الصف الدراسي؟ 🎓',
    ctaDesc: 'اختر صفك الدراسي أعلاه واكتشف الدورات المصممة لمستواك!',
    ctaBtn: '🌟 ابدأ التعلم الآن!',
    academy: 'منصة المستر الفلاح ',
    academyDesc: 'تعلم الإنجليزية حسب الصف الدراسي لجميع الأعمار! 🌍✨',
    popular: 'شائع',
  };

  // Simulated grade data - replace with actual API call
  const mockGrades = [
    {
      university_id: 1,
      university_name: "الصف الأول الابتدائي",
      arabic_name: "الصف الأول الابتدائي",
      image_url: "🌟",
      description: "مقدمة ممتعة لتعلم اللغة الإنجليزية للأطفال الصغار",
      students: "20000+ طفل سعيد",
      rating: 4.9,
      location: "الأعمار 6-7"
    },
    {
      university_id: 2,
      university_name: "الصف الثاني الابتدائي",
      arabic_name: "الصف الثاني الابتدائي",
      image_url: "🎨",
      description: "مغامرات إبداعية لتعلم اللغة الإنجليزية",
      students: "450+ فنان صغير",
      rating: 4.8,
      location: "الأعمار 7-8"
    },
    {
      university_id: 3,
      university_name: "الصف الثالث الابتدائي",
      arabic_name: "الصف الثالث الابتدائي",
      image_url: "📚",
      description: "بناء أساس قوي للغة الإنجليزية",
      students: "600+ محب للقراءة",
      rating: 5.0,
      location: "الأعمار 8-9"
    },
    {
      university_id: 4,
      university_name: "الصف الرابع الابتدائي",
      arabic_name: "الصف الرابع الابتدائي",
      image_url: "🚀",
      description: "تطوير المهارات المتقدمة في اللغة الإنجليزية",
      students: "400+ قائد مستقبلي",
      rating: 4.9,
      location: "الأعمار 9-10"
    },
    {
      university_id: 5,
      university_name: "الصف الخامس الابتدائي",
      arabic_name: "الصف الخامس الابتدائي",
      image_url: "⭐",
      description: "التميز في مهارات التواصل باللغة الإنجليزية",
      students: "350+ طالب متميز",
      rating: 4.7,
      location: "الأعمار 10-11"
    },
    {
      university_id: 6,
      university_name: "الصف السادس الابتدائي",
      arabic_name: "الصف السادس الابتدائي",
      image_url: "🎓",
      description: "الاستعداد للمرحلة الإعدادية بنجاح",
      students: "380+ خريج",
      rating: 4.8,
      location: "الأعمار 11-12"
    },
    {
      university_id: 7,
      university_name: "الصف الأول الإعدادي",
      arabic_name: "الصف الأول الإعدادي",
      image_url: "🔬",
      description: "منهج علمي لتعلم اللغة الإنجليزية",
      students: "300+ مستكشف",
      rating: 4.9,
      location: "الأعمار 12-13"
    },
    {
      university_id: 8,
      university_name: "الصف الثاني الإعدادي",
      arabic_name: "الصف الثاني الإعدادي",
      image_url: "🌍",
      description: "مهارات التواصل باللغة الإنجليزية على المستوى العالمي",
      students: "280+ مواطن عالمي",
      rating: 4.8,
      location: "الأعمار 13-14"
    },
    {
      university_id: 9,
      university_name: "الصف الثالث الإعدادي",
      arabic_name: "الصف الثالث الإعدادي",
      image_url: "🏆",
      description: "التحضير لإتقان اللغة الإنجليزية بشكل متقدم",
      students: "250+ بطل",
      rating: 5.0,
      location: "الأعمار 14-15"
    }
  ];

  const mockCourses = [
    {
      course_id: 1,
      course_name: "مغامرة الحروف الإنجليزية",
      course_content:
        "مقدمة ممتعة للحروف والأصوات الإنجليزية من خلال الألعاب التفاعلية والأنشطة الملونة",
      course_photo_url:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      own: true,
      free: "1"
    },
    {
      course_id: 2,
      course_name: "بناء المفردات الممتعة",
      course_content:
        "تعلم كلمات إنجليزية جديدة من خلال القصص والأغاني والأنشطة الشيقة المصممة للعقول الصغيرة",
      course_photo_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      own: false,
      free: "0"
    },
    {
      course_id: 3,
      course_name: "ألعاب القواعد",
      course_content:
        "إتقان قواعد اللغة الإنجليزية من خلال الألعاب والتمارين التفاعلية الممتعة",
      course_photo_url:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      own: true,
      free: "1"
    },
    {
      course_id: 4,
      course_name: "الثقة في التحدث",
      course_content:
        "بناء الثقة في التحدث باللغة الإنجليزية من خلال جلسات تدريبية وأنشطة محادثة ممتعة",
      course_photo_url:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop",
      own: false,
      free: "0"
    },
    {
      course_id: 5,
      course_name: "مغامرات القراءة",
      course_content:
        "استكشاف قصص مشوقة وتحسين مهارات القراءة من خلال أدب إنجليزي مناسب للأعمار",
      course_photo_url:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      own: true,
      free: "1"
    },
    {
      course_id: 6,
      course_name: "ورشة الكتابة",
      course_content:
        "تعلم كتابة جمل وقصص إنجليزية جميلة من خلال تمارين كتابة إبداعية",
      course_photo_url:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      own: false,
      free: "0"
    }
  ];
  

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
    setPageLoading(true);
    setTimeout(() => {
      setCourses(mockGrades);
      setPageLoading(false);
    }, 1000);
  }, []);

  const handleGradeClick = (gradeId) => {
    setSelectedGrade(gradeId);
    setCoursesLoading(true);

    setTimeout(() => {
      setGradeCourses(mockCourses);
      setCoursesLoading(false);
    }, 800);

    // Uncomment for real API call:
    
    const data_send = {
      student_id: userData?.student_id,
      token_value: userData?.token_value,
      university_id: gradeId
    };
    
    fetch(base_url + "/user/courses/get_courses.php", {
      method: 'POST',
      body: JSON.stringify(data_send),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((res) => {
        if (res.status == "success") {
          setGradeCourses(res.message);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setCoursesLoading(false);
      });
    
  };

  const handleCourseClick = (course) => {
    if (course?.own || course?.free == "1") {
      console.log("Navigate to course content:", course.course_id);
      // navigate("/CourseContent?course_id=" + course?.course_id);
    } else {
      console.log("Navigate to subscription page");
      // navigate("/supscripe", { state: { course: course } });
    }
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setGradeCourses([]);
  };

  if (selectedGrade) {
    const currentGrade = courses.find((g) => g.university_id === selectedGrade);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50" style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}>

        {/* Course Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 py-12">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-5 left-5 w-64 h-64 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute bottom-5 right-5 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBackToGrades}
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-black hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm shadow-lg mb-6 group border-none"
              style={{ flexDirection: 'row-reverse', gap: 8 }}
            >
              <ArrowLeft
                className="ml-2 text-xl transform group-hover:-translate-x-1 transition-transform duration-300 text-[black]"
                color="black"
              />
              <span className="font-medium">{AR.backToGrades}</span>
            </button>

            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-90 rounded-full text-blue-600 text-lg font-bold mb-4 backdrop-blur-sm shadow-lg">
                <span className="text-2xl ml-2">{currentGrade?.image_url}</span>
                {currentGrade?.arabic_name}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {currentGrade?.university_name}
                <span className="block text-2xl md:text-3xl text-yellow-300 mt-2">
                  {AR.availableCourses}
                </span>
              </h1>

              <p className="text-lg text-white opacity-95 max-w-2xl mx-auto">
                {currentGrade?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {coursesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-6 shadow-lg animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : gradeCourses && gradeCourses?.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gradeCourses.map((course, index) => {
                  const isHovered = hoveredCourse === course.course_id;
                  const colors = [
                    "from-pink-400 to-rose-400",
                    "from-blue-400 to-indigo-400",
                    "from-blue-400 to-cyan-400",
                    "from-green-400 to-emerald-400",
                    "from-yellow-400 to-orange-400",
                    "from-indigo-400 to-blue-400"
                  ];
                  const cardColor = colors[index % colors.length];

                  return (
                    <div
                      key={course.course_id}
                      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border-2 border-blue-100 hover:border-blue-300 overflow-hidden ${
                        isHovered ? 'scale-105' : ''
                      }`}
                      onClick={() => (window.location.href = "/CourseContent")}
                      onMouseEnter={() => setHoveredCourse(course.course_id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
                    >
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-3xl">
                        <img
                          src={course.course_photo_url}
                          alt={course.course_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${cardColor} opacity-80 group-hover:opacity-60 transition-opacity duration-300`}
                        ></div>

                        {/* Course Status Badge */}
                        <div className="absolute top-4 left-4">
                          {course?.own || course?.free == "1" ? (
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                              ✓ {AR.free}
                            </div>
                          ) : (
                            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                              ⭐ {AR.premium}
                            </div>
                          )}
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <MdPlayLesson className="text-3xl text-blue-600" />
                          </div>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 text-right">
                          {course.course_name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-right">
                          {course.course_content?.length > 100
                            ? course.course_content?.substring(0, 100) + "..."
                            : course.course_content}
                        </p>

                        {/* Action Button */}
                        <div
                          className={`w-full py-3 px-6 bg-gradient-to-r ${cardColor} text-white rounded-2xl font-bold text-center transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105`}
                          style={{ marginTop: 12 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {course?.own || course?.free == "1"
                              ? AR.startLearning
                              : AR.subscribeNow}
                            <MdPlayLesson className="ml-2" />
                          </span>
                        </div>
                      </div>

                      {/* Floating Background Elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 opacity-30 rounded-full blur-xl transform -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-100 opacity-40 rounded-full blur-lg transform translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto border-2 border-blue-100">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MdPlayLesson className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {AR.noCourses}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {AR.noCoursesDesc}
                  </p>
                  <button
                    onClick={handleBackToGrades}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300"
                  >
                    {AR.backToGradesBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <MetaTags {...pageMetaTags.courses} />
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50" style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-400 via-pink-400 to-orange-400 py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-90 rounded-full text-blue-600 text-lg font-bold mb-6 backdrop-blur-sm shadow-lg">
            <Star className="ml-2 text-yellow-500" color="black" />
            {AR.academy}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            اختر
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              صفك الدراسي! 🎓
            </span>
          </h1>

          <p className="text-xl text-white opacity-95 max-w-3xl mx-auto mb-8 leading-relaxed">
            من الصف الابتدائي حتى الإعدادي، كل صف يقدم برامج إنجليزية مصممة خصيصًا لمستوى طفلك وقدراته! ✨
          </p>

          <div className="flex justify-center items-center space-x-8 text-white opacity-90" style={{ flexDirection: 'row-reverse', gap: 32 }}>
            <div className="flex items-center">
              <MdGroups className="ml-2 text-2xl" />
              <span className="font-semibold">3000+ {AR.students}</span>
            </div>
            <div className="flex items-center">
              <MdSchool className="ml-2 text-2xl" />
              <span className="font-semibold">9 {AR.gradeLevels}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Levels Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {AR.chooseGrade}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {AR.chooseGradeDesc}
            </p>
          </div>

          {pageLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg animate-pulse"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : courses && courses?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((grade, index) => {
                const isHovered = hoveredCard === grade.university_id;
                const colors = [
                  "from-pink-400 to-rose-400",
                  "from-blue-400 to-indigo-400",
                  "from-blue-400 to-cyan-400",
                  "from-green-400 to-emerald-400",
                  "from-yellow-400 to-orange-400",
                  "from-indigo-400 to-blue-400",
                  "from-red-400 to-pink-400",
                  "from-cyan-400 to-blue-400",
                  "from-orange-400 to-red-400"
                ];
                const cardColor = colors[index % colors.length];

                return (
                  <div
                    key={grade.university_id}
                    className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border-2 border-blue-100 hover:border-blue-300 overflow-hidden ${
                      isHovered ? 'scale-105' : ''
                    }`}
                    onClick={() => handleGradeClick(grade.university_id)}
                    onMouseEnter={() => setHoveredCard(grade.university_id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
                  >
                    {/* Floating Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 opacity-30 rounded-full blur-2xl transform -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 opacity-40 rounded-full blur-xl transform translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>

                    <div className="relative z-10 p-8">
                      {/* Grade Icon */}
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${cardColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <span className="text-3xl">{grade.image_url}</span>
                      </div>

                      {/* Grade Info */}
                      <div className="mb-6">
                        <p className="text-lg font-semibold text-blue-600 mb-3 text-right">
                          {grade.arabic_name}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-500">
                            <MdGroups className="ml-2 text-blue-500" />
                            <span className="text-sm font-medium">{grade.students}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MdLocationOn className="ml-2 text-pink-500" />
                            <span className="text-sm font-medium">{grade.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div
                        className={`w-full py-3 px-6 bg-gradient-to-r ${cardColor} text-white rounded-2xl font-bold text-center transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105`}
                        style={{ marginTop: 12 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          🚀 {AR.startLearning}
                          <MdPlayLesson className="ml-2" />
                        </span>
                      </div>

                      {/* Special Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          <MdEmojiEvents className="ml-1" />
                          {AR.popular}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto border-2 border-blue-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdSchool className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {AR.comingSoon}
                </h3>
                <p className="text-gray-600 mb-6">
                  {AR.comingSoonDesc}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300">
                  {AR.notifyMe}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {AR.whySpecial}
            </h2>
            <p className="text-xl text-gray-600">
              {AR.whySpecialDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MdSchool,
                title: AR.ageAppropriate,
                desc: AR.ageAppropriateDesc,
                color: "from-blue-400 to-cyan-400"
              },
              {
                icon: MdStar,
                title: AR.progressive,
                desc: AR.progressiveDesc,
                color: "from-blue-400 to-pink-400"
              },
              {
                icon: MdGroups,
                title: AR.peerLearning,
                desc: AR.peerLearningDesc,
                color: "from-green-400 to-emerald-400"
              },
              {
                icon: MdBookmark,
                title: AR.curriculumAligned,
                desc: AR.curriculumAlignedDesc,
                color: "from-orange-400 to-red-400"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
                style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {AR.ctaTitle}
          </h2>
          <p className="text-lg text-white opacity-95 mb-8 max-w-2xl mx-auto">
            {AR.ctaDesc}
          </p>

          <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl border-none">
            {AR.ctaBtn}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-gray-800 text-center">
        <div className="flex justify-center items-center mb-4">
          <MdStar className="text-yellow-400 text-2xl ml-2" />
          <span className="text-white text-xl font-bold">
            {AR.academy}
          </span>
        </div>
        <p className="text-gray-400">
          {AR.academyDesc}
        </p>
      </div>
    </div></>
  );
};

export default GradeLevelsPage;
