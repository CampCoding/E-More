import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Star,
  Heart,
  Zap,
  Globe,
  Users,
  Play,
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import useGetUserData from "../../../Hooks/ApiHooks/useGetUserData";

// ملاحظات:
// - لا تغيير في الواجهة أو النصوص/الألوان.
// - أضفنا فقط انتقالات محسّنة بين الشرائح + دعم سحب (Swipe) للموبايل.
// - إن كان لديك مكوّن EnhancedBanner خارجي، يظل كما هو. هنا لففناه داخل motion.div فقط.
// - إن لم تكن تستخدمه خارجياً، اتركه كما هو مستخدم في JSX.

const Banner2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const userData = useGetUserData();
  const prefersReducedMotion = useReducedMotion();

  const bannerSlides = [
    {
      title: "مرحبًا بكم في مغامرة المستر الفلاح الإنجليزية!",
      subtitle: "تعلم اللغة الإنجليزية بأسلوب ساحر ومشوق ✨",
      description:
        "انطلق معنا في رحلة تعليمية مليئة بالمرح والمتعة! نقدم  لك ولطلفلك تجربة فريدة تجمع بين الشرح التفاعلي، الأغاني الهادفة، والأجواء الحماسية التي تحول كل درس إلى مغامرة لا تُنسى.",
      emoji: "📋",
      image:
        "https://res.cloudinary.com/dcs1nwnmm/image/upload/v1756563575/WhatsApp_Image_2025-08-28_at_15.03.09_995d0319_vc14yd.jpg",
      color: "from-blue-400 via-pink-400 to-rose-400",
      bgPattern: "from-blue-50 via-pink-50 to-rose-50",
    },
    {
      image:
        "https://res.cloudinary.com/dcs1nwnmm/image/upload/v1756567413/Image_Editor_zcvaf7.png",
      title: "اختبارات تفاعلية وبنوك أسئلة مبتكرة!",
      subtitle: "تسميع الكلمات وتدريب يحاكي ورقة الامتحان 📝",
      description:
        "نقدم اختبارات ممتعة وتقييمات تحاكي الامتحانات الحقيقية، مع طرق ذكية لتسميع الكلمات وتعزيز مهارات الطالب بأسلوب تفاعلي.",
      emoji: "📝",
      color: "from-green-400 via-emerald-400 to-teal-400",
      bgPattern: "from-green-50 via-emerald-50 to-teal-50",
    },
  ];

  const floatingElements = [
    { emoji: "📚", delay: 0, position: "top-10 right-10", duration: "6s" },
    { emoji: "✏️", delay: 1000, position: "top-20 left-20", duration: "8s" },
    {
      emoji: "🌟",
      delay: 2000,
      position: "bottom-20 right-20",
      duration: "7s",
    },
    {
      emoji: "🎨",
      delay: 1500,
      position: "bottom-32 left-16",
      duration: "9s",
    },
    { emoji: "🦋", delay: 500, position: "top-40 right-1/4", duration: "10s" },
    { emoji: "🌸", delay: 2500, position: "top-60 left-1/3", duration: "5s" },
  ];

  // ====== New: Variants للانتقالات ======
  const slideVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.995,
      filter: prefersReducedMotion ? "blur(0px)" : "blur(4px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // easeOutCubic-ish
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -15,
      scale: prefersReducedMotion ? 1 : 0.995,
      filter: prefersReducedMotion ? "blur(0px)" : "blur(4px)",
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 1, 1], // easeIn
      },
    },
  };

  const textStagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const textItem = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // ====== Auto-advance + Mouse parallax ======
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        setIsTransitioning(false);
      }, 200);
    }, 6000);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSlideChange = (index) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 200);
    }
  };

  // ====== New: دعم السحب (Swipe) للموبايل بدون تغيير الواجهة ======
  const startXRef = useRef(null);
  const handlePointerDown = (e) => {
    startXRef.current =
      e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
  };
  const handlePointerUp = (e) => {
    if (startXRef.current == null) return;
    const endX =
      e.changedTouches && e.changedTouches.length
        ? e.changedTouches[0].clientX
        : e.clientX;
    const delta = endX - startXRef.current;
    const threshold = 40; // سحب خفيف
    if (Math.abs(delta) > threshold && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => {
          if (delta < 0) return (prev + 1) % bannerSlides.length; // سحب لليسار => التالي
          return (prev - 1 + bannerSlides.length) % bannerSlides.length; // سحب لليمين => السابق
          // ملاحظة: الاتجاهات هنا بالنسبة لتخطيط RTL فقط لتبديل الشرائح
        });
        setIsTransitioning(false);
      }, 150);
    }
    startXRef.current = null;
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <section
      dir="rtl"
      className={` !bg-gradient-to-br ${currentBanner.bgPattern}  !overflow-hidden !transition-all !duration-1000 !ease-in-out`}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      style={{
        backgroundAttachment: "fixed",
      }}
    >
      {/* خلفية بارالاكس خفيفة */}
      <div className="!inset-0 !opacity-30 mb-[30px]">
        <div
          className="!absolute !w-full !h-full !bg-gradient-to-r !from-transparent !via-white/10 !to-transparent !transform !transition-transform !duration-1000 !ease-out"
          style={{
            transform: `translateX(${-mousePosition.x}px) translateY(${
              mousePosition.y
            }px) rotate(${mousePosition.x * -0.1}deg)`,
          }}
        ></div>
      </div>

      {/* عناصر عائمة كما هي */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`!absolute ${element.position} !text-6xl !opacity-20 !pointer-events-none !transform !transition-all !duration-1000 !ease-in-out`}
          style={{
            animation: `floatSmooth ${element.duration} ease-in-out infinite`,
            animationDelay: `${element.delay}ms`,
          }}
        >
          <div className="!transform !hover:scale-110 !transition-transform !duration-300">
            {element.emoji}
          </div>
        </div>
      ))}

      {/* ====== New: غلاف الشرائح بـ AnimatePresence مع mode="wait" ====== */}
      <div className="!container !mx-auto !px-4 !py-16 !min-h-screen !flex !items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-12 !items-center content-stretch justify-items-stretch  !w-full"
          >
            {/* النصوص - دون تغيير UI، فقط ستاجر خفيف */}
            <motion.div
              variants={textStagger}
              initial="hidden"
              animate="show"
              className={`!space-y-8 !transform !transition-all !duration-1500 !ease-out ${
                isVisible
                  ? "!translate-x-0 !opacity-100"
                  : "!translate-x-12 !opacity-0"
              }`}
            >
              <div className="!inline-flex !items-center !space-x-3 !bg-white/90 !backdrop-blur-sm !rounded-full !px-8 !py-4 !shadow-2xl !border-2 !border-yellow-300 !hover:shadow-3xl !transition-all !duration-300 !hover:scale-105 !cursor-default">
                <div className="!flex !items-center !space-x-1">
                  <Star className="!text-yellow-500 !animate-pulse" size={22} />
                  <Star
                    className="!text-yellow-400 !animate-pulse"
                    size={18}
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <span className="!text-gray-800 !font-bold !text-lg">
                  مع المستر الفلاح انت دايما في نجاح{" "}
                </span>
                <div className="!flex !items-center !space-x-1">
                  <Star
                    className="!text-yellow-400 !animate-pulse"
                    size={18}
                    style={{ animationDelay: "1s" }}
                  />
                  <Star
                    className="!text-yellow-500 !animate-pulse"
                    size={22}
                    style={{ animationDelay: "1.5s" }}
                  />
                </div>
              </div>

              <div className="!space-y-6">
                <motion.h1
                  variants={textItem}
                  className={`!text-5xl md:!text-7xl  !font-black !bg-gradient-to-r ${currentBanner.color} !bg-clip-text !text-transparent  !transform !transition-all !duration-1000`}
                >
                  <span className="!block !transform !hover:scale-105 !leading-[100px] !transition-transform !duration-300 !cursor-default text-[black]">
                    {currentBanner.title}
                  </span>
                </motion.h1>

                <motion.h2
                  variants={textItem}
                  className="!text-2xl md:!text-4xl !text-gray-700 !font-bold !leading-relaxed !transform !transition-all !duration-700"
                >
                  <span className="!inline-block !transform !hover:scale-105 !transition-transform !duration-300 !cursor-default">
                    {currentBanner.subtitle}
                  </span>
                </motion.h2>

                <motion.p
                  variants={textItem}
                  className="!text-xl !text-gray-600 !leading-relaxed !max-w-2xl !transform !transition-all !duration-500 !font-medium"
                >
                  {currentBanner.description}
                </motion.p>
              </div>

              <motion.div
                variants={textItem}
                className="!flex !flex-col sm:!flex-row !gap-6"
              >
                <button
                  onClick={() => (window.location.href = "/allcourses")}
                  className="!group hover:scale-105 !relative !bg-gradient-to-r !from-blue-500 !via-pink-500 !to-rose-500 !text-white !font-bold !py-5 !px-10 !rounded-2xl !text-xl !shadow-2xl !transform !transition-all !duration-500 !hover:scale-110 !hover:shadow-3xl !hover:from-blue-600 !hover:via-pink-600 !hover:to-rose-600 !overflow-hidden !border-2 !border-white/20"
                >
                  <div className="!absolute !inset-0 !bg-gradient-to-r !from-white/20 !to-transparent !transform !-translate-x-full !group-hover:translate-x-0 !transition-transform !duration-500"></div>
                  <span className="!relative !flex !items-center !justify-center !space-x-3">
                    <Play
                      className="!transform !group-hover:scale-125 !transition-transform !duration-300"
                      size={24}
                    />
                    <span className="!transform !group-hover:-translate-x-1 !transition-transform !duration-300">
                      ابدأ التعلم الآن!
                    </span>
                    <Sparkles
                      className="!transform !group-hover:rotate-180 !transition-transform !duration-500"
                      size={20}
                    />
                  </span>
                </button>

                <button className="!group hover:scale-105 !relative !bg-white/90 !backdrop-blur-sm !border-3 !border-blue-400 !text-blue-600 !font-bold !py-5 !px-10 !rounded-2xl !text-xl !shadow-2xl !transform !transition-all !duration-500 !hover:scale-110 !hover:shadow-3xl !hover:bg-blue-50 !overflow-hidden !hidden sm:!inline-flex">
                  <div className="!absolute !inset-0 !bg-gradient-to-r !from-blue-100/50 !to-pink-100/50 !transform !translate-y-full !group-hover:translate-y-0 !transition-transform !duration-500"></div>
                  <span className="!relative !flex !items-center !justify-center !space-x-3">
                    
                    <span className="!transform !group-hover:-translate-x-1 !transition-transform !duration-300">
                      {userData ? "تعرف على المستر الفلاح " : "سجل الآن"}
                    </span>
                    <ArrowLeft
                      className="!transform !group-hover:mr-4 !transition-transform !duration-300"
                      size={20}
                      color="black"
                    />
                  </span>
                </button>
              </motion.div>

              <motion.div
                variants={textItem}
                className="!grid !grid-cols-3 !gap-8 !pt-8"
              >
                {[
                  {
                    number: "95%",
                    label: "معدل النجاح",
                    icon: Trophy,
                    color: "!text-blue-600",
                  },
                  {
                    number: "15+",
                    label: "سنوات الخبرة",
                    icon: CheckCircle,
                    color: "!text-green-600",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="!text-center !transform !transition-all !duration-500 !hover:scale-110 !cursor-default"
                  >
                    <div
                      className={`!flex !items-center !justify-center !mb-2`}
                    >
                      <stat.icon className={`${stat.color} !ml-2`} size={24} />
                      <div className={`!text-4xl !font-black ${stat.color}`}>
                        {stat.number}
                      </div>
                    </div>
                    <div className="!text-gray-600 !font-semibold !text-lg">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* يمين: صورة/محتوى الشريحة - بدون تغيير UI، فقط Motion */}
            <motion.div
              variants={textItem}
              className="w-full h-full"
              // تأثير كين-بيرنز خفيف جدًا في الدخول
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.995 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.995 }
              }
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <EnhancedBanner currentBanner={currentBanner} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* مؤشرات الموبايل كما هي */}
      <div className="!absolute !bottom-13.5 !left-1/2 !transform !-translate-x-1/2 !flex !space-x-4 !bg-white/20 !backdrop-blur-sm !rounded-full !p-3 !shadow-xl md:!hidden">
        {bannerSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleSlideChange(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className={`!relative !w-5 !h-5 !rounded-full !transition-all !duration-700 !ease-out z-900 ${
              index === currentSlide
                ? "!bg-gradient-to-r !from-blue-500 !to-pink-500 !w-10 !shadow-xl !shadow-blue-200/50"
                : "!bg-blue-200/60 !hover:bg-blue-300/80 !backdrop-blur-sm"
            }`}
          >
            {index === currentSlide && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="!absolute !inset-0 !bg-white/40 !rounded-full !backdrop-blur-sm"
              />
            )}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        @keyframes floatSmooth {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-15px) rotate(5deg) scale(1.05);
          }
          66% {
            transform: translateY(-5px) rotate(-3deg) scale(0.95);
          }
        }

        @keyframes bounceSmooth {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        @keyframes orbitSmooth {
          from {
            transform: rotate(360deg) translateX(190px) rotate(-360deg);
          }
          to {
            transform: rotate(0deg) translateX(190px) rotate(0deg);
          }
        }

        @keyframes pulseSmooth {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
};

export default Banner2;

const EnhancedBanner = ({ currentBanner }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          0% { 
            opacity: 0; 
            transform: scale(0.7) rotate(-10deg); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05) rotate(2deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }

        @keyframes bounceSmooth {
          0%, 100% { 
            transform: scale(1) rotate(0deg) translateY(0px);
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
          }
          25% { 
            transform: scale(1.05) rotate(1deg) translateY(-5px);
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
          }
          50% { 
            transform: scale(1.08) rotate(0deg) translateY(-8px);
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.2));
          }
          75% { 
            transform: scale(1.05) rotate(-1deg) translateY(-5px);
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.15));
          }
        }

        @keyframes pulseSmooth {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: scale(1.1) rotate(5deg);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2) rotate(0deg);
            opacity: 0.7;
          }
          75% { 
            transform: scale(1.15) rotate(-5deg);
            opacity: 0.5;
          }
        }

        @keyframes orbitalFloat {
          0% { 
            transform: rotate(0deg) translateX(150px) rotate(0deg);
          }
          100% { 
            transform: rotate(360deg) translateX(150px) rotate(-360deg);
          }
        }

        @keyframes sparkleShimmer {
          0%, 100% { 
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes morphingGlow {
          0% { 
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3));
          }
          25% { 
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            background: linear-gradient(90deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
          }
          50% { 
            border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
          }
          75% { 
            border-radius: 30% 70% 70% 30% / 70% 30% 30% 70%;
            background: linear-gradient(180deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3));
          }
        }

        @keyframes particleFloat {
          0% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 1;
          }
          90% { 
            opacity: 1;
          }
          100% { 
            transform: translateY(-100px) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-orbital { animation: orbitalFloat 20s linear infinite; }
        .animate-sparkle { animation: sparkleShimmer 2s ease-in-out infinite; }
        .animate-morph { animation: morphingGlow 8s ease-in-out infinite; }
        .animate-particle { animation: particleFloat 6s ease-out infinite; }

        .glow-effect {
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.2),
            0 0 40px rgba(168, 85, 247, 0.1),
            0 0 80px rgba(236, 72, 153, 0.05),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .magic-sparkles::before,
        .magic-sparkles::after {
          content: '✨';
          position: absolute;
          font-size: 1.5rem;
          animation: sparkleShimmer 3s ease-in-out infinite;
        }

        .magic-sparkles::before {
          top: 20%;
          left: 15%;
          animation-delay: 0.5s;
        }

        .magic-sparkles::after {
          bottom: 25%;
          right: 20%;
          animation-delay: 1.5s;
        }
      `}</style>

      <div
        className={`!relative !flex !justify-center !items-center !transform !transition-all !duration-1500 !ease-out ${
          isVisible
            ? "!translate-x-0 !opacity-100"
            : "!-translate-x-12 !opacity-0"
        }`}
      >
        {/* Orbital particles */}
        <div className="!absolute !inset-0 !pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="!absolute !top-1/2 !left-1/2 !w-3 !h-3 !bg-gradient-to-r !from-blue-400 !to-purple-400 !rounded-full animate-orbital"
              style={{
                animation: `orbitalFloat ${15 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Main banner container */}
        <div
          className="magic-sparkles !relative !w-96 !h-96 !bg-gradient-to-br !from-yellow-200 !via-orange-200 !to-pink-200 !rounded-full !shadow-3xl !flex !items-center !justify-center !border-8 !border-white/80 !backdrop-blur-sm !transform !transition-all !duration-700 !hover:scale-105 glow-effect"
          style={{
            animation: "fadeInScale 0.6s ease-out forwards",
          }}
        >
          {/* Morphing inner glow */}
          <div className="!absolute !inset-4 !rounded-full animate-morph !opacity-30"></div>

          {/* Main content */}
          <div
            className="!text-9xl !cursor-default !transform !transition-all !duration-700 !hover:scale-110 !z-10"
            style={{
              animation: "bounceSmooth 3s ease-in-out infinite",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
            }}
          >
            {currentBanner.image ? (
              <img
                src={currentBanner.image}
                alt="banner"
                className="!w-[500px] !h-[500px]  rounded-2xl !shadow-[0_0_20px_rgba(0,0,0,0.1)] !shadow-blue-300 !object-cover"
              />
            ) : (
              currentBanner.emoji
            )}
          </div>

          {/* Animated border ring */}
          <div className="!absolute !inset-0 !border-4 !border-blue-300/50 !rounded-full !animate-ping !animation-duration-3s"></div>

          {/* Secondary pulsing ring */}
          <div
            className="!absolute !inset-2 !border-2 !border-purple-400/30 !rounded-full !animate-ping"
            style={{ animationDelay: "0.5s", animationDuration: "4s" }}
          ></div>
        </div>

        {/* Enhanced floating background elements */}
        <div className="!absolute !-z-10 !w-full !h-full !overflow-hidden">
          {/* Large morphing blobs */}
          <div
            className="!absolute !top-0 !left-0 !w-40 !h-40 !bg-gradient-to-br !from-blue-200 !to-pink-200 !rounded-full !opacity-60 !blur-xl animate-morph"
            style={{ animation: "pulseSmooth 4s ease-in-out infinite" }}
          ></div>
          <div
            className="!absolute !bottom-0 !right-0 !w-32 !h-32 !bg-gradient-to-br !from-pink-200 !to-rose-200 !rounded-full !opacity-60 !blur-xl animate-morph"
            style={{
              animation: "pulseSmooth 3s ease-in-out infinite",
              animationDelay: "1s",
            }}
          ></div>
          <div
            className="!absolute !top-1/2 !left-0 !w-24 !h-24 !bg-gradient-to-br !from-blue-200 !to-cyan-200 !rounded-full !opacity-60 !blur-xl animate-morph"
            style={{
              animation: "pulseSmooth 5s ease-in-out infinite",
              animationDelay: "2s",
            }}
          ></div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="!absolute !w-2 !h-2 !bg-gradient-to-r !from-blue-300 !to-purple-300 !rounded-full animate-particle !opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}

          {/* Subtle grid pattern overlay */}
          <div
            className="!absolute !inset-0 !opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Corner accent sparkles */}
        <div className="!absolute !top-10 !right-10 !text-2xl animate-sparkle">
          ⭐
        </div>
        <div
          className="!absolute !bottom-10 !left-10 !text-2xl animate-sparkle"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>
        <div
          className="!absolute !top-20 !left-20 !text-xl animate-sparkle"
          style={{ animationDelay: "2s" }}
        >
          💫
        </div>
      </div>
    </>
  );
};
