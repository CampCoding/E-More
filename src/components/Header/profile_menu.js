import React, { useState, useEffect } from 'react';
import { User, Settings, Trophy, Star, LogOut } from 'lucide-react';
import useScrollReveal from '../../utils/useScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptData } from '../../utils/decrypt';

const ProfileMenu = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileRef, revealProfile] = useScrollReveal({ origin: 'top' });
  const [menuRef, revealMenu] = useScrollReveal({ origin: 'left', delay: 200 });
  const [logoutRef, revealLogout] = useScrollReveal({
    origin: 'bottom',
    delay: 400
  });

  useEffect(() => {
    revealProfile();
    revealMenu();
    revealLogout();
  }, [revealProfile, revealMenu, revealLogout]);

  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);
  const userData = decryptedUserData;
  const handleLogOut = () => {
    setLogoutLoading(true);
    // Simulate logout process
    setTimeout(() => {
      setLogoutLoading(false);
      localStorage.clear();
      window.location.href = "/login"; 
      alert('تم تسجيل الخروج بنجاح!');
    }, 2000);
  };

  const menuItems = [
    {
      icon: Settings,
      label: "إعدادات الحساب",
      color: "blue",
      hoverColor: "blue",
      link: "/profile"
    },
    // {
    //   icon: Trophy,
    //   label: "عرض التقدم",
    //   color: "yellow",
    //   hoverColor: "amber"
    // },
    // { icon: Star, label: "إنجازاتي", color: "blue", hoverColor: "blue" }
  ];

  return (
    <div
      className="flex justify-center items-start py-8 px-2 sm:px-0 z-50"
      dir="rtl"
      style={{ fontFamily: 'Cairo, Playpen Sans Arabic, sans-serif' }}
    >
      <div className="w-full max-w-md">
        <AnimatePresence>
          <motion.div
            ref={profileRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            className="backdrop-blur-xl rounded-3xl overflow-hidden !p-3 bg-white shadow-xl"
            style={{ width: '100%' }}
          >
            <div className="px-4 sm:px-8 relative">
              <div className="flex flex-row-reverse items-center space-x-reverse space-x-4 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-pink-400 to-indigo-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <User size={28} className="text-white" />
                  </div>

                  <div className="absolute -top-1 -left-1 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <h3 className="font-bold text-xl text-gray-800 mb-1 tracking-wide">
                    {userData.student_name}
                  </h3>
                  <p className="text-sm text-gray-500 bg-gray-50 px-5 py-1 rounded-full">
                    {userData.student_email}
                  </p>
                </div>
              </div>

              <div ref={menuRef} className="space-y-3 mb-6">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      onClick={() => {
                        if (item?.link) {
                          window.location.href = item?.link;
                        }
                      }}
                      transition={{
                        delay: 0.1 * index,
                        type: 'spring',
                        stiffness: 100,
                        damping: 18
                      }}
                      className= "group !w-[100%] flex flex-row-reverse justify-end items-center space-x-reverse space-x-4 py-4 px-5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-blue-100 text-lg font-bold"
                    >
                      <span className="font-bold group-hover:text-gray-800 transition-colors duration-300 pr-2">
                        {item.label}
                      </span>
                      <div
                        className={`p-2 rounded-xl bg-gradient-to-br ${
                          item.color === 'blue'
                            ? 'from-blue-100 to-blue-200'
                            : item.color === 'yellow'
                            ? 'from-yellow-100 to-amber-200'
                            : 'from-blue-100 to-indigo-200'
                        } group-hover:shadow-md transition-all duration-300`}
                      >
                        <IconComponent
                          size={20}
                          className={`$${
                            item.color === 'blue'
                              ? 'text-blue-600'
                              : item.color === 'yellow'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          } group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      {/* <div className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full"></div>
                      </div> */}
                    </motion.button>
                  );
                })}
              </div>

              <div ref={logoutRef}>
                <motion.button
                  onClick={handleLogOut}
                  disabled={logoutLoading}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{
                    delay: 0.1 * menuItems.length,
                    type: 'spring',
                    stiffness: 100,
                    damping: 18
                  }}
                  className= "group w-full flex flex-row-reverse justify-end items-center space-x-reverse space-x-4 py-4 px-5 text-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                >
                  <span className="font-bold group-hover:text-red-600 transition-colors duration-300 pr-2">
                    {logoutLoading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                  </span>
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-pink-200 group-hover:shadow-md transition-all duration-300">
                    <LogOut
                      size={20}
                      className="text-red-600 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {logoutLoading && (
                    <div className="mr-auto">
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default ProfileMenu;
