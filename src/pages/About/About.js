import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Star,
  Heart,
  Smile,
  Award,
  Users,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function EnglishTeacherSection() {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const funWords = [
    { word: "تدريبات تفاعلية", icon: "❓" },
    { word: "كلمات سحرية", icon: "✨" },
    { word: "نهج صبور ورعاية", icon: "👫" },
    { word: " مغامرات ثقافية", icon: "📚" },
  ];

  const features = [
    {
      icon: Smile,
      text: "تعلم ممتع وتفاعلي",
      color: "text-purple-500",
    },
    { icon: Globe, text: "مغامرات ثقافية", color: "text-blue-500" },
    { icon: Heart, text: "نهج صبور ورعاية", color: "text-pink-500" },
  ];

  return (
    <section
      dir="rtl"
      className="!bg-gradient-to-br !from-sky-100 !via-purple-50 !to-pink-100 !py-20 !relative !overflow-hidden"
      style={{
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
        overflow: "hidden",
        borderTop: "3px dotted rgb(129, 68, 179)",
      }}
    >
      {/* Enhanced Floating Decorative Elements */}
      <div className="!absolute !top-5 !right-[10%] !w-5 !h-5 !bg-yellow-400 !rounded-full !animate-bounce !shadow-lg"></div>
      <div
        className="!absolute !top-16 !left-[15%] !w-4 !h-4 !bg-pink-400 !rounded-full !animate-bounce !shadow-lg"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="!absolute !bottom-10 !right-[20%] !w-5 !h-5 !bg-green-400 !rounded-full !animate-bounce !shadow-lg"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="!absolute !top-1/3 !left-[5%] !w-3 !h-3 !bg-blue-400 !rounded-full !animate-pulse !shadow-lg"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="!absolute !bottom-1/4 !left-[10%] !w-4 !h-4 !bg-orange-400 !rounded-full !animate-bounce !shadow-lg"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="!max-w-6xl !mx-auto !px-5">
        {/* Main Content Grid */}
        <div className="!grid lg:!grid-cols-2 !gap-16 !items-center">
          {/* Left Column - Teacher Info & Image */}
          <div className="!relative">
            {/* Teacher Image Container */}
             {/* Title */}
             <div
              className={`!text-3xl md:!text-4xl lg:!text-5xl !leading-tight !font-bold !text-gray-800 !mb-8 !transition-all !duration-1000 !ease-out ${
                isVisible
                  ? "!transform !translate-y-0 !opacity-100"
                  : "!transform !translate-y-10 !opacity-0"
              }`}
              style={{ transitionDelay: "0.4s" }}
            >
              لماذا يحب الأطفال التعلم مع المستر الفلاح؟
            </div>
            <div
              className={`!mb-8 !relative !transition-all !duration-1000 !ease-out ${
                isVisible
                  ? "!transform !translate-y-0 !opacity-100"
                  : "!transform !translate-y-10 !opacity-0"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="!relative !w-full  !bg-gradient-to-br !from-purple-200 !to-pink-200 !rounded-3xl !shadow-2xl !overflow-hidden !border-4 !border-white !transform !transition-transform !duration-300 hover:!scale-105">
                {/* Placeholder for teacher image */}
                <img
                  src="https://res.cloudinary.com/dcs1nwnmm/image/upload/v1756567413/Image_Editor_zcvaf7.png"
                  alt="المستر الفلاح"
                  className="!w-full !h-full !object-cover"
                />

                {/* Animated border effect */}
                <div className="!absolute !inset-0 !border-4 !border-transparent !bg-gradient-to-r !from-purple-400 !via-pink-400 !to-blue-400 !rounded-3xl !opacity-0 hover:!opacity-20 !transition-opacity !duration-300"></div>

                {/* Floating stars around image */}
                <Star
                  className="!absolute !-top-2 !-right-2 !w-6 !h-6 !text-yellow-400 !fill-current !animate-spin !shadow-lg"
                  style={{ animationDuration: "3s" }}
                />
                <Star className="!absolute !-bottom-2 !-left-2 !w-5 !h-5 !text-yellow-300 !fill-current !animate-pulse" />
                <Heart className="!absolute !-top-3 !left-1/4 !w-5 !h-5 !text-pink-400 !fill-current !animate-bounce" />
              </div>
            </div>

           
          </div>

          {/* Right Column - Features & Activities */}
          <div className="!flex !flex-col !gap-8">
            {/* Features List */}
            

            {/* Magic Words Section */}
            <div
              className={`!mt-8 !transition-all !duration-1000 !ease-out ${
                isVisible
                  ? "!transform !translate-y-0 !opacity-100"
                  : "!transform !translate-y-10 !opacity-0"
              }`}
              style={{ transitionDelay: "1.2s" }}
            >
              <h4 className="!text-2xl !font-bold !text-gray-800 !mb-6 !text-center">
                كلمات سحرية نتعلمها معًا ✨
              </h4>
              <div className="!grid !grid-cols-2 !gap-4">
                {funWords.map((item, index) => (
                  <div
                    key={index}
                    className="!bg-gradient-to-r !from-purple-100 !to-pink-100 !p-4 !rounded-xl !text-center !transition-all !duration-300 hover:!scale-110 hover:!shadow-lg !cursor-pointer"
                    onMouseEnter={() => setHoveredWord(index)}
                    onMouseLeave={() => setHoveredWord(null)}
                  >
                    <div
                      className={`!text-3xl !mb-2 !transition-transform !duration-300 ${
                        hoveredWord === index
                          ? "!scale-125 !animate-bounce"
                          : ""
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="!font-semibold !text-gray-700">
                      {item.word}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={`!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !px-8 !py-4 !rounded-full !text-lg !font-bold !flex !items-center !justify-center !gap-3 !shadow-2xl !transition-all !duration-500 hover:!shadow-3xl hover:!scale-105 hover:!from-purple-700 hover:!to-pink-700 !self-start !border-none !cursor-pointer !relative !overflow-hidden ${
                isVisible
                  ? "!transform !translate-y-0 !opacity-100"
                  : "!transform !translate-y-10 !opacity-0"
              }`}
              style={{ transitionDelay: "1.4s" }}
              onClick={() => (window.location.href = "/allcourses")}
              onMouseEnter={(e) => {
                const ripple = document.createElement("div");
                ripple.className =
                  "!absolute !inset-0 !bg-white !opacity-20 !animate-ping !rounded-full";
                e.currentTarget.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }}
            >
              ابدأ مغامرتك اليوم! 🌟
              <ArrowRight className="!w-5 !h-5 !transition-transform !duration-300 hover:!translate-x-1" />
            </button>
          </div>
        </div>

        {/* Bottom Testimonial Section */}
        <div
          className={`!mt-16 !bg-gradient-to-r !from-purple-600 !to-pink-600 !rounded-3xl !p-8 !text-white !text-center !relative !overflow-hidden !transition-all !duration-1000 !ease-out ${
            isVisible
              ? "!transform !translate-y-0 !opacity-100"
              : "!transform !translate-y-10 !opacity-0"
          }`}
          style={{ transitionDelay: "1.6s" }}
        >
          {/* Background pattern */}
          <div className="!absolute !inset-0 !opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="!absolute !w-2 !h-2 !bg-white !rounded-full !animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="!relative !z-10">
            <h3 className="!text-3xl !font-bold !mb-4">
              هل أنت مستعد لمغامرتك في التعلم ؟ 🚀
            </h3>
            <p className="!text-xl !mb-6">
              دعنا نتعلم ونضحك ونستكشف عالم اللغات معًا!
            </p>
            <div className="!flex !justify-center !space-x-2 !space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="!w-8 !h-8 !text-yellow-300 !fill-current !animate-pulse !transition-transform !duration-300 hover:!scale-125"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .lg\\: !grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .!gap-16 {
            gap: 2rem !important;
          }
        }

        @media (max-width: 768px) {
          .!text-5xl {
            font-size: 2.25rem !important;
          }
          .lg\\: !text-6xl {
            font-size: 2.25rem !important;
          }
          .!text-xl {
            font-size: 1.125rem !important;
          }
          .!px-10 {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
