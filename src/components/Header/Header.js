import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Menu,
  X,
  User,
  Star,
  Home,
  Users,
  Trophy,
  Phone,
  LogOut,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileMenu from "./profile_menu";
import { decryptData } from "../../utils/decrypt";
import { Link } from "react-router-dom";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);
  const userData = decryptedUserData;
  // const userData = {
  //   student_name: "Mohammed Reda",

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      setLogoutLoading(false);
      setShowUserMenu(false);
    }, 1500);
  };

  const navigationLinks = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "المناهح", path: "/allcourses", icon: BookOpen },
    { name: "الاختبارات", path: "/exams", icon: Star },
    {
      name: "بنك الأسئلة",
      path: "/questions",
      icon: Trophy,
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-red-500 to-red-400 "
        dir="rtl"
        style={{ fontFamily: "Cairo, Playpen Sans Arabic, sans-serif" }}
      >
        <div className="container mx-auto px-2 ">
          <div className="flex flex-row items-center justify-between h-16 py-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-reverse space-x-3  cursor-pointer"
            >
              <Link to={"/"}>
                <img
                  src="https://res.cloudinary.com/dcs1nwnmm/image/upload/v1755328491/fala7_l_11zon_zjtjnn.png"
                  alt="Logo"
                  className="w-[130px] p-2 relative mr-2"
                />
              </Link>
            </motion.div>

            <nav className="hidden lg:flex items-center space-x-reverse space-x-8">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                if (link.authRequired && !userData.isAuthenticated) return null;

                // Determine if this link is active
                const isActive =
                  window.location.pathname === link.path ||
                  (link.path !== "/" && window.location.pathname.startsWith(link.path));

                return (
                  <motion.a
                    key={link.name}
                    href={link.path}
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-row-reverse items-center space-x-reverse space-x-2 px-6 py-2 rounded-full no-underline text-lg font-bold tracking-wide transition-all duration-200
                      ${isActive
                        ? "!text-white bg-white/20"
                        : "!text-white hover:bg-white/20"
                      }`}
                    style={{
                      fontFamily: "Cairo, Playpen Sans Arabic, sans-serif",
                    }}
                  >
                    <span
                      className={`font-bold mx-2`}
                    >
                      {link.name}
                    </span>
                    <IconComponent size={20} />
                  </motion.a>
                );
              })}
            </nav>

            {userData?.student_name ? (
              <div className="flex flex-row-reverse items-center space-x-reverse space-x-4">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="border-none w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30"
                    style={{
                      fontFamily: "Cairo, Playpen Sans Arabic, sans-serif",
                    }}
                  >
                    <User size={20} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="absolute left-0 mt-2 !min-w-[300px] rounded-2xl overflow-hidden z-50"
                        dir="rtl"
                      >
                        <ProfileMenu />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                  }}
                  className="border-none mx-2 lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30"
                  style={{
                    fontFamily: "Cairo, Playpen Sans Arabic, sans-serif",
                  }}
                >
                  {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-row-reverse items-center space-x-reverse space-x-4">
                <Link to="/login" className="text-white hover:text-gray-300">
                  تسجيل الدخول
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                  }}
                  className="border-none mx-2 lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30"
                  style={{
                    fontFamily: "Cairo, Playpen Sans Arabic, sans-serif",
                  }}
                >
                  {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden bg-white shadow-2xl border-t-4 border-blue-300 z-50"
              style={{ position: "absolute", width: "100%" }}
              dir="rtl"
            >
              <nav
                className="flex flex-col p-4 gap-2"
                style={{ fontFamily: "Cairo, Playpen Sans Arabic, sans-serif" }}
              >
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  if (link.authRequired && !userData.isAuthenticated)
                    return null;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.path}
                      className="flex flex-row items-center space-x-reverse space-x-2 p-3 text-gray-700 no-underline hover:bg-blue-100 rounded text-lg gap-2 justify-start font-bold"
                      whileHover={{ scale: 1.03, backgroundColor: "#DBEAFE" }} // blue-100
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <IconComponent size={20} color="black" />
                      <span>{link.name}</span>
                    </motion.a>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-40 space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { repeat: Infinity, duration: 1.5 } }}
          className="w-14 h-14 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Phone size={20} />
        </motion.button>
      </motion.div> */}
    </>
  );
};

export default Header;
