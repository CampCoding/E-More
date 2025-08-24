import React, { useState } from "react";
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

  const funWords = [
    { word: "مغامرة", icon: "🏰" },
    { word: "سحر", icon: "✨" },
    { word: "أصدقاء", icon: "👫" },
    { word: "قصص", icon: "📚" },
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
    >
      {/* Floating Decorative Elements */}
      <div className="!absolute !top-5 !right-[10%] !w-5 !h-5 !bg-yellow-400 !rounded-full !animate-bounce"></div>
      <div
        className="!absolute !top-16 !left-[15%] !w-4 !h-4 !bg-pink-400 !rounded-full !animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="!absolute !bottom-10 !right-[20%] !w-5 !h-5 !bg-green-400 !rounded-full !animate-bounce"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="!max-w-6xl !mx-auto !px-5">
        {/* Header */}
        {/* <div className="!text-center !mb-16">
          <div className="!inline-block !bg-orange-50 !text-orange-600 !px-5 !py-2 !rounded-full !text-sm !font-semibold !uppercase !tracking-wide !mb-5">
            🌟 تعلم اللغة الإنجليزية للأطفال
          </div>

          <h2 className="!text-5xl lg:!text-6xl !font-black !bg-gradient-to-r !from-purple-600 !via-pink-500 !to-blue-500 !bg-clip-text !text-transparent !mb-5 !leading-tight">
            مغامرة المستر الفلاح الإنجليزية! 🚀
          </h2>

          <p className="!text-xl !text-gray-600 !max-w-2xl !mx-auto !leading-relaxed">
            حيث تعلم اللغة الإنجليزية مثير مثل لعبتك المفضلة! انضم إلى رحلات سحرية عبر الكلمات والقصص! ✨
          </p>
        </div> */}

        {/* Main Content Grid */}
        <div className="!grid lg:!grid-cols-2 !gap-16 !items-center">
          {/* Left Column - Teacher Info */}
          <div className="!relative">
            {/* Teacher Card */}
            <div>
              <div className=" text-3xl md:!text-[4.5rem] !leading-[100px] !font-bold !text-gray-800 !mb-8 !flex !items-center  ">
                {/* <Heart className="!text-pink-500 !ml-3 " /> */}
                لماذا يحب الأطفال التعلم مع المستر الفلاح؟
              </div>
            </div>

            {/* Floating badge */}
            {/* <div className="!absolute !-top-3 !left-5 !bg-yellow-400 !text-orange-800 !px-4 !py-2 !rounded-full !text-sm !font-bold !shadow-lg !animate-pulse">
              ⭐ أفضل معلم!
            </div> */}
          </div>

          {/* Right Column - Features & Activities */}
          <div className="!flex !flex-col !gap-8">
            {/* Features List */}
            <div>
              {/* <h3 className="!text-4xl !font-bold !text-gray-800 !mb-8 !flex !items-center text-center leading-loose">
                لماذا يحب الأطفال التعلم مع المستر الفلاح؟
              </h3> */}

              <div className="!space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="!flex !items-center !bg-white !p-5 !rounded-2xl !shadow-lg !transition-transform !duration-300 hover:!-translate-y-1"
                  >
                    <feature.icon
                      className={`!w-6 !h-6 !ml-4 ${feature.color}`}
                      color="black"
                    />
                    <span className="!text-lg !font-semibold !text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Magic Words */}
          

            {/* CTA Button */}
            {/* <button
              className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !px-8 !py-4 !rounded-full !text-lg !font-bold !flex !items-center !justify-center !gap-3 !shadow-2xl !transition-all !duration-300 hover:!shadow-3xl hover:!scale-105 !self-start border-none"
              onClick={() => (window.location.href = "/allcourses")}
            >
              ابدأ مغامرتك اليوم! 🌟
              <ArrowRight className="!w-5 !h-5" />
            </button> */}
          </div>
        </div>

        {/* Bottom CTA Section */}
        {/* <div className="!mt-16 !bg-gradient-to-r !from-purple-600 !to-pink-600 !rounded-3xl !p-8 !text-white !text-center">
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
                className="!w-8 !h-8 !text-yellow-300 !fill-current !animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div> */}
      </div>

      {/* Responsive Design */}
      <style jsx>{`
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
