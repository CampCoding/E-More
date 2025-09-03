import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  Send,
  Heart,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Star,
  Zap,
  Globe,
  Trophy,
  Rocket,
  Diamond,
  Crown,
  Flame,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     setMousePosition({
  //       x: (e.clientX / window.innerWidth) * 100,
  //       y: (e.clientY / window.innerHeight) * 100,
  //     });
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const socialLinks = [
    {
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61562063557757&mibextid=LQQJ4d",
      color: "from-blue-400 via-blue-500 to-blue-600",
      shadow: "shadow-blue-500/50",
      name: "فيسبوك",
    },
    {
      icon: Instagram,
      url: "https://www.instagram.com/MR.El-Fallah ?igsh=dnR3OGgwemFhZHp4",
      color: "from-red-400 via-blue-500 to-indigo-600",
      shadow: "shadow-red-500/50",
      name: "انستغرام",
    },
  ];

  const navigationLinks = [
    { name: "الرئيسية", path: "/", icon: Globe, color: "text-emerald-400" },
    {
      name: "الدورات",
      path: "/allcourses",
      icon: BookOpen,
      color: "text-blue-400",
    },
    { name: "الامتحانات", path: "/exams", icon: Award, color: "text-blue-400" },
    {
      name: "بنك الأسئلة",
      path: "/questions",
      icon: Users,
      color: "text-red-400",
    },
  ];

  const achievements = [
    {
      number: "15 ألف+",
      label: "طالب سعيد",
      icon: Users,
      color: "from-emerald-400 to-teal-500",
    },
    {
      number: "750+",
      label: "دورة متخصصة",
      icon: BookOpen,
      color: "from-blue-400 to-cyan-500",
    },
    {
      number: "98%",
      label: "معدل النجاح",
      icon: Trophy,
      color: "from-blue-400 to-red-500",
    },
    {
      number: "24/7",
      label: "دعم فني",
      icon: Rocket,
      color: "from-orange-400 to-red-500",
    },
  ];

  const features = [
    { icon: Crown, text: "جودة عالية", color: "text-yellow-400" },
    { icon: Zap, text: "تعلم سريع", color: "text-blue-400" },
    { icon: Diamond, text: "محتوى متخصص", color: "text-blue-400" },
    {
      icon: Flame,
      text: "إختبارات وبنوك أسئلة تفاعلية",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="bg-gradient-to-r  from-[#FAF5FF] to-[#FBE7F3]">
      <footer
        dir="rtl"
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white overflow-hidden"
        style={{
          borderTopLeftRadius: "50px",
          borderTopRightRadius: "50px",
          overflow: "hidden",
          borderTop: "3px dotted white",
        }}
      >
        {/* Dynamic Mouse-Following Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${100 - mousePosition.x}% ${
              mousePosition.y
            }%, blue 0%, transparent 50%)`,
          }}
        />

        {/* Animated Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-red-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/20 via-blue-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-red-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <div
                className={`w-3 h-3 bg-gradient-to-r from-blue-400 to-red-400 rounded-full opacity-60 shadow-lg`}
              />
            </motion.div>
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-20 bg-gradient-to-b from-white to-transparent rounded-full"
              animate={{
                x: [-100, window.innerWidth + 100],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
              }}
              style={{
                transform: "rotate(-45deg)",
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Hero Stats Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="pt-20 pb-10"
          >
            <div className="container mx-auto px-6">
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-6xl md:text-8xl font-black mb-6">
                  {/* <span className="bg-gradient-to-r from-blue-400 via-red-400 to-cyan-400 bg-clip-text text-transparent animate-pulse"> */}
                  <span className="text-white animate-pulse">
                    المستر الفلاح
                  </span>
                </h2>
                <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                    >
                      <feature.icon
                        className={`w-5 h-5 ml-2 ${feature.color}`}
                      />
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements Grid */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 text-center">
                      <achievement.icon
                        className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${achievement.color} p-2 rounded-2xl`}
                      />
                      <div
                        className={`text-4xl font-black bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2`}
                      >
                        {achievement.number}
                      </div>
                      <div className="text-gray-300 font-medium">
                        {achievement.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div> */}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-6 pb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Brand Story */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-2xl flex items-center justify-center ml-4 shadow-lg">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                        مهمتنا
                      </h3>
                      <p className="text-gray-400">
                        تغيير أسلوب تعلم اللغة الإنجليزية
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-8">
                    تمكين الجيل القادم من خلال تجربة تعليمية ممتعة تدمج بين
                    الشرح التفاعلي، الأغاني الهادفة، والأنشطة الشيقة. نهدف إلى
                    جعل اللغة الإنجليزية رحلة ممتعة تُنمّي المهارات وتبني الثقة،
                    بعيدًا عن الطرق التقليدية الجافة.
                  </p>

                  {/* Social Media */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold flex items-center">
                      <Sparkles className="w-5 h-5 ml-2 text-yellow-400" />
                      تواصل معنا
                    </h4>
                    <div className="flex space-x-4 space-x-reverse">
                      {socialLinks.map((social, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.15, rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(social.url, "_blank")}
                          className={`border-none relative p-4 rounded-2xl bg-gradient-to-r ${social.color} ${social.shadow} shadow-xl transition-all duration-300 group overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <social.icon className="w-6 h-6 relative z-10" />
                          <div className="absolute -bottom-8 right-1/2 transform translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 group-hover:-bottom-12 transition-all duration-300">
                            {social.name}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl h-full">
                  {/* <h4 className="text-2xl font-bold mb-8 flex items-center">
                  <Rocket className="w-6 h-6 ml-3 text-cyan-400" />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    تنقل سريع
                  </span>
                </h4> */}
                  <div className="space-y-4">
                    {navigationLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: -10, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <a
                          href={link.path}
                          className="no-underline text-[white] flex items-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <link.icon className={`w-5 h-5 ${link.color}`} />
                          </div>
                          <span className="font-medium group-hover:text-white transition-colors duration-300">
                            {link.name}
                          </span>
                          <ArrowRight className="w-4 h-4 mr-auto opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl h-full">
                  <h4 className="text-2xl font-bold mb-6 flex items-center">
                    <Star className="w-6 h-6 ml-3 text-yellow-400" />
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      ابق على اطلاع
                    </span>
                  </h4>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    انضم إلى مجتمعنا الحصري واحصل على محتوى متميز، ووصول مبكر
                    إلى الدورات، ونصائح الخبراء مباشرة في بريدك الوارد.
                  </p>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="بريدك الإلكتروني"
                        className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubscribe}
                      disabled={isSubscribed}
                      className={`text-[white] border-none w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center shadow-xl ${
                        isSubscribed
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/50"
                          : "bg-gradient-to-r from-blue-500 via-red-500 to-cyan-500 hover:from-blue-600 hover:via-red-600 hover:to-cyan-600 shadow-blue-500/50"
                      }`}
                    >
                      {isSubscribed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center"
                        >
                          <Heart className="w-5 h-5 ml-2 animate-pulse" />
                          أهلاً بك في العائلة!
                        </motion.div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 ml-2" />
                          انضم إلى عائلتنا
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Copyright Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="border-t border-white/10 py-8"
          >
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className=" text-white mb-4 md:mb-0 flex items-center text-center"
                >
                  © {new Date().getFullYear()} المستر الفلاح. صُنع بـ
                  <Heart className="inline w-4 h-4 text-red-500 animate-pulse mx-1" />
                  وشغف لا نهائي بتعليم اللغة الإنجليزية.
                </motion.p>
                <div className="flex items-center space-x-6 space-x-reverse text-sm">
                  <motion.a
                    whileHover={{ scale: 1.05, color: "#8b5cf6" }}
                    href="#"
                    className=" text-white hover:text-blue-400 transition-colors"
                  >
                    سياسة الخصوصية
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, color: "#8b5cf6" }}
                    href="#"
                    className=" text-white hover:text-blue-400 transition-colors"
                  >
                    شروط الخدمة
                  </motion.a>
                  {/* <motion.a
                  whileHover={{ scale: 1.05, color: "#06b6d4" }}
                  href="https://elmataryweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors font-medium"
                >
                  ElmataryWeb ↗
                </motion.a> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .text-6xl {
              font-size: 3rem !important; /* 48px */
            }
            .md\\:text-8xl {
              font-size: 4rem !important; /* 64px */
            }
            .text-2xl {
              font-size: 1.25rem !important; /* 20px */
            }
            .flex-wrap {
              gap: 0.5rem !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default Footer;
