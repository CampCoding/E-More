import React, { useState, useRef, useEffect, useMemo } from "react";
import { RotateCcw, Eye, Star } from "lucide-react";

/**
 * Props:
 * - gameData: {
 *     leftColumn: Array<{ id:string, text:string, type:string|number }>,
 *     rightColumn: Array<{ id:string, text:string, type:string|number }>
 *   }
 * - onChange?: (connections: Array<{ leftData:any, rightData:any, isCorrect:boolean }>) => void
 * - defaultConnectionsData?:  // يمكن كائن واحد أو مصفوفة
 *     { leftData:{id:string}, rightData:{id:string} }
 *     | Array<{ leftData:{id:string}, rightData:{id:string} }>
 */
const LineMatchingGame = ({ gameData, onChange, defaultConnectionsData = [] }) => {
  // ====== Refs & geometry ======
  const boardRef = useRef(null);
  const svgRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  const getCenter = (el, svgRect) => {
    if (!el || !svgRect) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - svgRect.left,
      y: r.top + r.height / 2 - svgRect.top,
    };
  };

  const getPoint = (id, column) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return null;
    if (column === "left") return getCenter(leftRefs.current[id], svgRect);
    return getCenter(rightRefs.current[id], svgRect);
  };

  // ====== State ======
  const [connections, setConnections] = useState([]); // {leftId,rightId,isCorrect}
  const [currentPick, setCurrentPick] = useState(null); // {id,column}
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [pulsingItems, setPulsingItems] = useState(new Set());
  const [sparkles, setSparkles] = useState([]);

  const maxPairs = useMemo(
    () =>
      Math.min(
        gameData?.leftColumn?.length || 0,
        gameData?.rightColumn?.length || 0
      ),
    [gameData]
  );

  const isCorrectMatch = (leftItem, rightItem) =>
    leftItem?.type === rightItem?.type;

  const getCorrectMatch = (item, isFromLeft = true) => {
    if (isFromLeft) {
      return gameData.rightColumn.find((r) => r.type === item.type);
    } else {
      return gameData.leftColumn.find((l) => l.type === item.type);
    }
  };

  const createSparkles = (x, y) => {
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      delay: i * 0.1,
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) =>
        prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id))
      );
    }, 1500);
  };

  // ====== Helpers: Curved path (to avoid invisible straight lines) ======
  const pathData = (p1, p2) => {
    const dx = Math.abs(p2.x - p1.x);
    const cx = Math.max(40, Math.min(140, dx * 0.35)); // horizontal curvature
    const vy = (p2.y - p1.y) * 0.1; // tiny vertical bias

    const c1x = p1.x + cx;
    const c1y = p1.y + vy;
    const c2x = p2.x - cx;
    const c2y = p2.y - vy;

    return `M${p1.x},${p1.y} C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  };

  // ====== NEW: load defaultConnectionsData (supports single object or array) ======
  useEffect(() => {
    if (!gameData) return;

    const arr = Array.isArray(defaultConnectionsData)
      ? defaultConnectionsData
      : defaultConnectionsData
      ? [defaultConnectionsData]
      : [];

    if (!arr.length) return;

    const leftIds = new Set(gameData.leftColumn.map((i) => i.id));
    const rightIds = new Set(gameData.rightColumn.map((i) => i.id));

    const takenLeft = new Set();
    const takenRight = new Set();
    const sanitized = [];

    for (const item of arr) {
      // نحاول قراءة id من أكثر من احتمال بحال تغيّر الصيغة
      const leftId =
        item?.leftId || item?.left?.id || item?.leftData?.id || item?.left_id;
      const rightId =
        item?.rightId ||
        item?.right?.id ||
        item?.rightData?.id ||
        item?.right_id;

      if (!leftId || !rightId) continue;
      if (!leftIds.has(leftId) || !rightIds.has(rightId)) continue;
      if (takenLeft.has(leftId) || takenRight.has(rightId)) continue; // one-to-one

      const lObj = gameData.leftColumn.find((l) => l.id === leftId);
      const rObj = gameData.rightColumn.find((r) => r.id === rightId);
      const isCorrect = isCorrectMatch(lObj, rObj);

      sanitized.push({ leftId, rightId, isCorrect });
      takenLeft.add(leftId);
      takenRight.add(rightId);
    }

    if (sanitized.length) {
      setConnections(sanitized);
    }
  }, [gameData]);

  // ====== Handlers ======
  const handleItemClick = (item, column) => {
    if (showAnswers) return;

    // pulse
    setPulsingItems((prev) => new Set([...prev, item.id]));
    setTimeout(() => {
      setPulsingItems((prev) => {
        const n = new Set(prev);
        n.delete(item.id);
        return n;
      });
    }, 600);

    if (!currentPick) {
      setCurrentPick({ id: item.id, column });
      return;
    }

    if (currentPick.column === column) {
      setCurrentPick({ id: item.id, column });
      return;
    }

    // pair
    const leftId = column === "left" ? item.id : currentPick.id;
    const rightId = column === "right" ? item.id : currentPick.id;

    const leftItem = gameData.leftColumn.find((l) => l.id === leftId);
    const rightItem = gameData.rightColumn.find((r) => r.id === rightId);
    const isCorrect = isCorrectMatch(leftItem, rightItem);

    // one-to-one: حذف أي وصلة تستخدم نفس الطرفين
    const filtered = connections.filter(
      (c) => c.leftId !== leftId && c.rightId !== rightId
    );

    const newConn = { leftId, rightId, isCorrect };
    setConnections([...filtered, newConn]);

    const p1 = getPoint(leftId, "left");
    const p2 = getPoint(rightId, "right");
    if (p1 && p2 && isCorrect) {
      createSparkles(p1.x + (p2.x - p1.x) / 2, p1.y + (p2.y - p1.y) / 2);
    }

    setCurrentPick(null);
  };

  // score & completion
  useEffect(() => {
    const correct = connections.filter((c) => c.isCorrect).length;
    setScore(correct);
    setGameComplete(correct === maxPairs && connections.length === maxPairs);
  }, [connections, maxPairs]);

  // notify parent
  useMemo(() => {
    if (!onChange) return;
    const mapped = connections.map((c) => {
      const leftData = gameData.leftColumn.find((l) => l.id === c.leftId);
      const rightData = gameData.rightColumn.find((r) => r.id === c.rightId);
      return { leftData, rightData, isCorrect: c.isCorrect };
    });
    onChange(mapped);
  }, [connections]);

  // reset
  const resetGame = () => {
    setConnections([]);
    setCurrentPick(null);
    setShowAnswers(false);
    setScore(0);
    setGameComplete(false);
    setSparkles([]);
  };

  // answers
  const correctConnections = useMemo(() => {
    return gameData.leftColumn.map((l) => {
      const r = getCorrectMatch(l, true);
      return { leftId: l.id, rightId: r.id, isCorrect: true };
    });
  }, [gameData]);

  // re-render on resize
  const [, force] = useState(0);
  useEffect(() => {
    const onResize = () => force((x) => x + 1);
    window.addEventListener("resize", onResize);
    const obs = new ResizeObserver(() => force((x) => x + 1));
    if (boardRef.current) obs.observe(boardRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="bg-white relative overflow-hidden">
      {/* background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-20"></div>
          </div>
        ))}
      </div>

      {/* sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: s.x,
            top: s.y,
            animationDelay: `${s.delay}s`,
            animationDuration: "1s",
          }}
        >
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
        </div>
      ))}

      <div className="mx-auto w-full relative z-10">
        <div className="bg-gradient-to-br rounded-3xl from-blue-900 via-purple-900 to-indigo-900 backdrop-blur-md shadow-2xl p-3 md:p-8">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <h1 className="text-lg md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                لعبة توصيل العناصر
              </h1>
            </div>
            <p className="text-base md:text-xl text-blue-100 mb-6">
              صِل العناصر المرتبطة وشاهد السحر يحدث!
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              {/* <div
                className={`px-6 py-3 rounded-full font-bold text-sm md:text-lg transition-all duration-500 ${
                  gameComplete
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-bounce"
                    : "bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white"
                } backdrop-blur-sm border border-white/30`}
              >
                <span>
                  النقاط: {score}/{maxPairs}
                </span>
                {gameComplete && <span className="ml-2">🎉</span>}
              </div> */}

              <button
                onClick={resetGame}
                className="text-sm md:text-lg group px-6 py-3 bg-gradient-to-r from-[#011294] to-blue-600 hover:from-blue-600 hover:to-[#011294] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border border-white/30"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                إعادة تعيين اللعبة
              </button>

              {/* <button
                onClick={() => {
                  setShowAnswers((s) => !s);
                  setCurrentPick(null);
                }}
                className={`text-sm md:text-lg group px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border border-white/30 ${
                  showAnswers
                    ? "bg-gradient-to-r from-[#EC1C24] to-red-600 hover:from-red-600 hover:to-[#EC1C24] text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white"
                }`}
              >
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {showAnswers ? "إخفاء الإجابات" : " عرض الإجابات"}
              </button> */}
            </div>
          </div>

          {/* board */}
          <div dir="ltr" className="relative" ref={boardRef}>
            <div className="flex mx-auto flex-row flex-nowrap items-center justify-between gap-12">
              {/* left column */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  Items
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </h3>

                {gameData.leftColumn.map((item, index) => {
                  const isConnected = connections.some((c) => c.leftId === item.id);
                  const isSelected =
                    currentPick?.id === item.id && currentPick?.column === "left";
                  const isPulsing = pulsingItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      ref={(el) => (leftRefs.current[item.id] = el)}
                      onClick={() => handleItemClick(item, "left")}
                      className={`group relative p-3 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                        isPulsing ? "animate-pulse scale-110" : ""
                      } ${
                        isSelected
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 shadow-2xl shadow-yellow-400/30 scale-105"
                          : isConnected
                          ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-400/20 shadow-lg shadow-green-400/30"
                          : "border-white/30 bg-white/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-purple-400/20 hover:shadow-xl hover:shadow-blue-400/30"
                      } backdrop-blur-sm`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm md:text-xl font-normal md:font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                          {item.text}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  );
                })}
              </div>

              {/* right column */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  Definitions
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </h3>

                {gameData.rightColumn.map((item, index) => {
                  const isConnected = connections.some((c) => c.rightId === item.id);
                  const isSelected =
                    currentPick?.id === item.id && currentPick?.column === "right";
                  const isPulsing = pulsingItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      ref={(el) => (rightRefs.current[item.id] = el)}
                      onClick={() => handleItemClick(item, "right")}
                      className={`group relative p-3 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                        isPulsing ? "animate-pulse scale-110" : ""
                      } ${
                        isSelected
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 shadow-2xl shadow-yellow-400/30 scale-105"
                          : isConnected
                          ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-400/20 shadow-lg shadow-green-400/30"
                          : "border-white/30 bg-white/10 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 hover:shadow-xl hover:shadow-purple-400/30"
                      } backdrop-blur-sm`}
                      style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm md:text-xl font-normal md:font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                          {item.text}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/0 via-pink-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SVG paths (curved + outline) */}
            <svg
              ref={svgRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: showAnswers ? "#22c55e" : "white", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: showAnswers ? "#10b981" : "white", stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="incorrectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: showAnswers ? "#EC1C24" : "white", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: showAnswers ? "#dc2626" : "white", stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {(showAnswers ? correctConnections : connections).map((c, idx) => {
                const p1 = getPoint(c.leftId, "left");
                const p2 = getPoint(c.rightId, "right");
                if (!p1 || !p2) return null;

                const stroke =
                  showAnswers
                    ? "url(#correctGradient)"
                    : c.isCorrect
                    ? "url(#correctGradient)"
                    : "url(#incorrectGradient)";

                const d = pathData(p1, p2);

                return (
                  <g key={idx} className="animate-pulse">
                    {/* Outline خلفي باهت ليزود الوضوح */}
                    <path
                      d={d}
                      stroke="white"
                      strokeOpacity="1"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* المسار الفعلي (ملوّن + Glow) */}
                    <path
                      d={d}
                      stroke={stroke}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* status */}
          {/* <div className="mt-8 text-center space-y-4">
            {gameComplete && !showAnswers && (
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border-2 border-green-400 text-white px-8 py-6 rounded-2xl text-xl font-bold animate-bounce shadow-2xl shadow-green-400/30">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 animate-spin" fill="currentColor" />
                  🎉 AMAZING! Perfect Score! You're a Matching Master! 🎉
                  <Star className="w-6 h-6 text-yellow-400 animate-spin" fill="currentColor" />
                </div>
              </div>
            )}

            {showAnswers && (
              <div className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 backdrop-blur-sm border-2 border-blue-400 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-blue-400/20">
                📚 مفعل: عرض الإجابات الصحيحة - يتم عرض جميع التوصيلات الصحيحة
              </div>
            )}

            {currentPick && (
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border-2 border-yellow-400 text-white px-8 py-4 rounded-2xl font-semibold animate-pulse shadow-xl shadow-yellow-400/20">
                ⚡ اختر عنصراً من العمود المقابل لإكمال التوصيل!
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LineMatchingGame;
