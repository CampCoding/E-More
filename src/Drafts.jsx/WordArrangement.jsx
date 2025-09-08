import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  RotateCcw,
  Eye,
  Check,
  X,
  Zap,
  Star,
  Shuffle,
  Type,
  AlignLeft,
} from "lucide-react";

const WordArrangementPuzzle = ({
  id,
  gameType,
  correctSentence,
  scrambledWords,
  selectedQuestion,
  onChange,
  defaultArranged = [], // ✅ new prop
  translationText = "", // ✅ optional Arabic text to display
}) => {
  useEffect(() => {
    console.log("selectedQuestion", selectedQuestion);
  }, [selectedQuestion]);

  // Game data - both words and sentences
  const gameData = [
    // Character arrangement puzzles
    {
      id: 1,
      type: "character",
      correctSentence: "book",
      words: ["b", "o", "o", "k"],
      scrambledWords: ["k", "b", "o", "o"],
      translation: "book",
    },
    {
      id: 2,
      type: "character",
      correctSentence: "school",
      words: ["s", "c", "h", "o", "o", "l"],
      scrambledWords: ["l", "o", "c", "s", "h", "o"],
      translation: "school",
    },
    {
      id: 3,
      type: "character",
      correctSentence: "hello",
      words: ["h", "e", "l", "l", "o"],
      scrambledWords: ["o", "l", "e", "h", "l"],
      translation: "hello",
    },

    // Word arrangement puzzles
    {
      id: 4,
      type: "word",
      correctSentence: "The sun rises in the morning",
      words: ["The", "sun", "rises", "in", "the", "morning"],
      scrambledWords: ["morning", "the", "in", "rises", "sun", "The"],
      translation: "The sun rises in the morning",
    },
    {
      id: 5,
      type: "word",
      correctSentence: "The cat plays with the small ball",
      words: ["The", "cat", "plays", "with", "the", "small", "ball"],
      scrambledWords: ["small", "ball", "the", "with", "cat", "The", "plays"],
      translation: "The cat plays with the small ball",
    },
    {
      id: 6,
      type: "word",
      correctSentence: "Birds fly in the blue sky",
      words: ["Birds", "fly", "in", "the", "blue", "sky"],
      scrambledWords: ["blue", "sky", "fly", "in", "Birds", "the"],
      translation: "Birds fly in the blue sky",
    },
    {
      id: 7,
      type: "character",
      correctSentence: "garden",
      words: ["g", "a", "r", "d", "e", "n"],
      scrambledWords: ["n", "a", "r", "g", "e", "d"],
      translation: "garden",
    },
    {
      id: 8,
      type: "word",
      correctSentence: "Children play in the beautiful garden",
      words: ["Children", "play", "in", "the", "beautiful", "garden"],
      scrambledWords: ["beautiful", "garden", "in", "Children", "the", "play"],
      translation: "Children play in the beautiful garden",
    },
  ];

  const [arrangedWords, setArrangedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [draggedWord, setDraggedWord] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [dropZoneActive, setDropZoneActive] = useState(null);

  // Enhanced touch handling states
  const [touchStart, setTouchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // New state for rearrangement
  const [rearrangeDropIndex, setRearrangeDropIndex] = useState(null);

  const touchThreshold = 5; // Minimum movement to start drag

  const currentPuzzle = useMemo(() => {
    return {
      id,
      gameType: gameType,
      correctSentence: correctSentence,
      words: correctSentence.split(" "),
      scrambledWords,
    };
  }, [id, gameType, correctSentence, scrambledWords]);

  // Initialize game
  useEffect(() => {
    resetLevel();
  }, [currentPuzzle.correctSentence, currentPuzzle.scrambledWords]);

  useEffect(() => {
    onChange?.(arrangedWords);
  }, [arrangedWords, onChange]);

  // Check if arrangement is correct
  useEffect(() => {
    const currentResult =
      currentPuzzle.gameType == "character"
        ? arrangedWords.join("")
        : arrangedWords.join(" ");
    const isCorrect = currentResult === currentPuzzle.correctSentence;
    setLevelComplete(isCorrect);
  }, [
    arrangedWords,
    currentPuzzle.correctSentence,
    currentPuzzle.gameType,
    levelComplete,
  ]);

  const multisetSubtract = (sourceArr, usedArr) => {
    const counts = new Map();
    for (const w of usedArr) counts.set(w, (counts.get(w) || 0) + 1);
    const result = [];
    for (const w of sourceArr) {
      const c = counts.get(w) || 0;
      if (c > 0) {
        counts.set(w, c - 1); // استهلك تكرار واحد
      } else {
        result.push(w);
      }
    }
    return result;
  };

  // Reset current level
  const resetLevel = () => {
    if (defaultArranged.length > 0) {
      // ✅ use passed default data
      setArrangedWords([...defaultArranged]);
      setAvailableWords(
        multisetSubtract([...currentPuzzle.scrambledWords], defaultArranged)
      );
    } else {
      // ✅ fallback to normal behavior
      setArrangedWords([]);
      setAvailableWords([...currentPuzzle.scrambledWords]);
    }

    setLevelComplete(false);
    setShowAnswers(false);
    setSparkles([]);
    setDraggedWord(null);
    setDropZoneActive(null);
    setRearrangeDropIndex(null);
    setIsDragging(false);
  };

  // Reset entire game
  const resetGame = () => {
    resetLevel();
  };

  // Shuffle available words
  const shuffleWords = () => {
    const allWords = [...availableWords, ...arrangedWords];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setArrangedWords([]);
  };

  // Toggle show answers
  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
    if (!showAnswers) {
      setArrangedWords([...currentPuzzle.words]);
      setAvailableWords([]);
    } else {
      resetLevel();
    }
  };

  // DESKTOP DRAG AND DROP HANDLERS
  const handleDragStart = (e, word, index, from) => {
    if (showAnswers) {
      e.preventDefault();
      return;
    }
    setDraggedWord(word);
    setDraggedIndex(index);
    setDraggedFrom(from);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");

    // Add visual feedback
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDropZoneActive(null);
    setRearrangeDropIndex(null);
  };

  const handleDragOver = (e, zone, targetIndex = null) => {
    e.preventDefault();
    e.stopPropagation(); // 👈 مهم

    e.dataTransfer.dropEffect = "move";
    setDropZoneActive(zone);

    // Handle rearrangement within arranged words
    if (
      zone === "arranged" &&
      draggedFrom === "arranged" &&
      targetIndex !== null
    ) {
      setRearrangeDropIndex(targetIndex);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the drop zone
    e.stopPropagation(); // 👈 مهم

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropZoneActive(null);
      setRearrangeDropIndex(null);
    }
  };

  const handleDrop = (e, targetZone, targetIndex = null) => {
    e.preventDefault();
    e.stopPropagation(); // 👈 prevent bubbling
    setDropZoneActive(null);
    setRearrangeDropIndex(null);

    if (!draggedWord || showAnswers) return;

    // move-inside arranged
    if (
      targetZone === "arranged" &&
      draggedFrom === "arranged" &&
      targetIndex !== null
    ) {
      performWordRearrangement(targetIndex);
      resetDragState(); // 👈 clear immediately
      return;
    }

    // move between zones (with optional insert at targetIndex)
    if (draggedFrom !== targetZone) {
      performWordMove(targetZone, targetIndex); // 👈 pass index
      resetDragState(); // 👈 clear immediately
    }
  };

  // MOBILE TOUCH HANDLERS
  const handleTouchStart = (e, word, index, from) => {
    if (showAnswers) return;

    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      elementX: rect.left,
      elementY: rect.top,
    });
    setDraggedWord(word);
    setDraggedIndex(index);
    setDraggedFrom(from);
    setIsDragging(false);

    // Calculate offset from touch point to element center
    setDragOffset({
      x: touch.clientX - (rect.left + rect.width / 2),
      y: touch.clientY - (rect.top + rect.height / 2),
    });

    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!draggedWord || showAnswers || !touchStart) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    if (!isDragging && (deltaX > touchThreshold || deltaY > touchThreshold)) {
      setIsDragging(true);
    }

    if (isDragging) {
      setDragPosition({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      });

      // Check drop zones
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      const arrangedZone = elements.find(
        (el) => el.dataset?.dropzone === "arranged"
      );
      const availableZone = elements.find(
        (el) => el.dataset?.dropzone === "available"
      );
      const arrangedWordElement = elements.find(
        (el) => el.dataset?.arrangedIndex
      );

      if (arrangedZone && draggedFrom !== "arranged") {
        setDropZoneActive("arranged");
      } else if (availableZone && draggedFrom !== "available") {
        setDropZoneActive("available");
      } else if (arrangedWordElement && draggedFrom === "arranged") {
        setDropZoneActive("arranged");
        setRearrangeDropIndex(
          parseInt(arrangedWordElement.dataset.arrangedIndex)
        );
      } else {
        setDropZoneActive(null);
        setRearrangeDropIndex(null);
      }
    }

    e.preventDefault();
  };

