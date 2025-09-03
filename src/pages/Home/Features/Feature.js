import React, { useEffect, useState } from "react";
import { BookOpen, Users, Star, Gamepad2, Music, Trophy } from "lucide-react";
import { decryptData } from "../../../utils/decrypt";

// Sample features data for English teacher
const featuresData = [
  {
    title: "شرح تفاعلي ",
    des: "شرح المنهج كاملا بطريقة المستر الفلاح الممتعة",
    icon: <BookOpen color="black" />,
    color: "bg-blue-100 border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    title: "تسميع الكلمات المميزة ع كل درس",
    des: "نُرسّخ المفردات بأسلوب تفاعلي ممتع يضمن الحفظ من خلال الألعاب، الألغاز، والأنشطة الشيقة.",
    icon: <Gamepad2 color="black" />,
    color: "bg-blue-100 border-blue-300",
    iconColor: "text-blue-600",
  },
  {
    title: "ألحان وأغاني الفلاح ",
    des: "أغانٍ وقوافي جذابة لإتقان النطق والصوتيات وبناء المفردات بشكل طبيعي.",
    icon: <Music color="black" />,
    color: "bg-green-100 border-green-300",
    iconColor: "text-green-600",
  },
  {
    title: "تقارير دورية لولي الأمر",
    des: "إرسال تقارير دورية لولي الأمر تشمل تقدمه الطفل ومتسواه التعليمي",
    icon: <Users color="black" />,
    color: "bg-orange-100 border-orange-300",
    iconColor: "text-orange-600",
  },
  {
    title: "مكافآت الإنجاز",
    des: "الاحتفال بكل إنجاز بالملصقات والشهادات والتقدير الخاص للتحفيز.",
    icon: <Trophy color="black" />,
    color: "bg-yellow-100 border-yellow-300",
    iconColor: "text-yellow-600",
  },
  {
    title: "إختبارات تفاعلية",
    des: "اختبارات تفاعلية لكل درس ووحدة مع تصحيح تلقائي فوري",
    icon: <Star color="black" />,
    color: "bg-red-100 border-red-300",
    iconColor: "text-red-600",
  },
];

const Feature = () => {
  const [features, setFeatures] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);
  const getFeatures = () => {
    setFeatures(featuresData);
  };

  useEffect(() => {
    getFeatures();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
        overflow: "hidden",
        borderTop: "3px dotted rgb(129, 68, 179)",
      }}
      className=" rounded-t-2xl   bg-gradient-to-br from-blue-50 via-blue-50 to-red-50 py-16 px-4"
    >
      {}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 mb-4">
          🌟 منصة المستر الفلاح التعليمية 🌟
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          حيث تعلم اللغات عندنا مغامرة! انضم إلينا في دروس مليئة بالمرح تثير
          الخيال وتبني الثقة
        </p>
        <div className="flex justify-center mt-8 space-x-4 space-x-reverse">
          <span className="text-4xl animate-bounce">📚</span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            🎨
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            🎵
          </span>
          <span
            className="text-4xl animate-bounce"
            style={{ animationDelay: "0.6s" }}
          >
            ⭐
          </span>
        </div>
      </div>

      {}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className={`
                  ${item.color} 
                  rounded-3xl border-4 p-8 
                  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }
                  cursor-pointer group
                `}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                {}
                <div className="flex justify-center mb-6">
                  <div
                    className={`
                    ${item.iconColor} 
                    bg-white rounded-full p-4 shadow-lg
                    transform transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110
                  `}
                  >
                    {IconComponent}
                  </div>
                </div>

                {}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {item.des}
                  </p>
                </div>

                {}
                <div className="absolute top-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      {/* {decryptedUserData ? (
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border-4 border-yellow-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              هل أنت مستعد لبدء مغامرتك في التعلم ؟ 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              انضم إلى فصولنا المليئة بالمرح حيث يصبح كل طفل متحدثًا واثقًا
              بالعديد من اللغات
            </p>
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-red-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full text-xl hover:shadow-xl transform hover:scale-105 transition-all duration-500 hover:from-blue-600 hover:via-red-600 hover:to-blue-600 group border-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                سجل الآن!
                <span className="transform transition-transform duration-500 group-hover:rotate-12">
                  📋
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-red-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      ) : null} */}

      {}
      <div className="fixed top-20 right-10 text-6xl opacity-20 animate-pulse pointer-events-none">
        🦋
      </div>
      <div
        className="fixed top-40 left-20 text-5xl opacity-20 animate-pulse pointer-events-none "
        style={{ animationDelay: "1s" }}
      >
        🌸
      </div>
      <div
        className="fixed bottom-20 right-20 text-4xl opacity-20 animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        🌟
      </div>
      <div
        className="fixed bottom-40 left-10 text-5xl opacity-20 animate-pulse pointer-events-none"
        style={{ animationDelay: "0.5s" }}
      >
        🎈
      </div>
    </div>
  );
};

export default Feature;
