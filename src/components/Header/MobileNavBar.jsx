import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Plus,
  Clock,
  User,
  Sparkles,
  Bell,
  Heart,
} from "lucide-react";

const MobileNavBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isAddPressed, setIsAddPressed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [notifications, setNotifications] = useState({
    history: 3,
    profile: 1,
  });
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      gradient: "from-blue-500 to-purple-600",
      description: "Your personal dashboard",
    },
    {
      id: "search",
      icon: Search,
      label: "Search",
      gradient: "from-green-500 to-teal-600",
      description: "Discover and explore",
    },
    {
      id: "add",
      icon: Plus,
      label: "Create",
      isSpecial: true,
      gradient: "from-purple-600 to-pink-600",
      description: "Add something amazing",
    },
    {
      id: "history",
      icon: Clock,
      label: "History",
      gradient: "from-orange-500 to-red-600",
      description: "Your activity timeline",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      gradient: "from-indigo-500 to-purple-600",
      description: "Account settings",
    },
  ];

  const createParticles = (x, y) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: i * 45 * (Math.PI / 180),
      velocity: 2 + Math.random() * 2,
      life: 1,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1000);
  };

  const handleTabPress = (tabId, event) => {
    if (tabId === "add") {
      setIsAddPressed(true);
      const rect = event.currentTarget.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setTimeout(() => setIsAddPressed(false), 200);
    }
    setActiveTab(tabId);

    // Clear notifications for selected tab
    if (notifications[tabId]) {
      setNotifications((prev) => ({ ...prev, [tabId]: 0 }));
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex justify-center items-center fixed bottom-0 z-50 w-screen left-0 right-0 overflow-hidden">
      <div className="w-full  relative z-10 ">
        {/* Navigation Container */}
        <motion.div
          className="bg-white/20 backdrop-blur-xl  bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-3   shadow-2xl border border-white/30"
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Navigation Items */}
          <div className="flex justify-between items-center">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isHovered = hoveredTab === item.id;
              const isAddButton = item.isSpecial;
              const hasNotification =
                item.hasNotification && notifications[item.id] > 0;

              return (
                <motion.button
                  key={item.id}
                  onClick={(e) => handleTabPress(item.id, e)}
                  onHoverStart={() => setHoveredTab(item.id)}
                  onHoverEnd={() => setHoveredTab(null)}
                  className={`flex flex-col items-center justify-center relative ${
                    isAddButton
                      ? "w-16 h-16 rounded-2xl shadow-lg overflow-hidden"
                      : "w-14 h-14 rounded-xl"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Background for special button */}
                  {isAddButton && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                      animate={{
                        scale: isAddPressed ? 1.1 : 1,
                        rotate: isAddPressed ? 180 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}

                  {/* Hover background for regular buttons */}
                  {!isAddButton && (isActive || isHovered) && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: isActive ? 0.3 : 0.2, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Icon Container */}
                  <motion.div
                    className="flex items-center justify-center relative z-10"
                    animate={{
                      rotate: isAddButton && isAddPressed ? 135 : 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Icon
                      size={isAddButton ? 24 : 20}
                      className={`${
                        isAddButton
                          ? "text-white"
                          : isActive
                          ? "text-white"
                          : "text-white/70"
                      }`}
                    />

                    {/* Sparkle effect for active states */}
                    {(isActive || isHovered) && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles size={12} className="text-yellow-300" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className={`text-xs mt-1 font-medium relative z-10 ${
                      isAddButton
                        ? "text-white"
                        : isActive
                        ? "text-white"
                        : "text-white/70"
                    }`}
                    animate={{
                      opacity: isActive ? 1 : 0.8,
                      y: isActive && !isAddButton ? -1 : 0,
                      scale: isActive ? 1.05 : 1,
                    }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Notification Badge */}
                  {hasNotification && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <span className="text-white text-xs font-bold">
                        {notifications[item.id]}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-red-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}

                  {/* Active Indicator */}
                  {isActive && !isAddButton && (
                    <motion.div
                      className="absolute -bottom-2 w-2 h-2 bg-white rounded-full shadow-lg"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Pulse Effect for Add Button */}
                  {isAddButton && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-2xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0, 0.2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileNavBar;
