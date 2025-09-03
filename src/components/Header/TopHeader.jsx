import React, { useState, useEffect, useCallback } from "react";
import {
  Facebook,
  Instagram,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Globe,
  Users,
  Star,
  Zap,
  X,
  Copy,
} from "lucide-react";

const TopHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onlineStatus);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "خصم 20% على جميع المنتجات الزراعية", type: "offer" },
    { id: 2, text: "استشارات مجانية متاحة الآن", type: "info" },
  ]);
  const [currentNotification, setCurrentNotification] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const VALUE = "+201102300955"; // الرقم المنسوخ
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(VALUE);
      } else {
        const ta = document.createElement("textarea");
        ta.value = VALUE;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400); // يختفي تلقائيًا
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  // Update time every second for smooth animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Rotating notifications
  useEffect(() => {
    if (notifications.length > 1) {
      const timer = setInterval(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [notifications.length]);

  // Enhanced scroll behavior with throttling
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Mouse tracking for interactive effects
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ar-EG", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=100064363628042",
      icon: <Facebook size={16} />,
      label: "فيسبوك",
      hoverColor: "hover:text-blue-400",
      bgHover: "hover:bg-blue-500/10",
      followers: "12.5K",
    },
    {
      href: "https://www.instagram.com/el_mister_el_fallah/?fbclid=IwY2xjawMRZ2NleHRuA2FlbQIxMABicmlkETF1a1U4ODZ4TTZjN3pjcDNJAR5X0kUirOI51CCrMwlF74nEC15Ke39Z5NJ_8yThUoeDOVW28fw3lnaLMWPlVg_aem_8Pjllw97aaxK2QlpgFIj2Q#",
      icon: <Instagram size={16} />,
      label: "انستجرام",
      hoverColor: "hover:text-pink-400",
      bgHover: "hover:bg-pink-500/10",
      followers: "8.2K",
    },
    {
      href: "https://wa.me/201102300955",
      icon: <MessageCircle size={16} />,
      label: "واتساب",
      hoverColor: "hover:text-pink-400",
      bgHover: "hover:bg-pink-500/10",
      followers: "8.2K",
      isExternal: true,
    },
  ];

  const contactInfo = [
    {
      href: "tel:+201102300955",
      icon: <Phone size={16} />,
      label: "+20 110 230 0955",
      hoverColor: "hover:text-green-400",
      bgHover: "hover:bg-green-500/10",
      description: "اتصل الآن",
      available: true,
    },
    {
      href: "https://wa.me/201102300955",
      icon: <MessageCircle size={16} />,
      label: "01102300955",
      hoverColor: "hover:text-green-400",
      bgHover: "hover:bg-green-500/10",
      description: "واتساب",
      isExternal: true,
      available: true,
    },
    {
      href: "mailto:info@elmisterelfallah.com",
      icon: <Mail size={16} />,
      label: "البريد الإلكتروني",
      hoverColor: "hover:text-yellow-400",
      bgHover: "hover:bg-yellow-500/10",
      description: "راسلنا",
      available: true,
    },
  ];

  const stats = [
    { icon: <Users size={14} />, label: "عملاء راضون", value: "500+" },
    { icon: <Star size={14} />, label: "تقييم", value: "4.9" },
    { icon: <Zap size={14} />, label: "سنوات خبرة", value: "15+" },
  ];

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-sm border-b border-gray-700/50 backdrop-blur-sm transition-all duration-500 sticky top-0 z-50 overflow-hidden ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      dir="rtl"
      style={{ fontFamily: "Cairo, sans-serif" }}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic gradient background based on mouse position */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-green-900/10 animate-pulse"></div>

      <div className="relative  mx-auto px-4">
        {/* Main header row */}
        <div className="py-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Top row - Mobile responsive */}
            <div className="flex flex-row-reverse justify-between items-center flex-1">
              {/* Social links section */}
              <div className="flex flex-row-reverse items-center gap-2">
                {socialLinks.map((social, index) => (
                  <div key={index} className="group relative">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex no-underline items-center gap-2 p-3 leading-none rounded-full transition-all duration-300 ${social.hoverColor} ${social.bgHover} hover:scale-105 hover:shadow-lg hover:shadow-current/20 border border-transparent hover:border-current/20 relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="group-hover:animate-bounce relative z-10">
                        {social.icon}
                      </div>
                      <span className="font-medium hidden md:block relative z-10 text-white">
                        {social.label}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
              <div
                onClick={handleCopy}
                className="flex flex-col justify-center items-center md:flex-row gap-2 cursor-pointer hover:bg-purple-400/25 p-2 rounded-xl md:rounded-full"
              >
                <div className="text-white">
                  <span className="text-sm ml-4">
                    <Copy />
                  </span>
                  رقم التحويل{" "}
                </div>
                <div className="text-white" dir="ltr">
                  +201508465005
                </div>
              </div>
            </div>
          </div>
        </div>

      

       
      </div>

      {/* Copy Toast - fixed at bottom of screen */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]
              bg-white text-gray-900 shadow-xl rounded-full
              px-4 py-2 flex items-center gap-2 text-sm
              transition-all duration-200
              ${
                copied
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 pointer-events-none translate-y-2"
              }`}
        role="status"
        aria-live="polite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-green-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
        تم النسخ
      </div>
    </div>
  );
};

export default TopHeader;
