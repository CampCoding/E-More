import React, { useEffect, useState } from "react";
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
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Banner2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const bannerSlides = [
    {
      title: "مرحبًا بكم في مغامرة المستر الفلاح الإنجليزية! مع الفلاح",
      subtitle: "حيث تعلم اللغة الإنجليزية هو سحر خالص! ✨",
      description:
        "انضم إلى رحلتنا المليئة بالمرح عبر عالم اللغة الإنجليزية الرائع! من القصص المثيرة إلى الألعاب الممتعة، كل درس هو مغامرة تنتظر أن تتكشف.",
      emoji: "📋",
      image:"https://res.cloudinary.com/duovxefh6/image/upload/v1750754615/f2654818-4ebc-42fa-a870-18b984a5bf98_ceo78t.jpg",
      color: "from-blue-400 via-pink-400 to-rose-400",
      bgPattern: "from-blue-50 via-pink-50 to-rose-50"
    },
    {
      title: "القصص تنبض بالحياة هنا!",
      subtitle: "القراءة التفاعلية ورواية القصص 📚",
      description:
        "انغمس في عوالم سحرية مع جلسات رواية القصص التفاعلية لدينا. شاهد الشخصيات وهي ترقص على الصفحات بينما نستكشف القواعد والمفردات والخيال معًا!",
      emoji: "📖",
      color: "from-blue-400 via-cyan-400 to-teal-400",
      bgPattern: "from-blue-50 via-cyan-50 to-teal-50"
    },
    {
      title: "ألعاب القواعد والمرح!",
      subtitle: "التعلم من خلال اللعب 🎮",
      description:
        "حوّل قواعد النحو الصعبة إلى ألعاب مثيرة! نهجنا التفاعلي يجعل تعلم الأفعال والأسماء وتركيب الجمل ممتعًا مثل اللعب مع الأصدقاء.",
      emoji: "🎯",
      color: "from-green-400 via-emerald-400 to-teal-400",
      bgPattern: "from-green-50 via-emerald-50 to-teal-50"
    }
  ];

  const floatingElements = [
    { emoji: "📚", delay: 0, position: "top-10 right-10", duration: "6s" },
    { emoji: "✏️", delay: 1000, position: "top-20 left-20", duration: "8s" },
    { emoji: "🌟", delay: 2000, position: "bottom-20 right-20", duration: "7s" },
    {
      emoji: "🎨",
      delay: 1500,
      position: "bottom-32 left-16",
      duration: "9s"
    },
    { emoji: "🦋", delay: 500, position: "top-40 right-1/4", duration: "10s" },
    { emoji: "🌸", delay: 2500, position: "top-60 left-1/3", duration: "5s" }
  ];

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
        y: (e.clientY / window.innerHeight) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
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

  const currentBanner = bannerSlides[currentSlide];

  return (
    <section
      dir="rtl"
      className={`!min-h-screen !bg-gradient-to-br ${currentBanner.bgPattern} !relative !overflow-hidden !transition-all !duration-1000 !ease-in-out`}
    >
      {}
      <div className="!inset-0 !opacity-30 mb-[30px]">
        <div
          className="!absolute !w-full !h-full !bg-gradient-to-r !from-transparent !via-white/10 !to-transparent !transform !transition-transform !duration-1000 !ease-out"
          style={{
            transform: `translateX(${-mousePosition.x}px) translateY(${
              mousePosition.y
            }px) rotate(${mousePosition.x * -0.1}deg)`
          }}
        ></div>
      </div>

      {}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`!absolute ${element.position} !text-6xl !opacity-20 !pointer-events-none !transform !transition-all !duration-1000 !ease-in-out`}
          style={{
            animation: `floatSmooth ${element.duration} ease-in-out infinite`,
            animationDelay: `${element.delay}ms`
          }}
        >
          <div className="!transform !hover:scale-110 !transition-transform !duration-300">
            {element.emoji}
          </div>
        </div>
      ))}

      {}
      <div className="!container !mx-auto !px-4 !py-16 !min-h-screen !flex !items-center">
        <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-12 !items-center !w-full">
          {}
          <div
            className={`!space-y-8 !transform !transition-all !duration-1500 !ease-out ${
              isVisible
                ? '!translate-x-0 !opacity-100':'!translate-x-12 !opacity-0'}`}
          >
            {}
            <div className="!inline-flex !items-center !space-x-3 !bg-white/90 !backdrop-blur-sm !rounded-full !px-8 !py-4 !shadow-2xl !border-2 !border-yellow-300 !hover:shadow-3xl !transition-all !duration-300 !hover:scale-105 !cursor-default">
              <div className="!flex !items-center !space-x-1">
                <Star className="!text-yellow-500 !animate-pulse" size={22} />
                <Star
                  className="!text-yellow-400 !animate-pulse"
                  size={18}
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
              <span className="!text-gray-800 !font-bold !text-lg">