const handleTouchEnd = (e) => {
  if (!isDragging || !draggedWord || showAnswers) { resetDragState(); return; }

  const touch = e.changedTouches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const arrangedWordElement = elements.find(el => el.dataset?.arrangedIndex);
  const arrangedZone = elements.find(el => el.dataset?.dropzone === "arranged");
  const availableZone = elements.find(el => el.dataset?.dropzone === "available");

  if (arrangedWordElement) {
    const idx = parseInt(arrangedWordElement.dataset.arrangedIndex);
    if (draggedFrom === "arranged") {
      performWordRearrangement(idx);
    } else {
      performWordMove("arranged", idx); // 👈 insert at index
    }
    resetDragState();
    return;
  }

  let targetZone = null;
  if (arrangedZone && draggedFrom !== "arranged") targetZone = "arranged";
  if (availableZone && draggedFrom !== "available") targetZone = "available";
  if (targetZone) performWordMove(targetZone, null);

  resetDragState();
};


  // Helper function to reset drag state
  const resetDragState = () => {
    setDraggedWord(null);
    setDraggedIndex(null);
    setDraggedFrom(null);
    setIsDragging(false);
    setDropZoneActive(null);
    setRearrangeDropIndex(null);
    setTouchStart(null);
    setDragPosition({ x: 0, y: 0 });
  };

  const performWordMove = (targetZone, insertIndex = null) => {
    if (targetZone === "arranged" && draggedFrom === "available") {
      // remove from available by index
      setAvailableWords((prev) => prev.filter((_, i) => i !== draggedIndex));
      setArrangedWords((prev) => {
        const next = [...prev];
        if (
          insertIndex === null ||
          insertIndex < 0 ||
          insertIndex > next.length
        ) {
          next.push(draggedWord); // fallback append
        } else {
          next.splice(insertIndex, 0, draggedWord); // 👈 insert at drop index
        }
        return next;
      });
    } else if (targetZone === "available" && draggedFrom === "arranged") {
      setArrangedWords((prev) => prev.filter((_, i) => i !== draggedIndex));
      setAvailableWords((prev) => [...prev, draggedWord]);
    }
  };

  // Helper function to perform word rearrangement within arranged words
  const performWordRearrangement = (targetIndex) => {
    if (draggedIndex === targetIndex) return;
    const newArrangedWords = [...arrangedWords];
    const [draggedItem] = newArrangedWords.splice(draggedIndex, 1);
    newArrangedWords.splice(targetIndex, 0, draggedItem);

    setArrangedWords(newArrangedWords);
  };

  // CLICK-TO-ARRANGE HANDLERS
  const handleClickAvailable = (word, index) => {
    if (showAnswers) return;
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    setArrangedWords((prev) => [...prev, word]);
  };

  const handleClickArranged = (index) => {
    if (showAnswers) return;
    setArrangedWords((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      setAvailableWords((avail) => [...avail, moved]);
      return next;
    });
  };

  // Get the display result
  const getDisplayResult = () => {
    if (currentPuzzle.gameType === "character") {
      return arrangedWords.join("");
    } else {
      return arrangedWords.join(" ");
    }
  };

  // Get puzzle type info
  const getPuzzleTypeInfo = () => {
    if (currentPuzzle.gameType === "character") {
      return {
        icon: Type,
        title: "لعبة تسميع الكلمات (الأحرف)",
        subtitle: "رتب الأحرف لتكوين كلمة صحيحة",
        arrangedTitle: "الكلمة المرتبة",
        availableTitle: "الأحرف المتاحة",
        emptyMessage: "اسحب الأحرف هنا لترتيب الكلمة...",
        allUsedMessage: "جميع الأحرف مستخدمة!",
        separator: "",
      };
    } else {
      return {
        icon: AlignLeft,
        title: "لعبة تسميع الكلمات (الجمل)",
        subtitle: "رتب الكلمات لتكوين جملة صحيحة",
        arrangedTitle: "الجملة المرتبة",
        availableTitle: "الكلمات المتاحة",
        emptyMessage: "اسحب الكلمات هنا لترتيب الجملة...",
        allUsedMessage: "جميع الكلمات مستخدمة!",
        separator: " ",
      };
    }
  };

  const typeInfo = getPuzzleTypeInfo();

  // Arabic text source (props override, then selectedQuestion fields, else from sample)
  const arabicHint =
    translationText ;

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
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

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: "1s",
          }}
        >
          <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
        </div>
      ))}

      {/* Floating dragged word for mobile */}
      {isDragging && draggedWord && (
        <div
          className="fixed pointer-events-none z-50 px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 backdrop-blur-sm shadow-2xl animate-bounce"
          style={{
            left: dragPosition.x - 50,
            top: dragPosition.y - 25,
            transform: "rotate(5deg) scale(1.1)",
          }}
        >
          <span className="text-sm md:text-lg font-bold text-white">
            {draggedWord}
          </span>
        </div>
      )}

      <div className="mx-auto   relative z-10">
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900  backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {typeInfo.title}
              </h1>
            </div>

            <p className="text-base md:text-xl text-blue-100 mb-4">
              {typeInfo.subtitle}
            </p>

            {arabicHint && (
              <div dir="rtl" className="mt-2 mb-2">
                <div className="inline-block max-w-[90%] px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-yellow-200 text-sm md:text-lg font-semibold shadow-md">
                  {arabicHint}
                </div>
              </div>
            )}

            {/* Level and Score Display */}

            {/* Controls */}
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
              <button
                onClick={resetGame}
                className="text-xs md:text-lg group px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-[#011294] to-blue-600 hover:from-blue-600 hover:to-[#011294] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border border-white/30"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-500" />
                إعادة تعيين
              </button>

              <button
                onClick={shuffleWords}
                disabled={showAnswers}
                className="text-xs md:text-lg group px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-500" />
                خلط{" "}
                {currentPuzzle.gameType === "character" ? "الأحرف" : "الكلمات"}
              </button>

              {/* <button
                onClick={toggleShowAnswers}
                className={`text-xs md:text-lg group px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 border border-white/30 ${
                  showAnswers
                    ? "bg-gradient-to-r from-[#EC1C24] to-red-600 hover:from-red-600 hover:to-[#EC1C24] text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white"
                }`}
              >
                <Eye className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                {showAnswers ? "إخفاء الإجابة" : "عرض الإجابة"}
              </button> */}
            </div>
          </div>

          {/* Game Area */}
          <div className="space-y-8">
            {/* Arranged Words Area (Sentence/Word Construction) */}
            <div
              dir="ltr"
              className={`bg-white/10 backdrop-blur-sm border-2 border-dashed rounded-2xl p-6 min-h-[120px] transition-all duration-300 ${
                dropZoneActive === "arranged"
                  ? "border-green-400 bg-green-400/20 shadow-2xl shadow-green-400/30 scale-105"
                  : "border-white/30"
              }`}
              data-dropzone="arranged"
              onDragOver={(e) => handleDragOver(e, "arranged")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "arranged")}
            >
              <h3 className="text-lg md:text-xl font-bold text-center text-white mb-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                {typeInfo.arrangedTitle}
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </h3>

              <div
                className={`flex flex-wrap justify-center gap-3 min-h-[60px] items-center ${
                  currentPuzzle.gameType === "character" ? "gap-1" : "gap-3"
                }`}
              >
                {arrangedWords.length === 0 ? (
                  <div
                    dir="rtl"
                    className="text-white/60 text-center italic text-sm md:text-lg"
                  >
                    {typeInfo.emptyMessage}
                  </div>
                ) : (
                  arrangedWords.map((word, index) => {
                    const isCorrectPosition =
                      showAnswers || currentPuzzle.words[index] === word;
                    const isDraggingThis =
                      isDragging &&
                      draggedWord === word &&
                      draggedIndex === index &&
                      draggedFrom === "arranged";
                    const isDropTarget =
                      rearrangeDropIndex === index &&
                      draggedFrom === "arranged";

                    return (
                      <div
                        key={`arranged-${word}-${index}`}
                        data-arranged-index={index}
                        draggable={false}
                        onClick={() => handleClickArranged(index)}
                        className={`group relative cursor-pointer ${
                          currentPuzzle.gameType === "character"
                            ? "px-3 py-2 md:px-4 md:py-3 text-lg md:text-2xl"
                            : "px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg"
                        } rounded-xl border-2 transition-all duration-300 transform hover:scale-105 select-none touch-manipulation ${
                          isDraggingThis ? "opacity-30 scale-90" : ""
                        } ${
                          isDropTarget
                            ? "ring-4 ring-blue-400 ring-opacity-50 scale-110"
                            : ""
                        } ${
                          // i made it true to to hide the wrong answers
                          isCorrectPosition || true
                            ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-400/20 shadow-lg shadow-green-400/30"
                            : "border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 shadow-lg shadow-yellow-400/30"
                        } backdrop-blur-sm`}
                      >
                        <span
                          className={`font-bold text-white group-hover:text-yellow-300 transition-colors duration-300`}
                        >
                          {word}
                        </span>

                        {/* Position indicator */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>

                        {/* Rearrangement drop indicator */}
                        {isDropTarget && (
                          <div className="absolute inset-0 rounded-xl border-2 border-dashed border-blue-400 bg-blue-400/20 animate-pulse"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Available Words/Characters Area */}
            <div
              className={`bg-white/10 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 ${
                dropZoneActive === "available"
                  ? "border-purple-400 bg-purple-400/20 shadow-2xl shadow-purple-400/30 scale-105"
                  : "border-white/30"
              }`}
              data-dropzone="available"
              onDragOver={(e) => handleDragOver(e, "available")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "available")}
            >
              <h3 className="text-lg md:text-xl font-bold text-center text-white mb-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                {typeInfo.availableTitle}
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </h3>

              <div
                className={`flex flex-wrap justify-center gap-3 min-h-[60px] items-center ${
                  currentPuzzle.gameType === "character" ? "gap-2" : "gap-3"
                }`}
              >
                {availableWords.length === 0 ? (
                  <div className="text-white/60 text-center italic text-sm md:text-lg">
                    {typeInfo.allUsedMessage}
                  </div>
                ) : (
                  availableWords.map((word, index) => {
                    const isDraggingThis =
                      isDragging &&
                      draggedWord === word &&
                      draggedIndex === index &&
                      draggedFrom === "available";

                    return (
                      <div
                        key={`available-${word}-${index}`}
                        draggable={false}
                        onClick={() => handleClickAvailable(word, index)}
                        className={`group relative cursor-pointer ${
                          currentPuzzle.gameType === "character"
                            ? "px-3 py-2 md:px-4 md:py-3 text-lg md:text-2xl"
                            : "px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg"
                        } rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 select-none touch-manipulation ${
                          isDraggingThis ? "opacity-30 scale-90" : ""
                        } border-white/30 bg-white/10 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 hover:shadow-xl hover:shadow-purple-400/30 backdrop-blur-sm`}
                      >
                        <span className="font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                          {word}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {arrangedWords.length > 0 && (
              <div
                dir="rtl"
                className="mt-4  text-center text-yellow-200 font-bold text-lg md:text-xl"
              >
                النتيجة الحالية: {"  "} "{getDisplayResult()}"
              </div>
            )}

            {/* Enhanced Help Text */}
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-sm border border-cyan-400 text-white px-6 py-3 rounded-2xl text-center text-sm md:text-base">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <strong>كيفية اللعب</strong>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
                <span>
                  🖱️ <strong>طريقة اللعب:</strong> اسحب وأفلت
                </span>
                <span>
                  🔄 <strong>إعادة ترتيب:</strong> اسحب العناصر المرتبة لتغيير
                  ترتيبها
                </span>
                <span>
                  ✨ <strong>الهدف:</strong>{" "}
                  {currentPuzzle.gameType === "character"
                    ? "رتب الأحرف لتكوين كلمة"
                    : "رتب الكلمات لتكوين جملة"}
                </span>
              </div>
            </div>
          </div>

          {/* Game Status */}
          {/* <div className="mt-8 text-center space-y-4">
            {levelComplete && !showAnswers && (
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border-2 border-green-400 text-white px-8 py-6 rounded-2xl text-base md:text-xl font-bold animate-bounce shadow-2xl shadow-green-400/30">
                <div className="flex items-center justify-center gap-2">
                  <Star
                    className="w-6 h-6 text-yellow-400 animate-spin"
                    fill="currentColor"
                  />
                  🎉 ممتاز!{" "}
                  {currentPuzzle.gameType === "character"
                    ? "الكلمة صحيحة"
                    : "الجملة صحيحة"}
                  ! 🎉
                  <Star
                    className="w-6 h-6 text-yellow-400 animate-spin"
                    fill="currentColor"
                  />
                </div>
              </div>
            )}

            {showAnswers && (
              <div className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 backdrop-blur-sm border-2 border-blue-400 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-blue-400/20">
                <div className="flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5 text-blue-300" />
                  عرض الإجابة الصحيحة
                  <Eye className="w-5 h-5 text-blue-300" />
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default WordArrangementPuzzle;
