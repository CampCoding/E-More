import React, { useEffect, useState } from "react";
import { MdBook, MdGamepad, MdPlayLesson, MdQuiz, MdSchedule, MdSchool, MdStar, MdTrendingUp } from "react-icons/md";

const CoursesquestionsLanding = () => {
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Auto-cycle through steps
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 7);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: MdBook, title: "أنشئ حسابك", desc: "سجل وأنشئ ملفًا تعليميًا آمنًا لطفلك" },
    { icon: MdSchool, title: "اختر المستوى الدراسي", desc: "حدد الفئة العمرية لطفلك ومستوى مهارته في اللغة الإنجليزية" },
    { icon: MdGamepad, title: "ابدأ دروسًا ممتعة", desc: "استكشف الألعاب التفاعلية والقصص والأنشطة" },
    { icon: MdPlayLesson, title: "تدرب على التحدث", desc: "استخدم تقنية التعرف على الصوت لدينا لممارسة النطق" },
    { icon: MdQuiz, title: "خذ اختبارات ممتعة", desc: "اختبر معلوماتك مع ألعاب مصغرة ملونة وجذابة" },
    { icon: MdTrendingUp, title: "تتبع التقدم", desc: "شاهد تحسن طفلك من خلال مخططات التقدم المرئية" },
    { icon: MdStar, title: "اكسب المكافآت", desc: "اجمع النجوم والشارات وافتح مغامرات جديدة" }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-400 via-red-400 to-orange-400">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300 opacity-20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-90 rounded-full text-lg font-bold mb-8 backdrop-blur-sm shadow-lg ">
              <MdStar className="ml-2 text-yellow-500" />
              المستر الفلاح الإنجليزية
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              تعلم إنجليزي ممتع
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                للأطفال!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white opacity-95 max-w-3xl mx-auto mb-10 leading-relaxed">
              انضم إلى آلاف الأطفال في مغامرة تعلم اللغة الإنجليزية المثيرة! ألعاب تفاعلية ودروس ملونة وقصص سحرية في انتظارك! ✨🌟
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/signup"
                className= "group no-underline relative px-8 py-4 bg-white text-black-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="relative z-10 flex items-center">
                  🚀 ابدأ التعلم الآن!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              
              <button className= "flex items-center group no-underline relative px-8 py-4 bg-white text-black-600 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl border-none">
                <MdPlayLesson className="ml-2 text-xl" />
                🎬 شاهد العرض التوضيحي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50 ألف+", label: "طفل سعيد يتعلم", color: "text-red-500", emoji: "😊" },
              { number: "98%", label: "تقييم المتعة", color: "text-green-500", emoji: "⭐" },
              { number: "100+", label: "لعبة تفاعلية", color: "text-blue-500", emoji: "🎮" },
              { number: "24/7", label: "تعلم آمن", color: "text-blue-500", emoji: "🛡️" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive How-to Section */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              رحلة طفلك الإنجليزية في
              <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent"> 7 خطوات ممتعة! 📋</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              شاهد طفلك الصغير يصبح نجمًا في اللغة الإنجليزية مع مغامرتنا التعليمية السحرية!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Steps List */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                const emojis = ["🎨", "📚", "🎮", "🗣️", "🧩", "📈", "🏆"];
                
                return (
                  <div
                    key={index}
                    className= {`group cursor-pointer p-6 rounded-2xl transition-all duration-500 transform text-[black] ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-red-500 text-white scale-105 shadow-2xl' 
                        : 'bg-white hover:bg-blue-50 text-gray-700 hover:scale-102 shadow-lg border-2 border-blue-100'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-[black] ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-blue-100'
                      }`}>
                        <Icon className={`text-xl ${isActive ? 'text-black' : 'text-black'}`} color="black"/>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ml-3 ${
                            isActive ? 'bg-white bg-opacity-20 text-[black]' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {emojis[index]} خطوة {index + 1}
                          </span>
                          <h3 className="text-lg font-bold">{step.title}</h3>
                        </div>
                        <p className={`${isActive ? 'text-white opacity-90' : 'text-gray-600'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-500 to-red-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl animate-bounce"></div>
                
                <div className="relative z-10 text-center text-white">
                  <div className= "w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[black]">
                    {React.createElement(steps[activeStep].icon, { className: "text-4xl !text-[black]" })}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{steps[activeStep].title}</h3>
                  <p className="text-lg opacity-90 mb-6">{steps[activeStep].desc}</p>
                  <div className="flex justify-center space-x-2 space-x-reverse">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeStep ? 'bg-white' : 'bg-white bg-opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا يحب الأطفال المستر الفلاح! 💝
            </h2>
            <p className="text-xl text-gray-600">
              تعلم اللغة الإنجليزية آمن وممتع وفعال مصمم خصيصًا للأطفال
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MdGamepad,
                title: "🎮 ألعاب تفاعلية",
                desc: "تعلم اللغة الإنجليزية من خلال الألعاب المثيرة والألغاز والمغامرات التي تبقي الأطفال منخرطين",
                color: "from-blue-400 to-cyan-400"
              },
              {
                icon: MdTrendingUp,
                title: "📊 تتبع التقدم",
                desc: "يمكن للآباء مراقبة رحلة تعلم أطفالهم بتقارير مفصلة وسهلة الفهم",
                color: "from-green-400 to-emerald-400"
              },
              {
                icon: MdSchedule,
                title: "⏰ تعلم مرن",
                desc: "ادرس في أي وقت وفي أي مكان! مثالي للعائلات المشغولة بجداول زمنية مرنة",
                color: "from-blue-400 to-red-400"
              },
              {
                icon: MdStar,
                title: "🏆 نظام المكافآت",
                desc: "اكسب النجوم والشارات وافتح مستويات جديدة للحفاظ على التحفيز العالي والتعلم الممتع",
                color: "from-orange-400 to-red-400"
              },
              {
                icon: MdBook,
                title: "📚 مغامرات القصص",
                desc: "قصص وشخصيات سحرية تجعل تعلم اللغة الإنجليزية وكأنه قراءة حكايات خرافية",
                color: "from-yellow-400 to-orange-400"
              },
              {
                icon: MdSchool,
                title: "👨‍🏫 تدريس مناسب للأطفال",
                desc: "دروس مصممة من قبل خبراء تعليم الأطفال باستخدام طرق تدريس مثبتة",
                color: "from-indigo-400 to-blue-400"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 `}>
                  <feature.icon className="text-2xl text-white" color="black"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Groups Section */}
      <div className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              مثالي لكل الأعمار! 🎂
            </h2>
            <p className="text-xl text-gray-600">
              برامج مصممة خصيصًا لمختلف الفئات العمرية ومستويات المهارة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                age: "3-6 سنوات",
                title: "المستكشفون الصغار 🐣",
                desc: "الكلمات الأساسية والألوان والأشكال والعبارات البسيطة من خلال الأغاني والألعاب",
                color: "from-red-400 to-rose-400",
                features: ["🎵 أغاني تعليمية", "🎨 ألعاب تلوين", "🧸 أصدقاء شخصيات"]
              },
              {
                age: "7-10 سنوات",
                title: "المغامرون الصغار 🌟",
                desc: "القراءة والكتابة وأساسيات القواعد ورواية القصص في بيئة ممتعة",
                color: "from-blue-400 to-indigo-400",
                features: ["📖 قراءة القصص", "✏️ ممارسة الكتابة", "🎭 لعب الأدوار"]
              },
              {
                age: "11-14 سنة",
                title: "أبطال المستقبل 🚀",
                desc: "قواعد متقدمة ومهارات محادثة واستخدام اللغة الإنجليزية في العالم الحقيقي",
                color: "from-blue-400 to-cyan-400",
                features: ["💬 نادي المحادثة", "📝 كتابة المقالات", "🌍 مواضيع من العالم الحقيقي"]
              }
            ].map((group, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${group.color} rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className= "text-sm font-bold bg-white bg-opacity-20 px-4 py-2 rounded-full inline-block mb-4  text-[black]">
                    {group.age}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{group.title}</h3>
                  <p className="text-white opacity-90 mb-6">{group.desc}</p>
                  <div className="space-y-2">
                    {group.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-white rounded-full ml-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <MdStar className="text-yellow-400 text-3xl ml-3" />
              <h3 className="text-2xl font-bold text-white">المستر الفلاح الإنجليزية</h3>
            </div>
            <p className="text-gray-400 mb-4">
              جعل تعلم اللغة الإنجليزية سحريًا للأطفال في جميع أنحاء العالم! 🌍✨
            </p>
            <div className="flex justify-center space-x-6 space-x-reverse text-gray-400 flex-wrap gap-y-4">
              <span>📧 hello@MR.El-Fallah .com</span>
              <span>📞 1-800-MR.El-Fallah </span>
              <span>🌐 www.MR.El-Fallah .com</span>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              &copy; 2024 المستر الفلاح الإنجليزية. نجعل التعلم ممتعًا منذ 2020! 🎉
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .text-5xl {
            font-size: 2.5rem; /* 40px */
          }
          .md\\:text-7xl {
            font-size: 3.5rem; /* 56px */
          }
          .text-4xl {
             font-size: 2rem; /* 32px */
          }
           .md\\:text-5xl {
             font-size: 2.5rem; /* 40px */
           }
          .lg\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesquestionsLanding;