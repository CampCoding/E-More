import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  ArrowRight,
  Star,
  Play,
  Sparkles,
  Heart,
  ArrowLeft
} from "lucide-react";

const KidsExamsLanding = () => {
  const [exams, setExams] = useState([]);

  // Mock navigate function for demonstration
  const navigate = (path, options) => {
    window.location.href = path;
  };

  // Kid-friendly exam data in Arabic
  const funExams = [
    {
      exam_id: 1,
      exam_name: "اختبار أصدقاء الحيوانات",
      exam_description: "تعرف على حيواناتك المفضلة وكيف تعيش!",
      exam_time: 15,
      end_date: "2025-07-15",
      difficulty: "سهل",
      emoji: "🐾",
      bgPattern: "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400"
    },
    {
      exam_id: 2,
      exam_name: "مغامرة الفضاء",
      exam_description:
        "انطلق لتتعلم عن الكواكب والنجوم ورواد الفضاء!",
      exam_time: 20,
      end_date: "2025-07-20",
      difficulty: "متوسط",
      emoji: "🚀",
      bgPattern: "bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-500"
    },
    {
      exam_id: 3,
      exam_name: "مستكشف الطبيعة",
      exam_description: "استكشف الأشجار والزهور والحشرات!",
      exam_time: 12,
      end_date: "2025-07-25",
      difficulty: "سهل",
      emoji: "🌳",
      bgPattern: "bg-gradient-to-br from-pink-400 via-rose-400 to-red-400"
    },
    {
      exam_id: 4,
      exam_name: "مرح مع الأرقام",
      exam_description: "العب مع الأرقام والأشكال!",
      exam_time: 18,
      end_date: "2025-07-30",
      difficulty: "متوسط",
      emoji: "🔢",
      bgPattern: "bg-gradient-to-br from-amber-400 via-orange-400 to-red-400"
    }
  ];

  useEffect(() => {
    setExams(funExams);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'سهل':
        return 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg';
      case 'متوسط':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg';
      case 'صعب':
        return 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-lg';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 relative overflow-hidden" style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}>
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-15 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-blue-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white py-16 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5 animate-bounce"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-6xl font-black mb-6 drop-shadow-lg">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              اختبارات ممتعة
            </span>
            <br />
            <span className="text-white">للتعلم!</span>
          </h1>
          <p className="text-2xl opacity-90 font-medium drop-shadow-md">
            ✨ اختبر معلوماتك عن الحيوانات، الفضاء، الطبيعة، والأرقام! ✨
          </p>

          {/* Floating stats */}
          <div className="flex justify-center items-center gap-8 mt-8" style={{ flexDirection: 'row-reverse' }}>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border-2 border-white/30">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-200" />
                <span className="font-bold">1000+ طفل سعيد</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border-2 border-white/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span className="font-bold">ممتع جدًا!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* How It Works Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-16 border border-white/50 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-transparent rounded-tr-full"></div>

          <div className="relative text-center mb-10">
            <div className="text-6xl mb-4 animate-pulse">🧠</div>
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                كيف تعمل!
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-6 mb-4 inline-block shadow-lg group-hover:animate-bounce">
                <Play className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-800">
                سهل اللعب
              </h4>
              <p className="text-gray-600">اضغط على الإجابة الصحيحة! 🎯</p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-6 mb-4 inline-block shadow-lg group-hover:animate-bounce">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-800">لا تتسرع!</h4>
              <p className="text-gray-600">خذ وقتك في التفكير! ⏰</p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full p-6 mb-4 inline-block shadow-lg group-hover:animate-bounce">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-800">
                احصل على نجوم!
              </h4>
              <p className="text-gray-600">اجمع النجوم اللامعة! ⭐</p>
            </div>
          </div>
        </div>

        {/* Available Quizzes Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="text-7xl mb-4 animate-pulse">🎮</div>
            <h2 className="text-5xl font-black text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                اختر مغامرتك!
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-xl">
              اختر أي موضوع سحري يعجبك! ✨
            </p>
          </div>

          {/* Exams Grid */}
          {exams && exams.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam, index) => (
                <div
                  key={exam.exam_id}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border-2 border-white/50 hover:border-white/80 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden"
                  onClick={() => {
                    navigate(`/examQuestion/${exam.exam_id}`, {
                      state: {
                        timer: exam.exam_time
                      }
                    });
                  }}
                  style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/20 rounded-tr-full"></div>

                  {/* Card Header */}
                  <div className={`${exam.bgPattern} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex justify-between items-start mb-4" style={{ flexDirection: 'row-reverse' }}>
                      <div className="text-5xl animate-bounce group-hover:animate-pulse">
                        {exam.emoji}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(exam.difficulty)} transform rotate-3 group-hover:rotate-6 transition-transform`}>
                        {exam.difficulty}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 drop-shadow-lg group-hover:animate-pulse text-right">
                      {exam.exam_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm font-medium" style={{ flexDirection: 'row-reverse' }}>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                        <Clock className="w-4 h-4" />
                        <span>{exam.exam_time} دقيقة</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 relative">
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed text-right">
                      {exam.exam_description}
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-between py-3 px-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200" style={{ flexDirection: 'row' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-gray-700">الوقت</span>
                        </div>
                        <span className="text-blue-600 font-bold text-lg">
                          {exam.exam_time/60} دقيقة
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 px-5 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl border-2 border-blue-200" style={{ flexDirection: 'row' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-gray-700">
                            متاح حتى
                          </span>
                        </div>
                        <span className="text-blue-600 font-bold text-lg">
                          {exam.end_date}
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 hover:from-indigo-600 hover:via-blue-600 hover:to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group-hover:animate-pulse border-none">
                      <div className="flex items-center justify-center gap-3" style={{ flexDirection: 'row' }}>
                        <Star className="w-6 h-6 group-hover:animate-spin" />
                        <span>ابدأ الاختبار السحري!</span>
                        <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/50 shadow-2xl">
              <div className="text-8xl mb-6 animate-bounce">🎈</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                لا توجد اختبارات بعد!
              </h3>
              <p className="text-gray-600 text-lg">
                اطلب من أحد الكبار مساعدتك في الحصول على المزيد من الاختبارات الممتعة!
              </p>
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-12 text-center text-white shadow-2xl border-2 border-white/30 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>

          <div className="relative">
            <div className="text-8xl mb-6 animate-bounce">🌟</div>
            <h2 className="text-4xl font-black mb-6 drop-shadow-lg">
              هل تريد المزيد من الاختبارات الممتعة؟
            </h2>
            <p className="text-xl opacity-90 mb-8 font-medium drop-shadow-md">
              اطلب من أحد الكبار مساعدتك في الحصول على المزيد من الاختبارات الرائعة! 🎊
            </p>

            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-orange-500 px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-gray-100 transform hover:scale-110 shadow-2xl hover:shadow-3xl border-2 border-white/50 group"
            >
              <div className="flex items-center justify-center gap-3" style={{ flexDirection: 'row-reverse' }}>
                <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                <span>احصل على المزيد من الاختبارات!</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsExamsLanding;
