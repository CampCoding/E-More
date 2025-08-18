"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
import LineMatchingGame from "../../Drafts.jsx/Match";
import WordArrangementPuzzle from "../../Drafts.jsx/WordArrangement";
import usePostData from "../../Hooks/ApiHooks/POST/usePostData";
import useGetUserData from "../../Hooks/ApiHooks/useGetUserData";

export default function Quiz({ data = mockData, timer = 5, examId }) {
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
  const selectedQuestion = useMemo(() => {
    return data[questionIndex];
  }, [questionIndex]);

  useEffect(() => {
    console.log("questionIndex", selectedQuestion);
  }, [questionIndex]);

  // Handlers
  function handleNextQuestion() {
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
    console.log("handleArrangePuzzle", arranged);

    if (arranged.length == 0) {
      console.log("arranged");
      const newAnswers = [...answers];
      newAnswers[questionIndex] = null;
      setAnswers(newAnswers);

      return;
    }
    console.log("not arranged");
    const newAnswers = [...answers];
    newAnswers[questionIndex] = arranged;
    setAnswers(newAnswers);
  };

  // 1) deep compare لمصفوفة الوصلات
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

  // 2) ثبّت gameData (مايتبنيش غير لما السؤال يتغيّر فعلاً)
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

  // 3) ثبّت defaultConnections بحيث تتغير فقط لما يتغير السؤال
  //    (عشان ما تعيدش حقن الـ defaults كل ما الإجابة تتحدث)
  const defaultLinesForThisQuestion = useMemo(() => {
    return answers[questionIndex] ?? []; // اتعامل كـ default فقط
  }, [questionIndex]);

  // 4) ثبّت الـ handler وامنع تحديثات بدون تغيير فعلي
  const onLineMatchChange = useCallback(
    (lines) => {
      const value = lines && lines.length ? lines : null;

      setAnswers((prev) => {
        const next = [...prev];
        if (isSameLines(next[questionIndex], value)) return prev; // no-op
        next[questionIndex] = value;
        return next;
      });
    },
    [questionIndex]
  );

  useEffect(() => {
    console.log("newAnswers", answers);
  }, [answers]);

  // 5) (اختياري قوي) خليه يعيد mount لما السؤال يتغيّر
  //    لتطبيق الـ defaults مرة واحدة لكل سؤال

  const { handlePostData, loading, setLoading } = usePostData();
  const userData = useGetUserData();

  function handleSubmitAnswers() {
    const q = data[questionIndex];
    const ans = answers[questionIndex];

    // nothing to submit
    if (ans === null || (Array.isArray(ans) && ans.length === 0)) return;

    const newSubmitted = [...submittedAnswers];
    newSubmitted[questionIndex] = true;
    setSubmittedAnswers(newSubmitted);

    // MCQ-specific side effects only when MCQ shape exists
    if (!q?.type || q?.type === "mcq") {
      if (q?.real_answers?.[ans]?.answer_check) {
        setCorrectAnsIndex((v) => v + 1);
      }
      setCorrectAnswer(q?.question_valid_answer || "");
      setAllWrongAnswers(
        (q?.real_answers || [])
          .filter((opt) => !opt.answer_check)
          .map((opt) => opt.answer_text)
      );
    }
  }

  function handleQuestionClick(index) {
    if (!quizFinished) setQuestionIndex(index);
  }

  function handleFinishQuiz() {
    console.log("getAllAnwers", answers);

    // Auto-submit current if has an answer
    if (!submittedAnswers[questionIndex] && answers[questionIndex] !== null) {
      handleSubmitAnswers();
    }

    const totalQuestions = data.length;

    // type-aware correctness over the whole quiz
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

    // Build payload for solve_exam
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
  }

  // Effects
  useEffect(() => {
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
  }, [timeLeft, quizFinished, questionIndex]);

  useEffect(() => {
    if (submittedAnswers[questionIndex] && !quizFinished) {
      setCorrectAnswer(data[questionIndex].question_valid_answer);
      setAllWrongAnswers(
        data[questionIndex].real_answers
          .filter((opt) => !opt.answer_check)
          .map((opt) => opt.answer_text)
      );
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

  // correctness helpers
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

  const getPaginationButtonColor = (index) => {
    if (index === questionIndex && !quizFinished) {
      return "bg-gradient-to-r from-yellow-400 to-orange-400";
    }
    const ans = answers[index];
    const hasAnswer =
      ans !== null &&
      (!Array.isArray(ans) || (Array.isArray(ans) && ans.length > 0));

    if (hasAnswer) {
      const correct = isAnswerCorrect(data[index], ans);
      return correct
        ? "bg-gradient-to-r from-green-500 to-emerald-500"
        : "bg-gradient-to-r from-red-500 to-red-500";
    }
    return "bg-gradient-to-r from-gray-400 to-gray-500";
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

  // const handleSubmitAnswers =

  // === RESULTS SCREEN (single viewport, inner scroll) ===
  if (quizFinished) {
    return (
      <div
        dir="rtl"
        className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-400 via-rose-300 to-sky-300 p-3"
      >
        <div className="grid h-full grid-cols-[280px,1fr] gap-3">
          {/* Side Panel */}
          <aside className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4 flex flex-col">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-rose-600 text-center">
              {finalResults.percentage}%
            </div>
            <div className="text-center mt-2 text-gray-800 font-bold text-lg">
              {getGradeEmoji(finalResults.percentage)} نتيجتك النهائية
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl p-3 text-center bg-green-50">
                <div className="text-2xl">✅</div>
                <div className="font-extrabold text-green-700 text-2xl">
                  {finalResults.correctAnswers}
                </div>
                <div className="text-green-700 font-semibold">إجابات صحيحة</div>
              </div>
              <div className="rounded-xl p-3 text-center bg-red-50">
                <div className="text-2xl">❌</div>
                <div className="font-extrabold text-red-700 text-2xl">
                  {finalResults.wrongAnswers}
                </div>
                <div className="text-red-700 font-semibold">إجابات خاطئة</div>
              </div>
              <div className="rounded-xl p-3 text-center bg-sky-50">
                <div className="text-2xl">⏱️</div>
                <div className="font-extrabold text-blue-700 text-2xl">
                  {formatTime(finalResults.timeSpent)}
                </div>
                <div className="text-blue-700 font-semibold">
                  الوقت المستغرق
                </div>
              </div>
            </div>

            <div className="mt-auto grid gap-2">
              <button
                onClick={handleRestartQuiz}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 font-bold shadow"
              >
                <RotateCcw /> إعادة الاختبار
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 font-bold shadow"
              >
                <Home /> العودة للرئيسية
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-rose-600 text-white rounded-t-2xl px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">
                🎊 اكتمل الاختبار! 🎊
              </div>
              <div className="font-semibold">
                {getGradeMessage(finalResults.percentage)}
              </div>
              <div className="mt-3 h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-rose-400 rounded-full"
                  style={{ width: `${finalResults.percentage}%` }}
                />
              </div>
              <div className="mt-1 text-sm font-bold">
                {finalResults.correctAnswers}/{finalResults.totalQuestions}
              </div>
            </div>

            {/* Review list (inner scroll) */}
            <div className="p-4 overflow-y-auto grow space-y-3">
              <h3 className="text-xl font-bold text-gray-800 text-center">
                📋 مراجعة الأسئلة
              </h3>
              {console.log("finalData", data)}
              {data?.map((question, index) => {
                const picked = answers[index];
                const isCorrect = isAnswerCorrect(question, picked);
                if (question?.type == "mcq" || !question?.type) {
                  return (
                    <div
                      dir="ltr"
                      key={index}
                      className={`p-3 rounded-xl border-r-4 ${
                        isCorrect
                          ? "bg-green-50 border-green-500"
                          : "bg-red-50 border-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                            isCorrect ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">
                            {question.question_text}
                          </div>
                          <div dir="rtl" className="text-sm">
                            <p className="text-green-700 font-semibold flex items-center justify-between">
                              <div>✅ الإجابة الصحيحة: </div>
                              <div>
                                {
                                  question.real_answers.find(
                                    (a) => a.answer_check
                                  )?.answer_text
                                }
                              </div>
                            </p>
                            {picked !== null && (
                              <p
                                className={`font-semibold ${
                                  isCorrect ? "text-green-700" : "text-red-700"
                                }`}
                              >
                                {isCorrect ? "✅" : "❌"} إجابتك:{" "}
                                {getUserAnswerDisplay(question, picked)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (question?.type == "arrangePuzzle") {
                  return (
                    <>
                      <div
                        dir="ltr"
                        key={index}
                        className={`p-3 rounded-xl border-r-4 ${
                          isCorrect
                            ? "bg-green-50 border-green-500"
                            : "bg-red-50 border-red-500"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 mb-1">
                              لعبة تسميع الكلمات{" "}
                              {question?.gameType == "word" ? "جملة" : "كلمة"}
                            </div>
                            <div dir="rtl" className="text-sm">
                              <p className="text-green-700 font-semibold flex items-center justify-between">
                                <div>✅ الإجابة الصحيحة: </div>
                                <div>
                                  {question?.correctSentence ||
                                    question?.question_text}
                                </div>
                              </p>
                              {picked !== null &&
                                Array.isArray(picked) &&
                                picked.length > 0 && (
                                  <p
                                    className={`font-semibold ${
                                      isCorrect
                                        ? "text-green-700"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {isCorrect ? "✅" : "❌"} إجابتك:{" "}
                                    {getUserAnswerDisplay(question, picked)}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <WordArrangementPuzzle
                        onChange={(e) => handleArrangePuzzle(e)}
                        // selectedQuestion={selectedQuestion}
                        id={question?.question_id}
                        gameType={question.type}
                        correctSentence={question?.correctSentence}
                        scrambledWords={question?.str_shuffle}
                        defaultArranged={picked || []} // ✅ pre-fill arranged words
                      /> */}
                    </>
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
                      className={`p-3 rounded-xl border-r-4 ${
                        isCorrect
                          ? "bg-green-50 border-green-500"
                          : "bg-red-50 border-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                            isCorrect ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">
                            لعبة توصيل العناصر
                          </div>
                          <div dir="rtl" className="text-sm">
                            <p className="text-green-700 font-semibold flex items-center justify-between">
                              <div>✅ التوصيلات الصحيحة المتوقعة: </div>
                              <div>{totalPairs}</div>
                            </p>
                            {Array.isArray(picked) && picked.length > 0 && (
                              <p
                                className={`font-semibold ${
                                  isCorrect ? "text-green-700" : "text-red-700"
                                }`}
                              >
                                {isCorrect ? "✅" : "❌"} نتيجتك: {correctPairs}
                                /{totalPairs} وصلات صحيحة
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // === QUIZ SCREEN (single viewport, inner scroll) ===
  return (
    <div
      dir="rtl"
      className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-300 via-rose-200 to-indigo-200 p-3"
    >
      <div className="grid h-full grid-rows-[auto,1fr] gap-3 container py-0">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-rose-600 text-white rounded-2xl shadow-xl px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h1 className="font-extrabold text-xl">📋 التنقل بين الأسئلة</h1>

            {/* Navigator (horizontal, scrollable) */}
            <div className="flex items-center gap-2">
              <button
                className={`inline-flex items-center text-white justify-center gap-2 rounded-full p-3 font-bold shadow ${
                  questionIndex === 0
                    ? "bg-gray-300  opacity-40 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 "
                }`}
                disabled={questionIndex === 0}
                onClick={handlePrevQuestion}
              >
                <ArrowRight />
              </button>

              <div className="bg-white/25 rounded-full px-3 py-2 overflow-x-auto">
                <div className="flex gap-2">
                  {submittedAnswers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      className={`w-9 h-9 md:w-11 md:h-11 rounded-full font-bold text-white shadow transition-transform hover:scale-110 ring-offset-2 ${
                        index === questionIndex
                          ? "ring-4 ring-yellow-300 animate-pulse"
                          : ""
                      } ${getPaginationButtonColor(index)}`}
                      title={`سؤال ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {questionIndex == data.length - 1 && (
                <button
                  onClick={handleFinishQuiz}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white px-4 py-3 font-bold shadow"
                >
                  <Trophy /> إنهاء الاختبار
                </button>
              )}

              {questionIndex !== data.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white p-3 font-bold shadow"
                >
                  <ArrowLeft />
                </button>
              )}
            </div>

            {/* Legend + Timer */}
            <div className="flex items-center justify-between gap-4">
              {/* <div className="hidden sm:flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                  الحالي
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                  صحيح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-500" />
                  خاطئ
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500" />
                  معلق
                </span>
              </div> */}
              {timer && (
                <div className="flex items-center gap-2 bg-white/25 rounded-full px-3 py-2">
                  <Clock className="text-white" />
                  <span className="font-extrabold text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Top progress */}
          <div className="mt-3 h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${((questionIndex + 1) / data.length) * 100}%` }}
            />
          </div>
        </header>

        {/* Body: 2 columns (Side Panel + Main) */}
        <div className=" h-full">
          {/* Main Card */}
          <main className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl h-full flex flex-col">
            {/* Question */}
            {selectedQuestion.type !== "line-match" && (
              <div className="p-4 border-b">
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-3 shadow">
                  <h2 dir="ltr" className="text-xl font-bold text-blue-800 m-0">
                    {data[questionIndex]?.question_text} 🤔
                  </h2>
                </div>
              </div>
            )}

            {/* Content (scrollable) */}
            <div className="p-4 grow overflow-y-auto w-full rounded-xl overflow-hidden">
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
                    // selectedQuestion={selectedQuestion}
                    id={selectedQuestion?.question_id}
                    gameType={selectedQuestion?.gameType}
                    correctSentence={selectedQuestion?.correctSentence}
                    scrambledWords={selectedQuestion?.str_shuffle}
                    defaultArranged={answers[questionIndex] || []} // ✅ pre-fill arranged words
                  />
                  {/* <LineMatchingGame /> */}
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 dir="ltr">{data[questionIndex].question_text}</h4>
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

              {/* Feedback */}
              {submittedAnswers[questionIndex] && !selectedQuestion && (
                <div className="mt-4 space-y-2">
                  <div className="bg-green-50 border-r-4 border-green-500 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="text-green-600" />
                      <h4 className="text-green-800 font-bold m-0">
                        الإجابة الصحيحة
                      </h4>
                    </div>
                    <p className="text-green-700 font-semibold m-0">
                      {correctAnswer}
                    </p>
                  </div>
                  {wrongAnswers.map((opt, i) => (
                    <div
                      key={i}
                      className="bg-red-50 border-r-4 border-red-500 p-2 rounded-xl"
                    >
                      <p className="text-red-700 font-semibold m-0">❌ {opt}</p>
                    </div>
                  ))}
                </div>
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