نمتلك العديد من المدرسين المعتمدين في المواد
              </span>
              <div className="!flex !items-center !space-x-1">
                <Star
                  className="!text-yellow-400 !animate-pulse"
                  size={18}
                  style={{ animationDelay: '1s' }}
                />
                <Star
                  className="!text-yellow-500 !animate-pulse"
                  size={22}
                  style={{ animationDelay: '1.5s' }}
                />
              </div>
            </div>

            {}
            <div className="!space-y-6">
              <h1
                className={`!text-5xl md:!text-7xl !font-black !bg-gradient-to-r ${currentBanner.color} !bg-clip-text !text-transparent !leading-tight !transform !transition-all !duration-1000`}
              >
                <span className="!block !transform !hover:scale-105 !transition-transform !duration-300 !cursor-default text-[black]">
                  {currentBanner.title}
                </span>
              </h1>
              <h2 className="!text-2xl md:!text-4xl !text-gray-700 !font-bold !leading-relaxed !transform !transition-all !duration-700">
                <span className="!inline-block !transform !hover:scale-105 !transition-transform !duration-300 !cursor-default">
                  {currentBanner.subtitle}
                </span>
              </h2>
              <p className="!text-xl !text-gray-600 !leading-relaxed !max-w-2xl !transform !transition-all !duration-500 !font-medium">
                {currentBanner.description}
              </p>
            </div>

            {}
            <div className="!flex !flex-col sm:!flex-row !gap-6">
              <button onClick={()=>window.location.href = "/allcourses"} className="!group !relative !bg-gradient-to-r !from-blue-500 !via-pink-500 !to-rose-500 !text-white !font-bold !py-5 !px-10 !rounded-2xl !text-xl !shadow-2xl !transform !transition-all !duration-500 !hover:scale-110 !hover:shadow-3xl !hover:from-blue-600 !hover:via-pink-600 !hover:to-rose-600 !overflow-hidden !border-2 !border-white/20">
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

              <button className="!group !relative !bg-white/90 !backdrop-blur-sm !border-3 !border-blue-400 !text-blue-600 !font-bold !py-5 !px-10 !rounded-2xl !text-xl !shadow-2xl !transform !transition-all !duration-500 !hover:scale-110 !hover:shadow-3xl !hover:bg-blue-50 !overflow-hidden">
                <div className="!absolute !inset-0 !bg-gradient-to-r !from-blue-100/50 !to-pink-100/50 !transform !translate-y-full !group-hover:translate-y-0 !transition-transform !duration-500"></div>
                <span className="!relative !flex !items-center !justify-center !space-x-3">
                  <Users
                    className="!transform !group-hover:scale-125 !transition-transform !duration-300"
                    size={24}
                    color="black"
                  />
                  <span className="!transform !group-hover:-translate-x-1 !transition-transform !duration-300">
                    تعرف على المعلم
                  </span>
                  <ArrowRight
                    className="!transform !group-hover:-translate-x-2 !transition-transform !duration-300"
                    size={20}
                    color="black"
                  />
                </span>
              </button>
            </div>

            {}
            <div className="!grid !grid-cols-3 !gap-8 !pt-8">
              {[
                
                {
                  number: "95%",
                  label: "معدل النجاح",
                  icon: Trophy,
                  color: "!text-blue-600"
                },
                {
                  number: "15+",
                  label: "سنوات الخبرة",
                  icon: CheckCircle,
                  color: "!text-green-600"
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="!text-center !transform !transition-all !duration-500 !hover:scale-110 !cursor-default"
                >
                  <div className={`!flex !items-center !justify-center !mb-2`}>
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
            </div>
          </div>

          {}
          <div
            className={`!relative !flex !justify-center !items-center !transform !transition-all !duration-1500 !ease-out ${
              isVisible
                ? '!translate-x-0 !opacity-100':'!-translate-x-12 !opacity-0'}`}
          >
            {}
            <div
              className="!relative !w-96 !h-96 !bg-gradient-to-br !from-yellow-200 !via-orange-200 !to-pink-200 !rounded-full !shadow-3xl !flex !items-center !justify-center !border-8 !border-white/80 !backdrop-blur-sm !transform !transition-all !duration-700 !hover:scale-105"
              style={{
                animation: 'fadeInScale 0.6s ease-out forwards'
              }}
            >
              {}
              <div
                className="!text-9xl !cursor-default !transform !transition-all !duration-700 !hover:scale-110"
                style={{
                  animation: 'bounceSmooth 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                }}
              >
                {
                  currentBanner.image ? <img src={currentBanner.image} alt="banner" className= "!w-[220px] rounded-md !object-contain" /> : currentBanner.emoji
                }
              </div>

              {}
              <div className="!absolute !inset-0">
                {[
                  { emoji: "📝", angle: 0, size: "!text-4xl", icon: BookOpen },
                  { emoji: "🎵", angle: 60, size: "!text-3xl", icon: Zap },
                  { emoji: "🌟", angle: 120, size: "!text-4xl", icon: Star },
                  {
                    emoji: "🎨",
                    angle: 180,
                    size: "!text-3xl",
                    icon: Sparkles
                  },
                  { emoji: "🦄", angle: 240, size: "!text-4xl", icon: Heart },
                  { emoji: "📋", angle: 300, size: "!text-3xl", icon: Globe }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="!absolute !transform !transition-all !duration-700"
                    style={{
                      animation: `orbitSmooth 25s linear infinite`,
                      animationDelay: `${index * 1}s`,
                      transform: `rotate(${item.angle}deg) translateX(190px) rotate(-${item.angle}deg)`
                    }}
                  >
                    <div className="!group !bg-white/95 !backdrop-blur-sm !rounded-2xl !p-4 !shadow-2xl !border-3 !border-blue-200 !transform !transition-all !duration-500 !hover:scale-125 !hover:shadow-3xl !hover:border-blue-400 !cursor-pointer">
                      <div
                        className={`${item.size} !transform !group-hover:rotate-12 !transition-transform !duration-300`}
                      >
                        {item.emoji}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div className="!absolute !inset-0 !border-4 !border-blue-300/50 !rounded-full !animate-ping !animation-duration-3s"></div>
            </div>

            {}
            <div className="!absolute !-z-10 !w-full !h-full">
              <div
                className="!absolute !top-0 !left-0 !w-40 !h-40 !bg-gradient-to-br !from-blue-200 !to-pink-200 !rounded-full !opacity-60 !blur-xl"
                style={{ animation: 'pulseSmooth 4s ease-in-out infinite' }}
              ></div>
              <div
                className="!absolute !bottom-0 !right-0 !w-32 !h-32 !bg-gradient-to-br !from-pink-200 !to-rose-200 !rounded-full !opacity-60 !blur-xl"
                style={{
                  animation: 'pulseSmooth 3s ease-in-out infinite',
                  animationDelay: '1s'
                }}
              ></div>
              <div
                className="!absolute !top-1/2 !left-0 !w-24 !h-24 !bg-gradient-to-br !from-blue-200 !to-cyan-200 !rounded-full !opacity-60 !blur-xl"
                style={{
                  animation: 'pulseSmooth 5s ease-in-out infinite',
                  animationDelay: '2s'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="!absolute !bottom-13.5 !left-1/2 !transform !-translate-x-1/2 !flex !space-x-4 !bg-white/20 !backdrop-blur-sm !rounded-full !p-3 !shadow-xl">
        {bannerSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleSlideChange(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className={`!relative !w-5 !h-5 !rounded-full !transition-all !duration-700 !ease-out z-900 ${
              index === currentSlide
                ? '!bg-gradient-to-r !from-blue-500 !to-pink-500 !w-10 !shadow-xl !shadow-blue-200/50'
                : '!bg-blue-200/60 !hover:bg-blue-300/80 !backdrop-blur-sm'
            }`}
          >
            {index === currentSlide && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
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
