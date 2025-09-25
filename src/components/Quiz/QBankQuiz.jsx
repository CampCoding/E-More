"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  RotateCcw,
  Home,
  Menu,
  X,
} from "lucide-react";
import LineMatchingGame from "../../Drafts.jsx/Match";
import WordArrangementPuzzle from "../../Drafts.jsx/WordArrangement";
import usePostData from "../../Hooks/ApiHooks/POST/usePostData";
import useGetUserData from "../../Hooks/ApiHooks/useGetUserData";
import { decryptData } from "../../utils/decrypt";

export default function Quiz({
  data = mockData,
  timer = 5,
  examId,
  examData,
  type = "exams",
}) {
  // State
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const [submittedAnswers, setSubmittedAnswers] = useState(
    Array(data.length).fill(false)
  );
  const [correctAnsIndex, setCorrectAnsIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswers, setAllWrongAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timer * 60);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalResults, setFinalResults] = useState({});
  const [questionTimes, setQuestionTimes] = useState(
    Array(data.length).fill(0)
  );
  // Track which answers were successfully sent to backend
  const [sentAnswers, setSentAnswers] = useState(
    Array(data.length).fill(false)
  );

  // NEW: Drawer state for mobile
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedQuestion = useMemo(() => {
    return data[questionIndex];
  }, [questionIndex]);

  // Handlers
  function handleNextQuestion() {
                         handleSubmitAnswers()

    if (questionIndex < data.length - 1) setQuestionIndex((v) => v + 1);
    
  }
  function handlePrevQuestion() {
    if (questionIndex > 0) setQuestionIndex((v) => v - 1);
  }
  function handleChooseAnswer(index) {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = index;
    setAnswers(newAnswers);
  }

  const handleArrangePuzzle = (arranged) => {
    if (submittedAnswers[questionIndex]) return; // prevent edits after submit
    if (arranged.length == 0) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = null;
      setAnswers(newAnswers);
      return;
    }
    const newAnswers = [...answers];
    newAnswers[questionIndex] = arranged;
    setAnswers(newAnswers);
  };

  // deep compare for line-match
  const isSameLines = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const x = a[i],
        y = b[i];
      if (
        x?.leftData?.id !== y?.leftData?.id ||
        x?.rightData?.id !== y?.rightData?.id ||
        !!x?.isCorrect !== !!y?.isCorrect
      )
        return false;
    }
    return true;
  };

  const memoGameData = useMemo(
    () => ({
      leftColumn:
        selectedQuestion?.leftColumn?.map((item, i) => ({
          ...item,
          id: `l${i + 1}`,
        })) ?? [],
      rightColumn:
        selectedQuestion?.rightColumn?.map((item, i) => ({
          ...item,
          id: `r${i + 1}`,
        })) ?? [],
    }),
    [selectedQuestion?.leftColumn, selectedQuestion?.rightColumn]
  );

  const defaultLinesForThisQuestion = useMemo(() => {
    return answers[questionIndex] ?? [];
  }, [questionIndex]); // eslint-disable-line

  const onLineMatchChange = useCallback(
    (lines) => {
      if (submittedAnswers[questionIndex]) return; // prevent edits after submit
      const value = lines && lines.length ? lines : null;
      setAnswers((prev) => {
        const next = [...prev];
        if (isSameLines(next[questionIndex], value)) return prev;
        next[questionIndex] = value;
        return next;
      });
    },
    [questionIndex, submittedAnswers]
  );

  const { handlePostData } = usePostData();
  const userData = useGetUserData();

  const toStudentAnswerSingle = (question, ans) => {
    if (!question) return "";
    switch (question?.type) {
      case "arrangePuzzle": {
        if (!Array.isArray(ans)) return "";
        const joiner = question?.gameType === "character" ? "" : " ";
        return ans.join(joiner);
      }
      case "line-match": {
        if (!Array.isArray(ans)) return [];
        return ans.map((c) => ({
          text: c?.leftData?.text ?? "",
          type: String(c?.leftData?.type ?? ""),
          answerType: String(c?.rightData?.type ?? ""),
          answerText: c?.rightData?.text ?? "",
        }));
      }
      default: {
        return question?.real_answers?.[ans]?.answer_text ?? "";
      }
    }
  };

  function handleSubmitAnswers() {
    const q = data[questionIndex];
    const ans = answers[questionIndex];

    if (ans === null || (Array.isArray(ans) && ans.length === 0)) return;

    const newSubmitted = [...submittedAnswers];
    newSubmitted[questionIndex] = true;
    setSubmittedAnswers(newSubmitted);

    if (!q?.type || q?.type === "mcq") {
      if (q?.real_answers?.[ans]?.answer_check)
        setCorrectAnsIndex((v) => v + 1);
      setCorrectAnswer(q?.question_valid_answer || "");
      setAllWrongAnswers(
        (q?.real_answers || [])
          .filter((opt) => !opt.answer_check)
          .map((opt) => opt.answer_text)
      );
    } else if (q?.type === "arrangePuzzle") {
      setCorrectAnswer(q?.correctSentence || q?.question_text || "");
      setAllWrongAnswers([]);
    } else if (q?.type === "line-match") {
      const totalPairs = Math.min(
        q?.leftColumn?.length || 0,
        q?.rightColumn?.length || 0
      );
      setCorrectAnswer(`عدد التوصيلات الصحيحة المتوقعة: ${totalPairs}`);
      setAllWrongAnswers([]);
    }
  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);
  
    // send to backend
    const payload = {
      student_id: decryptedUserData?.student_id,
      question_id: q?.question_id,
      student_answer: toStudentAnswerSingle(q, ans),
      time_taken: questionTimes[questionIndex] || 0,
    };
    handlePostData(
      "user/courses/insert_solving_uqs.php",
      JSON.stringify(payload),
      () => {
        setSentAnswers((prev) => {
          const next = [...prev];
          next[questionIndex] = true;
          return next;
        });
      }
    );
  }

  function handleQuestionClick(index) {
    if (!quizFinished) {
      setQuestionIndex(index);
      setDrawerOpen(false); // close drawer on select (mobile)
    }
  }

  function handleFinishQuiz() {
    // Auto-submit current if has an answer
    if (!submittedAnswers[questionIndex] && answers[questionIndex] !== null) {
      handleSubmitAnswers();
    }

    const totalQuestions = data.length;
    let correctAnswers = 0;
    for (let i = 0; i < data.length; i++) {
      const q = data[i];
      const ans = answers[i];
      if (ans === null || (Array.isArray(ans) && ans.length === 0)) continue;
      if (isAnswerCorrect(q, ans)) correctAnswers++;
    }

    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    setFinalResults({
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      timeSpent: timer * 60 - timeLeft,
    });

    if (userData) {
      const toStudentAnswer = (question, ans) => {
        if (!question) return "";
        switch (question?.type) {
          case "arrangePuzzle":
            if (!Array.isArray(ans)) return "";
            const joiner = question?.gameType === "character" ? "" : " ";
            return ans.join(joiner);
          case "line-match":
            if (!Array.isArray(ans)) return [];
            return ans.map((c) => ({
              text: c?.leftData?.text ?? "",
              type: String(c?.leftData?.type ?? ""),
              answerType: String(c?.rightData?.type ?? ""),
              answerText: c?.rightData?.text ?? "",
            }));
          default:
            return question?.real_answers?.[ans]?.answer_text ?? "";
        }
      };

      const payload = {
        student_id: userData?.student_id,
        exam_id: examId,
        answers: data.map((q, idx) => ({
          question_id: q?.question_id,

          student_answer: toStudentAnswer(q, answers[idx]),
          time_taken: questionTimes[idx] || 0,
        })),
      };

      handlePostData(
        "user/courses/solve_exam.php",
        JSON.stringify(payload),
        (res) => {
          console.log("solve_exam response", res?.data);
          // mark all answered questions as sent
          setSentAnswers((prev) => {
            const next = [...prev];
            data.forEach((_, idx) => {
              const a = answers[idx];
              const has = a !== null && (!Array.isArray(a) || a.length > 0);
              if (has) next[idx] = true;
            });
            return next;
          });
        }
      );
    }

    setQuizFinished(true);
  }

  function handleRestartQuiz() {
    setQuestionIndex(0);
    setAnswers(Array(data.length).fill(null));
    setSubmittedAnswers(Array(data.length).fill(false));
    setCorrectAnsIndex(0);
    setCorrectAnswer("");
    setAllWrongAnswers([]);
    setTimeLeft(timer * 60);
    setQuizFinished(false);
    setFinalResults({});
    setQuestionTimes(Array(data.length).fill(0));
    setSentAnswers(Array(data.length).fill(false));
  }

  // Effects
  useEffect(() => {
    if (type !== "qbank") {
      if (!quizFinished && timeLeft > 0) {
        const id = setTimeout(() => {
          setTimeLeft((s) => s - 1);
          setQuestionTimes((prev) => {
            const next = [...prev];
            next[questionIndex] = (next[questionIndex] || 0) + 1;
            return next;
          });
        }, 1000);
        return () => clearTimeout(id);
      } else if (!quizFinished && timeLeft === 0) {
        handleFinishQuiz();
      }
    }
  }, [timeLeft, quizFinished, questionIndex]); // eslint-disable-line

  // Fix: Handle correct answer display for arrangePuzzle and line match types
  useEffect(() => {
    if (submittedAnswers[questionIndex] && !quizFinished) {
      const question = data[questionIndex];
      let correctAns = "";
      let wrongAnswers = [];

      if (question.type === "arrangePuzzle") {
        // For arrangePuzzle, show the correct sentence as the answer
        correctAns = question.correctSentence || question.question_text || "";
        wrongAnswers = []; // Not applicable
      } else if (question.type === "line-match") {
        // For line-match, show the correct pairs as a formatted string
        if (Array.isArray(question.correctPairs)) {
          correctAns = question.correctPairs
            .map(
              (pair, idx) =>
                `${pair.left || question.leftColumn?.[idx] || ""} - ${
                  pair.right || question.rightColumn?.[idx] || ""
                }`
            )
            .join(", ");
        } else {
          correctAns = "";
        }
        wrongAnswers = []; // Not applicable
      } else {
        // Default: MCQ and others
        correctAns = question.question_valid_answer;
        wrongAnswers =
          question.real_answers
            ?.filter((opt) => !opt.answer_check)
            .map((opt) => opt.answer_text) || [];
      }

      setCorrectAnswer(correctAns);
      setAllWrongAnswers(wrongAnswers);
    } else if (!quizFinished) {
      setCorrectAnswer("");
      setAllWrongAnswers([]);
    }
  }, [questionIndex, submittedAnswers, data, quizFinished]);

  // Utils
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const normalize = (s) => (s || "").replace(/\s+/g, " ").trim();

  const isMcqCorrect = (question, ans) => {
    if (ans === null || ans === undefined) return false;
    return !!question?.real_answers?.[ans]?.answer_check;
  };

  const isArrangeCorrect = (question, ans) => {
    if (!Array.isArray(ans) || !question) return false;
    const correct = normalize(
      question?.correctSentence || question?.question_text
    );
    const joinedWithSpace = normalize(ans.join(" "));
    const joinedNoSpace = normalize(ans.join(""));
    return joinedWithSpace === correct || joinedNoSpace === correct;
  };

  const isLineMatchCorrect = (question, ans) => {
    if (!Array.isArray(ans) || !question) return false;
    const needed = Math.min(
      question?.leftColumn?.length || 0,
      question?.rightColumn?.length || 0
    );
    if (ans.length !== needed) return false;
    return ans.every((p) => !!p && p.isCorrect === true);
  };

  const isAnswerCorrect = (question, ans) => {
    switch (question?.type) {
      case "arrangePuzzle":
        return isArrangeCorrect(question, ans);
      case "line-match":
        return isLineMatchCorrect(question, ans);
      default:
        return isMcqCorrect(question, ans);
    }
  };

  const getUserAnswerDisplay = (question, ans) => {
    if (question?.type === "arrangePuzzle") {
      if (!Array.isArray(ans)) return "";
      const joiner = question?.gameType === "character" ? "" : " ";
      return ans.join(joiner);
    }
    if (question?.type === "line-match") {
      if (!Array.isArray(ans)) return "";
      const ok = ans.filter((x) => x?.isCorrect).length;
      const total = Math.min(
        question?.leftColumn?.length || 0,
        question?.rightColumn?.length || 0
      );
      return `${ok}/${total} وصلات صحيحة`;
    }
    if (ans !== null && question?.real_answers?.[ans]) {
      return question.real_answers[ans].answer_text;
    }
    return "";
  };

  // Build the correct solution pairs for line-match questions
  const getLineMatchCorrectPairs = (question) => {
    if (!question || question?.type !== "line-match") return [];
    const leftItems = question?.leftColumn || [];
    const rightItems = question?.rightColumn || [];
    const typeToRightText = new Map();
    rightItems.forEach((r) => {
      const key = String(r?.type ?? "");
      if (!typeToRightText.has(key)) typeToRightText.set(key, r?.text ?? "");
    });
    return leftItems.map((l) => ({
      leftText: l?.text ?? "",
      rightText: typeToRightText.get(String(l?.type ?? "")) ?? "",
    }));
  };

  const getPaginationButtonColor = (index) => {
    if (index === questionIndex && !quizFinished) {
      return "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg";
    }
    if (!sentAnswers[index]) {
      return "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400";
    }
    const ans = answers[index];
    if (
      ans !== null &&
      (!Array.isArray(ans) || (Array.isArray(ans) && ans.length > 0))
    ) {
      const correct = isAnswerCorrect(data[index], ans);
      return correct
        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-md"
        : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 shadow-md";
    }
    return "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400";
  };

  const getGradeEmoji = (p) =>
    p >= 90
      ? "🏆"
      : p >= 80
      ? "🥇"
      : p >= 70
      ? "🥈"
      : p >= 60
      ? "🥉"
      : p >= 50
      ? "👍"
      : "📚";
  const getGradeMessage = (p) =>
    p >= 90
      ? "ممتاز! أنت محترف في الاختبارات! 🌟"
      : p >= 80
      ? "عمل رائع! أحسنت! 🎉"
      : p >= 70
      ? "عمل جيد! أحسنت صنعًا! 👏"
      : p >= 60
      ? "ليس سيئًا! استمر في التدريب! 💪"
      : p >= 50
      ? "لقد نجحت! هناك مجال للتحسين! 📖"
      : "استمر في المذاكرة وحاول مرة أخرى! 🤔";

  // === RESULTS SCREEN ===
  if (quizFinished) {
    return (
      <div className=" w-screen  overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 p-2 sm:p-4 lg:p-6 relative">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-pink-300/15 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-8 h-8 sm:w-12 sm:h-12 bg-blue-200/20 rounded-full blur-md animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 sm:w-18 sm:h-18 bg-purple-200/10 rounded-full blur-lg animate-pulse"></div>
        </div>

        {/* Responsive grid layout */}
        <div className="grid h-full container grid-cols-1 xl:grid-cols-[350px,1fr] gap-3 sm:gap-4 lg:gap-6 relative z-10">
          {/* Enhanced Responsive Sidebar */}
          <aside className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 flex flex-col xl:order-1 order-1 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-pulse"></div>

            {/* Responsive Score Display */}
            <div className="relative text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2 drop-shadow-sm animate-pulse">
                {finalResults.percentage}%
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-800 font-bold text-lg sm:text-xl">
                <span className="text-xl sm:text-2xl animate-bounce">
                  {getGradeEmoji(finalResults.percentage)}
                </span>
                <span className="text-base sm:text-xl">نتيجتك النهائية</span>
              </div>

              {/* Enhanced Circular progress indicator */}
              <div className="mt-3 sm:mt-4 mx-auto w-20 h-20 sm:w-24 sm:h-24 relative">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - finalResults.percentage / 100)
                    }`}
                    className="transition-all duration-2000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs sm:text-sm font-bold text-gray-600">
                    {finalResults.correctAnswers}/{finalResults.totalQuestions}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Responsive Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="group rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-rotate-1">
                <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 transition-transform duration-500 animate-bounce">
                  ✅
                </div>
                <div className="font-black text-emerald-700 text-2xl sm:text-3xl mb-1 group-hover:text-emerald-600 transition-colors">
                  {finalResults.correctAnswers}
                </div>
                <div className="text-emerald-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                  إجابات صحيحة
                </div>
                <div className="mt-2 h-1 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (finalResults.correctAnswers /
                          finalResults.totalQuestions) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="group rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 border border-rose-200 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:rotate-1">
                <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 transition-transform duration-500 animate-bounce">
                  ❌
                </div>
                <div className="font-black text-rose-700 text-2xl sm:text-3xl mb-1 group-hover:text-rose-600 transition-colors">
                  {finalResults.wrongAnswers}
                </div>
                <div className="text-rose-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                  إجابات خاطئة
                </div>
                <div className="mt-2 h-1 bg-rose-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-red-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (finalResults.wrongAnswers /
                          finalResults.totalQuestions) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {type !== "qbank" && (
                <div className="group rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 border border-sky-200 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-rotate-1">
                  <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 transition-transform duration-500 animate-bounce">
                    ⏱️
                  </div>
                  <div className="font-black text-blue-700 text-2xl sm:text-3xl mb-1 group-hover:text-blue-600 transition-colors">
                    {formatTime(finalResults.timeSpent)}
                  </div>
                  <div className="text-blue-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                    الوقت المستغرق
                  </div>
                  <div className="mt-2 h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000 w-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Responsive Action Buttons */}
            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 sm:gap-3">
              <button
                onClick={handleRestartQuiz}
                className="group w-full inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-700 relative z-10" />
                <span className="text-sm sm:text-base relative z-10">
                  إعادة الاختبار
                </span>
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="group w-full inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-500 relative z-10" />
                <span className="text-sm sm:text-base relative z-10">
                  العودة للرئيسية
                </span>
              </button>
            </div>

            {/* Achievement badges */}
            <div className="mt-4 flex justify-center">
              {finalResults.percentage === 100 && (
                <div className="animate-bounce bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  🏆 درجة كاملة!
                </div>
              )}
              {finalResults.percentage >= 90 &&
                finalResults.percentage < 100 && (
                  <div className="animate-pulse bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    🌟 ممتاز!
                  </div>
                )}
              {finalResults.percentage >= 70 &&
                finalResults.percentage < 90 && (
                  <div className="animate-pulse bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    👍 جيد جداً!
                  </div>
                )}
            </div>
          </aside>
          {/* Enhanced Responsive Main Content */}
          <main className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 h-full flex flex-col xl:order-2 order-2 relative overflow-hidden">
            {/* Enhanced Responsive Header */}
            <div className=" w-full relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-2xl sm:rounded-t-3xl px-4 sm:px-6 py-4 sm:py-6">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-1/2 left-4 w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-pulse"></div>

              <div className="relative z-10 text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 drop-shadow-lg animate-pulse">
                  🎊 اكتمل الاختبار! 🎊
                </div>
                <div className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white/90">
                  {getGradeMessage(finalResults.percentage)}
                </div>

                {/* Enhanced Responsive Progress Bar */}
                <div className="relative mt-3 sm:mt-4 h-3 sm:h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                    style={{ width: `${finalResults.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>

                <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 text-base sm:text-lg font-black">
                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base animate-pulse">
                    {finalResults.correctAnswers}/{finalResults.totalQuestions}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Responsive Questions Review */}
            <div className=" w-full max-w-6xl p-3 sm:p-4 lg:p-6 overflow-y-auto grow">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-50 to-white rounded-full border border-gray-200 shadow-sm animate-pulse">
                  <span className="text-lg sm:text-xl lg:text-2xl">📋</span>
                  <span className="text-sm sm:text-base lg:text-xl">
                    مراجعة الأسئلة
                  </span>
                </h3>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {data?.map((question, index) => {
                  const picked = answers[index];
                  const isCorrect = isAnswerCorrect(question, picked);

                  if (question?.type == "mcq" || !question?.type) {
                    return (
                      <div
                        dir="ltr"
                        key={index}
                        className={`group p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border-l-4 transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${
                          isCorrect
                            ? "bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border-emerald-500 hover:from-emerald-100 hover:to-green-100"
                            : "bg-gradient-to-r from-rose-50 via-red-50 to-rose-100 border-rose-500 hover:from-rose-100 hover:to-red-100"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 ${
                              isCorrect
                                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                : "bg-gradient-to-br from-rose-500 to-red-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2 sm:space-y-3">
                            <div className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                              {question.question_text}
                            </div>
                            <div dir="rtl" className="space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-emerald-100/50 rounded-lg sm:rounded-xl gap-2">
                                <div className="font-bold text-emerald-700 flex items-center gap-2 text-sm sm:text-base">
                                  <span className="text-base sm:text-lg">
                                    ✅
                                  </span>
                                  <span>الإجابة الصحيحة:</span>
                                </div>
                                <div className="font-bold text-emerald-800 bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base break-words">
                                  {
                                    question.real_answers.find(
                                      (a) => a.answer_check
                                    )?.answer_text
                                  }
                                </div>
                              </div>
                              {picked !== null && (
                                <div
                                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl gap-2 ${
                                    isCorrect
                                      ? "bg-emerald-100/50"
                                      : "bg-rose-100/50"
                                  }`}
                                >
                                  <div
                                    className={`font-bold flex items-center gap-2 text-sm sm:text-base ${
                                      isCorrect
                                        ? "text-emerald-700"
                                        : "text-rose-700"
                                    }`}
                                  >
                                    <span className="text-base sm:text-lg">
                                      {isCorrect ? "✅" : "❌"}
                                    </span>
                                    <span>إجابتك:</span>
                                  </div>
                                  <div
                                    className={`font-bold bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base break-words ${
                                      isCorrect
                                        ? "text-emerald-800"
                                        : "text-rose-800"
                                    }`}
                                  >
                                    {getUserAnswerDisplay(question, picked)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (question?.type == "arrangePuzzle") {
                    return (
                      <div
                        dir="ltr"
                        key={index}
                        className={`group p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border-l-4 transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${
                          isCorrect
                            ? "bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border-emerald-500 hover:from-emerald-100 hover:to-green-100"
                            : "bg-gradient-to-r from-rose-50 via-red-50 to-rose-100 border-rose-500 hover:from-rose-100 hover:to-red-100"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 ${
                              isCorrect
                                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                : "bg-gradient-to-br from-rose-500 to-red-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2 sm:space-y-3">
                            <div className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                              لعبة تسميع الكلمات{" "}
                              {question?.gameType == "word" ? "جملة" : "كلمة"}
                            </div>
                            <div dir="rtl" className="space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-emerald-100/50 rounded-lg sm:rounded-xl gap-2">
                                <div className="font-bold text-emerald-700 flex items-center gap-2 text-sm sm:text-base">
                                  <span className="text-base sm:text-lg">
                                    ✅
                                  </span>
                                  <span>الإجابة الصحيحة:</span>
                                </div>
                                <div className="font-bold text-emerald-800 bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base break-words">
                                  {question?.correctSentence ||
                                    question?.question_text}
                                </div>
                              </div>
                              {picked !== null &&
                                Array.isArray(picked) &&
                                picked.length > 0 && (
                                  <div
                                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl gap-2 ${
                                      isCorrect
                                        ? "bg-emerald-100/50"
                                        : "bg-rose-100/50"
                                    }`}
                                  >
                                    <div
                                      className={`font-bold flex items-center gap-2 text-sm sm:text-base ${
                                        isCorrect
                                          ? "text-emerald-700"
                                          : "text-rose-700"
                                      }`}
                                    >
                                      <span className="text-base sm:text-lg">
                                        {isCorrect ? "✅" : "❌"}
                                      </span>
                                      <span>إجابتك:</span>
                                    </div>
                                    <div
                                      className={`font-bold bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base break-words ${
                                        isCorrect
                                          ? "text-emerald-800"
                                          : "text-rose-800"
                                      }`}
                                    >
                                      {getUserAnswerDisplay(question, picked)}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (question?.type === "line-match") {
                    const totalPairs = Math.min(
                      question?.leftColumn?.length || 0,
                      question?.rightColumn?.length || 0
                    );
                    const correctPairs = Array.isArray(picked)
                      ? picked.filter((p) => p?.isCorrect).length
                      : 0;

                    return (
                      <div
                        dir="ltr"
                        key={index}
                        className={`group p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border-l-4 transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${
                          isCorrect
                            ? "bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border-emerald-500 hover:from-emerald-100 hover:to-green-100"
                            : "bg-gradient-to-r from-rose-50 via-red-50 to-rose-100 border-rose-500 hover:from-rose-100 hover:to-red-100"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 ${
                              isCorrect
                                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                : "bg-gradient-to-br from-rose-500 to-red-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2 sm:space-y-3">
                            <div className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                              لعبة توصيل العناصر
                            </div>
                            <div dir="rtl" className="space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-emerald-100/50 rounded-lg sm:rounded-xl gap-2">
                                <div className="font-bold text-emerald-700 flex items-center gap-2 text-sm sm:text-base">
                                  <span className="text-base sm:text-lg">
                                    ✅
                                  </span>
                                  <span>التوصيلات الصحيحة المتوقعة:</span>
                                </div>
                                <div className="font-bold text-emerald-800 bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base">
                                  {totalPairs}
                                </div>
                              </div>
                              {Array.isArray(picked) && picked.length > 0 && (
                                <div
                                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl gap-2 ${
                                    isCorrect
                                      ? "bg-emerald-100/50"
                                      : "bg-rose-100/50"
                                  }`}
                                >
                                  <div
                                    className={`font-bold flex items-center gap-2 text-sm sm:text-base ${
                                      isCorrect
                                        ? "text-emerald-700"
                                        : "text-rose-700"
                                    }`}
                                  >
                                    <span className="text-base sm:text-lg">
                                      {isCorrect ? "✅" : "❌"}
                                    </span>
                                    <span>نتيجتك:</span>
                                  </div>
                                  <div
                                    className={`font-bold bg-white/80 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base ${
                                      isCorrect
                                        ? "text-emerald-800"
                                        : "text-rose-800"
                                    }`}
                                  >
                                    {correctPairs}/{totalPairs} وصلات صحيحة
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Floating scroll indicator */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg animate-bounce xl:hidden">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            </div>
          </main>
        </div>

        {/* Floating action button for mobile */}
        <div className="fixed bottom-4 left-4 xl:hidden z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          </button>
        </div>

        {/* Success confetti animation */}
        {finalResults.percentage >= 80 && (
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute top-32 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute top-28 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
          </div>
        )}

        {/* Custom CSS for enhanced animations and scrollbars */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            border-radius: 10px;
            transition: all 0.3s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #4f46e5, #7c3aed);
          }

          /* Enhanced animations */
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            0% {
              transform: translateY(30px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes glow {
            0%,
            100% {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
            }
          }

          /* Apply animations */
          .animate-slideInFromRight {
            animation: slideInFromRight 0.8s ease-out;
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }

          .animate-shimmer {
            background-image: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.2) 20%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0)
            );
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }

          /* Responsive text scaling */
          @media (max-width: 640px) {
            .text-responsive-xs {
              font-size: 0.75rem;
            }
            .text-responsive-sm {
              font-size: 0.875rem;
            }
            .text-responsive-base {
              font-size: 1rem;
            }
            .text-responsive-lg {
              font-size: 1.125rem;
            }
            .text-responsive-xl {
              font-size: 1.25rem;
            }
          }

          /* Enhanced focus states for accessibility */
          button:focus {
            outline: 2px solid #6366f1;
            outline-offset: 2px;
          }

          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }

          /* Hide scrollbar for main content on mobile */
          @media (max-width: 1279px) {
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          }
        `}</style>
      </div>
    );
  }

  // === QUIZ SCREEN ===
  return (
    <div
      dir="rtl"
      className=" w-screen min-h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-rose-200 to-indigo-200 py-3"
    >
      <div className="grid h-full grid-rows-[auto,1fr] gap-3 container py-0">
        {/* DESKTOP/TABLET TOP BAR (hidden on mobile) */}
        <header className="hidden md:block bg-gradient-to-r from-blue-700 via-blue-600 to-rose-600 text-white rounded-2xl shadow-xl px-4 py-3">
          <div className="">
            <div className="flex items-center gap-2  mb-4 ">
              <h1 className="font-extrabold text-xl m-0">
                {examData?.course_name}
              </h1>
              {<ArrowLeft />}
              <h2 className="text-lg m-0 p-0 text-slate-200">
                {examData?.unit_name}
              </h2>
            </div>

            <div className=" flex-1 h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                style={{
                  width: `${((questionIndex + 1) / data.length) * 100}%`,
                }}
              />
            </div>
            {type !== "qbank" && timer && (
              <div className="flex items-center gap-2 bg-white/25 rounded-full px-3 py-2">
                <Clock className="text-white" />
                <span className="font-extrabold text-lg">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* MOBILE TOP STRIP with MENU BUTTON */}
        <div className="md:hidden bg-gradient-to-r from-blue-700 via-blue-600 to-rose-600 text-white rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-white/15 bg-white/25 p-2 active:scale-105"
            aria-label="فتح القائمة"
          >
            <Menu />
          </button>
          <div className="flex  items-center gap-2  ">
            <h2 className="text-lg m-0 p-0 text-slate-200">
              {examData?.unit_name}
            </h2>
          </div>{" "}
          {type !== "qbank" && timer ? (
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Clock className="text-white w-4 h-4" />
              <span className="font-extrabold text-sm">
                {formatTime(timeLeft)}
              </span>
            </div>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Drawer (Mobile) */}
        {drawerOpen && (
          <div className="md:hidden fixed z-[999999] inset-0">
            {/* Enhanced Overlay with backdrop blur */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/30 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Enhanced Panel with premium styling */}
            <aside className="absolute inset-y-0 right-0 w-80 max-w-[85%] bg-gradient-to-br from-white via-gray-50 to-white border-l border-gray-200/50 shadow-2xl backdrop-blur-lg flex flex-col animate-[slideIn_.35s_cubic-bezier(0.34,1.56,0.64,1)]">
              {/* Enhanced Header with gradient accent */}
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500"></div>
                <div className="flex items-center justify-between p-5 pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div>
                    <h2 className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                      التنقل بين الأسئلة
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      اختر السؤال للانتقال إليه
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="group inline-flex items-center justify-center rounded-xl bg-white hover:!bg-red-50 border border-gray-200 hover:!border-red-200 p-3 transition-all duration-200 shadow-sm hover:!shadow-md"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5 !text-gray-600 group-hover:!text-red-500 transition-colors duration-200" />
                  </button>
                </div>
              </div>

              {/* Enhanced Progress Section */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                {/* Enhanced Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-3">
                  <div
                    className="absolute inset-y-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{
                      width: `${((questionIndex + 1) / data.length) * 100}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                </div>

                {/* Progress Text */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-700">
                    السؤال {questionIndex + 1} من {data.length}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {Math.round(((questionIndex + 1) / data.length) * 100)}%
                    مكتمل
                  </span>
                </div>

                {/* Solved Questions Summary */}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-700 font-medium">
                        {
                          sentAnswers.filter(
                            (_, index) =>
                              answers[index] !== null &&
                              (!Array.isArray(answers[index]) ||
                                (Array.isArray(answers[index]) &&
                                  answers[index].length > 0)) &&
                              isAnswerCorrect(data[index], answers[index])
                          ).length
                        }{" "}
                        صحيح
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-red-700 font-medium">
                        {
                          sentAnswers.filter(
                            (_, index) =>
                              answers[index] !== null &&
                              (!Array.isArray(answers[index]) ||
                                (Array.isArray(answers[index]) &&
                                  answers[index].length > 0)) &&
                              !isAnswerCorrect(data[index], answers[index])
                          ).length
                        }{" "}
                        خطأ
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-600 font-medium">
                    {sentAnswers.filter(Boolean).length}/{data.length} تم
                    الإجابة
                  </span>
                </div>

                {/* Enhanced Timer */}
                {type !== "qbank" && timer && (
                  <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200/50 shadow-sm">
                    <div className="p-1 rounded-full bg-blue-100">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-black text-blue-700 text-lg tracking-wide">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Questions Grid */}
              <div className="flex-1 p-5 overflow-hidden">
                <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                  الأسئلة
                </h3>
                <div className="grid grid-cols-4 py-3 px-2 max-h-full custom-scrollbar overflow-hidden gap-2 overflow-y-auto   ">
                  {[...submittedAnswers].map((_, index) => {
                    const isAnswered = sentAnswers[index];
                    const isCorrect =
                      isAnswered &&
                      answers[index] !== null &&
                      (!Array.isArray(answers[index]) ||
                        (Array.isArray(answers[index]) &&
                          answers[index].length > 0)) &&
                      isAnswerCorrect(data[index], answers[index]);
                    const isWrong =
                      isAnswered &&
                      answers[index] !== null &&
                      (!Array.isArray(answers[index]) ||
                        (Array.isArray(answers[index]) &&
                          answers[index].length > 0)) &&
                      !isAnswerCorrect(data[index], answers[index]);

                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(index)}
                        className={`relative h-12 rounded-xl text-white text-sm font-bold shadow-md  transition-all duration-200 transform  active:scale-95 ${getPaginationButtonColor(
                          index
                        )} ${
                          index === questionIndex
                            ? "ring-4 ring-yellow-300 ring-offset-2 ring-offset-white scale-105"
                            : ""
                        }`}
                        title={`سؤال ${index + 1}${
                          isAnswered
                            ? isCorrect
                              ? " - إجابة صحيحة"
                              : " - إجابة خاطئة"
                            : " - لم يُجاب عليه"
                        }`}
                      >
                        <span className="relative z-10 flex items-center justify-center h-full">
                          {index + 1}
                          {/* Status indicators */}
                          {isAnswered && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                              {isCorrect ? (
                                <CheckCircle className="w-3 h-3 text-white drop-shadow-sm" />
                              ) : (
                                <XCircle className="w-3 h-3 text-white drop-shadow-sm" />
                              )}
                            </div>
                          )}
                        </span>
                        {index === questionIndex && (
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl animate-pulse"></div>
                        )}

                        {/* Progress indicator for answered questions */}
                        {isAnswered && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl">
                            <div
                              className={`h-full rounded-b-xl transition-all duration-500 ${
                                isCorrect ? "bg-green-400" : "bg-red-400"
                              }`}
                            ></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Actions Section */}
              <div className="p-5 pt-0">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={questionIndex === 0}
                    className={`group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold shadow-md transition-all duration-200 ${
                      questionIndex === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    السابق
                    <ArrowRight
                      className={`w-4 h-4  transition-transform duration-200 ${
                        questionIndex !== 0
                          ? "group-hover:-translate-x-0.5"
                          : ""
                      }`}
                    />
                  </button>

                  {questionIndex !== data.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-3 font-bold shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="col-span-2 group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-400 text-white px-4 py-3 font-bold shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <Trophy className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12 relative z-10" />
                      <span className="relative z-10">إنهاء الاختبار</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500"></div>
            </aside>
          </div>
        )}

        {/* MAIN */}
        <div className="h-full grid lg:grid-cols-[260px,1fr] gap-3  ">
          <aside className="hidden lg:flex flex-col bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80 backdrop-blur-lg backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20  sticky top-3  transition-all duration-300 hover:shadow-3xl">
            {/* Enhanced Header */}
            <div className="relative p-4">
              <h2 className=" !mb-0 font-extrabold text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-base  tracking-wide drop-shadow-sm">
                التنقل بين الأسئلة
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full opacity-60"></div>

              {/* Progress Summary */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-700 font-medium">
                      {
                        sentAnswers.filter(
                          (_, index) =>
                            answers[index] !== null &&
                            (!Array.isArray(answers[index]) ||
                              (Array.isArray(answers[index]) &&
                                answers[index].length > 0)) &&
                            isAnswerCorrect(data[index], answers[index])
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-red-700 font-medium">
                      {
                        sentAnswers.filter(
                          (_, index) =>
                            answers[index] !== null &&
                            (!Array.isArray(answers[index]) ||
                              (Array.isArray(answers[index]) &&
                                answers[index].length > 0)) &&
                            !isAnswerCorrect(data[index], answers[index])
                        ).length
                      }
                    </span>
                  </div>
                </div>
                <span className="text-gray-600 font-medium">
                  {sentAnswers.filter(Boolean).length}/{data.length}
                </span>
              </div>
            </div>

            {/* Enhanced Grid with Better Scrolling */}
            <div className="relative m-3 max-h-full  flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-transparent to-blue-50/30 mt-4 mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 pointer-events-none z-10 rounded-2xl"></div>
              <div className="grid grid-cols-3 overflow-hidden gap-3  custom-scrollbar pr-2 max-h-full scroll-smooth">
                {[...submittedAnswers].map((_, index) => {
                  const isAnswered = sentAnswers[index];
                  const isCorrect =
                    isAnswered &&
                    answers[index] !== null &&
                    (!Array.isArray(answers[index]) ||
                      (Array.isArray(answers[index]) &&
                        answers[index].length > 0)) &&
                    isAnswerCorrect(data[index], answers[index]);
                  const isWrong =
                    isAnswered &&
                    answers[index] !== null &&
                    (!Array.isArray(answers[index]) ||
                      (Array.isArray(answers[index]) &&
                        answers[index].length > 0)) &&
                    !isAnswerCorrect(data[index], answers[index]);

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      className={`group relative h-12 rounded-2xl text-white text-sm font-bold shadow-lg transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1 active:scale-95 ${getPaginationButtonColor(
                        index
                      )} ${
                        index === questionIndex
                          ? "ring-4 ring-yellow-300/80 ring-offset-2 ring-offset-white/50 scale-110 shadow-2xl animate-pulse"
                          : "hover:shadow-xl"
                      } ${index === questionIndex ? "animate-bounce" : ""}`}
                      title={`سؤال ${index + 1}${
                        isAnswered
                          ? isCorrect
                            ? " - إجابة صحيحة"
                            : " - إجابة خاطئة"
                          : " - لم يُجاب عليه"
                      }`}
                    >
                      <span className="relative z-10 drop-shadow-sm flex items-center justify-center h-full">
                        {index + 1}
                        {/* Status indicators */}
                        {isAnswered && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                            {isCorrect ? (
                              <CheckCircle className="w-3 h-3 text-white drop-shadow-sm" />
                            ) : (
                              <XCircle className="w-3 h-3 text-white drop-shadow-sm" />
                            )}
                          </div>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Progress indicator for answered questions */}
                      {isAnswered && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-2xl">
                          <div
                            className={`h-full rounded-b-2xl transition-all duration-500 ${
                              isCorrect ? "bg-green-400" : "bg-red-400"
                            }`}
                          ></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="space-y-3">
              {/* Previous/Next Row */}
              <div className="grid grid-cols-2 gap-3 p-3">
                <button
                  onClick={handlePrevQuestion}
                  disabled={questionIndex === 0}
                  className={`group relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold shadow-lg transition-all duration-300 transform overflow-hidden ${
                    questionIndex === 0
                      ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white hover:scale-105 hover:shadow-xl active:scale-95"
                  }`}
                >
                  {questionIndex !== 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-1" />
                  <span className="relative z-10 drop-shadow-sm">السابق</span>
                </button>

                {questionIndex !== data.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-4 py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10 drop-shadow-sm">التالي</span>
                    <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : null}
              </div>

              {/* Finish Button */}
              {questionIndex === data.length - 1 && (
                <button
                  onClick={handleFinishQuiz}
                  className="group relative w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-white px-4 py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Trophy className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm" />
                  <span className="relative z-10 drop-shadow-sm">
                    إنهاء الاختبار
                  </span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                </button>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full -translate-x-16 -translate-y-16 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-cyan-400/10 to-blue-500/10 rounded-full translate-x-12 translate-y-12 pointer-events-none"></div>
          </aside>
          <main className="bg-white/95 backdrop-blur  rounded-2xl shadow-3xl  flex flex-col">
            {/* Question */}

            {/* Content */}
            <div className=" grow overflow-y-auto w-full rounded-xl overflow-hidden">
              {selectedQuestion.type === "line-match" ? (
                <div className="w-full">
                  <LineMatchingGame
                    key={questionIndex}
                    defaultConnectionsData={defaultLinesForThisQuestion}
                    onChange={onLineMatchChange}
                    gameData={memoGameData}
                  />
                </div>
              ) : selectedQuestion.type == "arrangePuzzle" ? (
                <div className="w-full">
                  <WordArrangementPuzzle
                    onChange={(e) => handleArrangePuzzle(e)}
                    id={selectedQuestion?.question_id}
                    gameType={selectedQuestion?.gameType}
                    correctSentence={selectedQuestion?.correctSentence}
                    scrambledWords={selectedQuestion?.str_shuffle}
                    translationText={selectedQuestion?.hint}
                    defaultArranged={answers[questionIndex] || []}
                  />
                </div>
              ) : (
                <div className="space-y-3 p-4 ">
                  {/* <h4 dir="ltr">{data[questionIndex].question_text}</h4> */}
                  <div className="pb-4 border-b">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-3 shadow">
                      <h2
                        dir="ltr"
                        className=" text-base md:text-xl font-bold text-blue-800 m-0"
                      >
                        {data[questionIndex]?.question_text} 🤔
                      </h2>
                    </div>
                  </div>
                  {data[questionIndex]?.real_answers?.map((option, index) => {
                    const isSubmitted = submittedAnswers[questionIndex];
                    const isPicked = index === answers[questionIndex];
                    const isRight = option.answer_check;

                    return (
                      <button
                        key={option.answer_text}
                        disabled={isSubmitted}
                        onClick={() => handleChooseAnswer(index)}
                        className={`w-full text-right p-3 rounded-xl transition transform hover:scale-[1.01] shadow-sm font-semibold
                        ${
                          isSubmitted && isRight
                            ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                            : isSubmitted && isPicked && !isRight
                            ? "bg-gradient-to-r from-red-400 to-red-400 text-white"
                            : isPicked
                            ? "bg-gradient-to-r from-blue-400 to-blue-400 text-white"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-rose-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-row-reverse">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                            ${
                              isSubmitted && isRight
                                ? "bg-white text-green-600"
                                : isSubmitted && isPicked && !isRight
                                ? "bg-white text-red-600"
                                : isPicked
                                ? "bg-white text-blue-600"
                                : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-base">
                            {option.answer_text}
                          </span>

                          {isSubmitted && isRight && (
                            <CheckCircle className="ms-auto text-white text-2xl" />
                          )}
                          {isSubmitted && isPicked && !isRight && (
                            <XCircle className="ms-auto text-white text-2xl" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Send Answer button */}
              {!submittedAnswers[questionIndex] &&
                answers[questionIndex] !== null &&
                (!Array.isArray(answers[questionIndex]) ||
                  (Array.isArray(answers[questionIndex]) &&
                    answers[questionIndex].length > 0)) && (
                  <div className="p-4 pt-0">
                    <button
                      onClick={handleSubmitAnswers}
                      className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      إرسال الإجابة
                    </button>
                  </div>
                )}

              {/* Feedback */}
              {submittedAnswers[questionIndex] && (
                <div className="mt-4 space-y-2">
                  <div className="bg-green-50 border-r-4 border-green-500 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="text-green-600" />
                      <h4 className="text-green-800 font-bold m-0">
                        الإجابة الصحيحة
                      </h4>
                    </div>
                    {selectedQuestion?.type === "line-match" ? (
                      <div className="text-green-800 font-semibold">
                        <ul className="list-disc pr-5 space-y-1">
                          {getLineMatchCorrectPairs(selectedQuestion).map(
                            (p, i) => (
                              <li key={i} className="text-green-700">
                                {p.leftText} ↔ {p.rightText}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-green-700 font-semibold m-0">
                        {correctAnswer}
                      </p>
                    )}
                  </div>
                  {/* Student answer block */}
                  <div className="bg-blue-50 border-r-4 border-blue-500 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-blue-800 font-bold m-0">إجابتك</h4>
                    </div>
                    {selectedQuestion?.type === "line-match" ? (
                      Array.isArray(answers[questionIndex]) &&
                      answers[questionIndex].length > 0 ? (
                        <ul className="list-disc pr-5 space-y-1">
                          {answers[questionIndex].map((pair, i) => (
                            <li
                              key={i}
                              className={
                                pair?.isCorrect
                                  ? "text-emerald-700"
                                  : "text-rose-700"
                              }
                            >
                              {pair?.leftData?.text ?? ""} ↔{" "}
                              {pair?.rightData?.text ?? ""}{" "}
                              {pair?.isCorrect ? "✅" : "❌"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-blue-700 font-semibold m-0">—</p>
                      )
                    ) : (
                      <p className="text-blue-700 font-semibold m-0">
                        {getUserAnswerDisplay(
                          selectedQuestion,
                          answers[questionIndex]
                        ) || "—"}
                      </p>
                    )}
                  </div>
                  {!selectedQuestion?.type &&
                    wrongAnswers.map((opt, i) => (
                      <div
                        key={i}
                        className="bg-red-50 border-r-4 border-red-500 p-2 rounded-xl"
                      >
                        <p className="text-red-700 font-semibold m-0">
                          ❌ {opt}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className=" w-full space-y-3 block lg:hidden">
              {/* Previous/Next Row */}
              <div className="grid grid-cols-2 gap-3 p-3">
                <button
                  onClick={handlePrevQuestion}
                  disabled={questionIndex === 0}
                  className={`group relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold shadow-lg transition-all duration-300 transform overflow-hidden ${
                    questionIndex === 0
                      ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white hover:scale-105 hover:shadow-xl active:scale-95"
                  }`}
                >
                  {questionIndex !== 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-1" />
                  <span className="relative z-10 drop-shadow-sm">السابق</span>
                </button>

                {questionIndex !== data.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-4 py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10 drop-shadow-sm">التالي</span>
                    <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : null}
              </div>

              {/* Finish Button */}
              {questionIndex === data.length - 1 && (
                <button
                  onClick={handleFinishQuiz}
                  className="group relative w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-white px-4 py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Trophy className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm" />
                  <span className="relative z-10 drop-shadow-sm">
                    إنهاء الاختبار
                  </span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                </button>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* keep page itself fixed-height: avoid body scroll on small screens */}
      <style jsx>{`
        :global(html, body) {
          height: 100%;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// Mock data for demonstration
const mockData = [
  {
    question_text: "What is the capital of France?",
    question_valid_answer: "Paris is the capital and largest city of France.",
    real_answers: [
      { answer_text: "London", answer_check: false },
      { answer_text: "Berlin", answer_check: false },
      { answer_text: "Paris", answer_check: true },
      { answer_text: "Madrid", answer_check: false },
    ],
  },
  {
    question_text: "Which planet is closest to the Sun?",
    question_valid_answer: "Mercury is the closest planet to the Sun.",
    real_answers: [
      { answer_text: "Venus", answer_check: false },
      { answer_text: "Mercury", answer_check: true },
      { answer_text: "Earth", answer_check: false },
      { answer_text: "Mars", answer_check: false },
    ],
  },
  {
    question_text: "What is 2 + 2?",
    question_valid_answer: "2 + 2 equals 4.",
    real_answers: [
      { answer_text: "3", answer_check: false },
      { answer_text: "4", answer_check: true },
      { answer_text: "5", answer_check: false },
      { answer_text: "6", answer_check: false },
    ],
  },
];
