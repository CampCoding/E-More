import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  MessageCircle,
  ArrowRight,
  Copy,
  CheckCircle2,
  Star,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Users,
} from "lucide-react";

const ContactNumbers = () => {
  const [copiedNumber, setCopiedNumber] = useState("");
  const [visibleCards, setVisibleCards] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Staggered card animations
  useEffect(() => {
    const timeouts = [];
    [0, 150, 300, 450, 600].forEach((delay, index) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index]);
        }, delay)
      );
    });

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  const copyToClipboard = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(""), 3000);
    } catch (err) {
      console.error("Failed to copy number:", err);
    }
  };

  const transferNumbers = [
    {
      number: "01102300955",
      label: "تحويل ودعم فني",
      priority: "high",
      path: "https://wa.me/01102300955",
    },
    { number: "01508465005", label: "Secondary Transfer", priority: "medium" },
  ];

  const contactNumbers = [
    {
      number: "01102300933",
      label: "Customer Service",
      priority: "high",
      available: "24/7",
    },
    {
      number: "01508275005",
      label: "Technical Support",
      priority: "high",
      available: "Business Hours",
    },
    {
      number: "01507635005",
      label: "General Inquiries",
      priority: "medium",
      available: "Business Hours",
    },
  ];

  const FloatingOrb = ({
    delay,
    size = "w-32 h-32",
    color = "bg-blue-400/20",
  }) => (
    <div
      className={`fixed ${size} ${color} rounded-full blur-3xl animate-float opacity-30`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${4 + Math.random() * 2}s`,
      }}
    ></div>
  );

  const NumberCard = ({ data, index, icon: Icon, delay, type }) => {
    const isVisible = visibleCards.includes(index);
    const isCopied = copiedNumber === data.number;
    const isActive = activeCard === index;

    const priorityColors = {
      high: "from-red-500 to-orange-500",
      medium: "from-blue-500 to-purple-500",
      low: "from-green-500 to-teal-500",
    };

    return (
      <div
        className={`group relative overflow-hidden rounded-3xl shadow-xl  transition-all duration-700 cursor-pointer ${
          isVisible
            ? "opacity-100 translate-y-0 rotate-0"
            : "opacity-0 translate-y-12 rotate-6"
        } ${isActive ? "scale-105 z-10" : ""}`}
        style={{
          transitionDelay: `${delay}ms`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onMouseEnter={() => {
          setActiveCard(index);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setActiveCard(null);
          setIsHovering(false);
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              priorityColors[data.priority]
            } opacity-5`}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${
                priorityColors[data.priority]
              } rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animation: isActive ? "float 3s ease-in-out infinite" : "none",
              }}
            ></div>
          ))}
        </div>

        {/* Priority indicator */}
        <div className="absolute top-4 right-4 flex items-center space-x-1">
          {data.priority === "high" && (
            <div className="flex space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
              <Star
                className="w-4 h-4 text-yellow-500 fill-current animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          )}
          {data.priority === "medium" && (
            <Star className="w-4 h-4 text-blue-500 fill-current animate-pulse" />
          )}
        </div>

        <div className="relative p-8">
          {/* Icon with enhanced animation */}
          <div
            className={`relative flex items-center justify-center w-16 h-16 bg-gradient-to-br ${
              priorityColors[data.priority]
            } rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}
          >
            <Icon className="w-8 h-8 text-white drop-shadow-sm" />

            {/* Icon glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                priorityColors[data.priority]
              } rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
            ></div>
          </div>

          {/* Number with enhanced typography */}
          <div className="relative mb-4">
            <p className="text-3xl font-black text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 font-mono tracking-wider">
              {data.number}
            </p>

            {/* Underline animation */}
            <div
              className={`h-1 bg-gradient-to-r ${
                priorityColors[data.priority]
              } rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-2`}
            ></div>
          </div>

          {/* Label and availability */}
          <div className="space-y-2 mb-6">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {data.label}
            </p>
            {data.available && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{data.available}</span>
              </div>
            )}
          </div>

          {/* Enhanced copy button */}
          <button
            onClick={() => copyToClipboard(data.number)}
            className={`group/btn relative w-full py-3 px-4 rounded-xl transition-all duration-300 overflow-hidden ${
              isCopied
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                : "bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-gray-700 hover:text-white shadow-sm hover:shadow-lg"
            }`}
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center justify-center space-x-2">
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span className="font-semibold">تم النسخ بنجاح!</span>
                  <Sparkles className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                  <span className="font-semibold">انقر للنسخ</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Glass shine effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

        {/* Hover glow */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${
            priorityColors[data.priority]
          } rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
        ></div>
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle, icon: Icon, description }) => (
    <div className="text-center mb-16 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8 shadow-2xl relative overflow-hidden group">
          <Icon className="w-12 h-12 text-white drop-shadow-sm relative z-10" />

          {/* Icon background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
        </div>

        <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-2xl text-gray-600 font-light mb-4">{subtitle}</p>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        {/* Animated decorative elements */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div
            className="w-8 h-1 bg-gradient-to-l from-purple-500 to-transparent rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
        overflow: "hidden",
        borderTop: "3px dotted rgb(129, 68, 179)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic background with mouse interaction */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-1000"
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
            : "transparent",
        }}
      ></div>

      {/* Floating background orbs */}
      <FloatingOrb delay={0} size="w-64 h-64" color="bg-blue-400/10" />
      <FloatingOrb delay={2} size="w-48 h-48" color="bg-purple-400/10" />
      <FloatingOrb delay={4} size="w-32 h-32" color="bg-pink-400/10" />
      <FloatingOrb delay={1} size="w-96 h-96" color="bg-indigo-400/5" />

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Transfer Numbers Section */}
          <section className="mb-24">
            <SectionHeader
              title="أرقام التحويل"
              subtitle="Transfer Numbers"
              icon={Shield}
              description="أرقام موثوقة وآمنة لجميع عمليات التحويل المالي"
            />

            <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {transferNumbers.map((data, index) => (
                <NumberCard
                  key={data.number}
                  data={data}
                  index={index}
                  icon={index === 0 ? Shield : Zap}
                  delay={index * 200}
                  type="transfer"
                />
              ))}
            </div>
          </section>

          {/* Enhanced Contact Numbers Section */}
          <section>
            <SectionHeader
              title="    أرقام التواصل  و الاستفسار"
              subtitle="Contact Numbers"
              icon={Users}
              description="فريق خدمة العملاء جاهز لمساعدتك في أي وقت"
            />

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {contactNumbers.map((data, index) => (
                <NumberCard
                  key={data.number}
                  data={data}
                  index={index + 2}
                  icon={
                    index === 0 ? Phone : index === 1 ? MessageCircle : Users
                  }
                  delay={(index + 2) * 200}
                  type="contact"
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }

        @keyframes animate-float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-float {
          animation: animate-float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactNumbers;
