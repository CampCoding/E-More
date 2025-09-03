import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  SkipForward,
  SkipBack,
  Book,
  Star,
  Award,
  Download,
  Menu,
  X,
  Users,
  Clock,
  Trophy,
  Heart,
  Play,
} from "lucide-react";
import VideoPlayerWithQuiz from "./videoHosting";
import QuizModal from "../../components/QuizModal/QuizModal";
import { toast } from "react-toastify";
import correctSound from "../../assets/mixkit-correct-answer-tone-2870.wav";
import PdfViewer from "../../components/AprysePdfViewer";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../constants";
import { decryptData } from "../../utils/decrypt";
import ReactPdf from "./react-pdf";
import SEO from "../../components/SEO/SEO";
const EMOJIS = ["🌟", "🎈", "🎉", "🎊", "🦄", "📋", "🍭", "🎪"];
const MESSAGES = [
  "Amazing!",
  "Fantastic!",
  "Great Job!",
  "Wonderful!",
  "Super!",
];
const TRY_AGAIN_MESSAGES = [
  "You can do it!",
  "Almost there!",
  "Keep trying!",
  "Don't give up!",
  "Try once more!",
];

export default function KidsCourseContent() {
  const [currentView, setCurrentView] = useState("course");
  const [course_id] = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState({ objId: 0, videoId: 0 });
  const [showContent, setShowContent] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(65);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [courseDataById, setCourseDataById] = useState({});
  const getData = async () => {
    const course = await axios.post(
      `${base_url}admin/courses/select_course_data_by_id.php`,
      {
        course_id: course_id.get("course_id"),
        student_id: decryptedUserData?.student_id,
        token_value: decryptedUserData?.token_value,
      }
    );
    console.log(course);
    setCourseDataById(course?.data?.message);
  };

  useEffect(() => {
    if (course_id.get("course_id")) {
      getData();
    }
  }, [course_id.get("course_id")]);
  const getStudentProgress = async (video_id) => {
    if (
      !video_id ||
      !decryptedUserData?.student_id ||
      !decryptedUserData?.token_value
    )
      return null;
    try {
      const response = await axios.post(
        `${base_url}user/interactive_videos/get_student_progress.php`,
        {
          video_id: video_id,
          student_id: decryptedUserData.student_id,
          token_value: decryptedUserData.token_value,
        }
      );
      if (response.data && response.data.status === "success") {
        setTotalPoints(
          response.data.data.student_answers?.reduce(
            (sum, q) => parseInt(sum) + parseInt(q.points || 0),
            0
          )
        );
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch student progress:", err);
      return null;
    }
  };

  useEffect(() => {
    try {
      document.querySelector("header").style.position = "relative";
    } catch (err) {
      console.log(err);
    }
  }, []);
  const [courseData, setCourseData] = useState([]);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedUserData = decryptData(localData);
  const [pageLoading, setPageLoading] = useState(false);
  const getCourseData = async () => {
    setPageLoading(true);
    const response = await axios.post(
      `${base_url}user/courses/select_course_units.php`,
      {
        course_id: course_id.get("course_id"),
        student_id: decryptedUserData?.student_id,
        token_value: decryptedUserData?.token_value,
      }
    );
    console.log(response);
    setCourseData({
      course_name: course_id?.get("course_name"),
      units: response.data.message,
    });
    console.log(courseData);
    setPageLoading(false);
  };
  useEffect(() => {
    if (course_id) {
      getCourseData();
    }
  }, [course_id]);
  console.log("courseData", courseData);

  const [currentVideo, setCurrentVideo] = useState({});
  const getVideoQuestions = async (videoId) => {
    const response = await axios.post(
      `${base_url}user/interactive_videos/get_video_questions.php`,
      {
        video_id: videoId,
        student_id: decryptedUserData?.student_id,
        token_value: decryptedUserData?.token_value,
      }
    );

    const formattedQuestions =
      response?.data?.message &&
      Array.isArray(response?.data?.message) &&
      (response.data.message || []).map((q) => {
        let answers = [];
        if (Array.isArray(q.real_answers) && q.real_answers.length > 0) {
          answers = q.real_answers.map((ans) => ans.answer_text);
        } else if (typeof q.question_answers === "string") {
          answers = q.question_answers
            .split("//CAMP//")
            .map((ans) => {
              return ans.split("/**exp**/")[0].trim();
            })
            .filter(Boolean);
        }

        let correctAnswer = "";
        if (Array.isArray(q.real_answers)) {
          const correct = q.real_answers.find(
            (ans) => ans.answer_check === true
          );
          if (correct) {
            correctAnswer = correct.answer_text;
          }
        }

        return {
          id: q.interactive_question_id || q.question_id,
          time: Number(q.show_time) || 0,
          question: q.question_text,
          options: answers,
          correctAnswer: q?.correct_answers,
          points: q?.points || 0,
          answered: q.already_answered,
          explanation: Array.isArray(q.real_answers)
            ? (
                q.real_answers.find((ans) => ans.answer_check) ||
                q.real_answers.find(
                  (ans) => ans.answer_exp && ans.answer_exp.trim()
                )
              )?.answer_exp || ""
            : "",
          image: q.question_image || "",
        };
        // {
        //   id: 1,
        //   time: 2,
        //   question: 'What is the capital of France?',
        //   options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        //   correctAnswer: 'Paris',
        //   points: 30,
        //   answered: false
        // },
      });
    console.log(formattedQuestions);
    setQuestions(formattedQuestions);
    console.log(response);
  };
  useEffect(() => {
    if (courseData && courseData?.units?.length > 0) {
      const videoId =
        courseData?.units?.[currentTab]?.videos?.[currentIndex]
          ?.source_video_id;
      getVideoQuestions(videoId);
      getStudentProgress(videoId);

      setCurrentVideo(courseData?.units?.[currentTab]?.videos?.[currentIndex]);
    }
  }, [courseData, currentTab, currentIndex]);
  const handleBackToGrades = () => {
    window.location.href = "/allcourses";
  };

  useEffect(() => {
    setCurrentIndex(1);
    setCurrentTab(1);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnswer("");
    setCurrentQuestion(null);
    setCurrentQuestions([]);
    setShowSuccessAnimation(false);
    setShowWrongAnimation(false);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmitAnswer = async (question) => {
    if (!selectedAnswer) return;

    if (selectedAnswer === question.correctAnswer) {
      const sounds = [
        new Audio(correctSound),
        new Audio(correctSound),
        new Audio(correctSound),
      ];

      sounds.forEach((sound, index) => {
        setTimeout(() => {
          sound.volume = 0.6;
          sound.playbackRate = 1 + index * 0.2;
          sound.play();
        }, index * 200);
      });

      setShowSuccessAnimation(true);
      setQuestions(
        questions.map((q) =>
          q.id == question.id && !q.answered
            ? { ...q, answered: true, open: false }
            : q
        )
      );
      if (currentQuestions?.length) {
        const openQuestions = currentQuestions.filter((q) => q.open);

        if (openQuestions.length > 0) {
          const updatedQuestions = currentQuestions.filter((q) => !q.open);
          console.log(updatedQuestions);
          if (updatedQuestions.length > 0) {
            updatedQuestions[0].open = true;
            setCurrentQuestions(updatedQuestions);
            setTimeout(() => {
              setShowSuccessAnimation(false);
              setAnsweredQuestions([...answeredQuestions, question]);
            }, 2600);

            return;
          } else {
            setTimeout(() => {
              setShowSuccessAnimation(false);
              setCurrentQuestions([]);
              setAnsweredQuestions([...answeredQuestions, question]);
              closeModal();
            }, 2600);
          }
        }
      }
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setAnsweredQuestions([...answeredQuestions, question]);
        setQuestions(
          questions.map((q) =>
            q.id === question.id && !q.answered
              ? { ...q, answered: true, open: false }
              : q
          )
        );
        closeModal();
      }, 2500);
    } else {
      setShowWrongAnimation(true);
      setTimeout(() => setShowWrongAnimation(false), 2000);

      const selectedElement = document.querySelector(
        `input[value="${selectedAnswer}"]`
      ).parentElement;
      selectedElement.classList.add("shake-animation");
      setTimeout(
        () => selectedElement.classList.remove("shake-animation"),
        500
      );

      setSelectedAnswer("");
    }
    // Submit answer to backend
    try {
      const student_id = localStorage.getItem("student_id");
      const token_value = localStorage.getItem("token_value");
      await axios.post(
        `${base_url}/user/interactive_videos/submit_answer.php`,
        {
          student_id: decryptedUserData?.student_id,
          token_value: decryptedUserData?.token_value,
          interactive_question_id: question.id,
          student_answer: selectedAnswer,
          answer_time_in_video: Math.floor(question.time),
        }
      );
      getStudentProgress(currentVideo?.source_video_id);
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  const handleNextVideo = () => {
    if (currentIndex < courseData.units[currentTab]?.videos?.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (currentTab < courseData.units.length - 1) {
      setCurrentTab((prev) => prev + 1);
      setCurrentIndex(0);
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();

      if (isModalOpen) {
        setIsModalOpen(false);
        setCurrentQuestion(null);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (currentTab > 0) {
      setCurrentTab((prev) => prev - 1);
      setCurrentIndex(
        courseData.units[currentTab - 1]?.videos?.length - 1 || 0
      );
    }
  };

  const handleSelectVideo = (unitIndex, videoIndex) => {
    setCurrentTab(unitIndex);
    setCurrentIndex(videoIndex);
  };

  if (currentView === "grades") {
    return (
      <div className="min-h-screen !bg-gradient-to-br !from-red-500 !via-blue-500 !to-indigo-600">
        <div className="!text-center !py-20">
          <h1 className="!text-6xl !font-bold !text-white !mb-8 !drop-shadow-2xl">
            Back to Grade Levels!
          </h1>
          <button
            onClick={() => setCurrentView("course")}
            className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 hover:!from-yellow-300 hover:!to-orange-400 !text-blue-900 !font-bold !py-6 !px-12 !rounded-full !text-2xl !transform hover:!scale-110 !transition-all !duration-500 !shadow-2xl hover:!shadow-3xl !border-none"
          >
            ✨ Return to Course ✨
          </button>
        </div>
      </div>
    );
  }

  const [currentQuestions, setCurrentQuestions] = useState([]);

  return (
    <div
      className="!min-h-screen !bg-gradient-to-br !from-cyan-200 !via-blue-300 !to-red-300 !animate-gradient-x !min-w-[100%]"
      style={{
        direction: "rtl",
        fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif",
      }}
    >
      <SEO
        title={
          currentVideo?.name ? `الفيديو: ${currentVideo?.name}` : "مشاهدة الدرس"
        }
        lang="ar"
      />
      <QuizModal
        isOpen={isModalOpen && !document.fullscreenElement && currentQuestion}
        onClose={closeModal}
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        onSubmit={handleSubmitAnswer}
        isFullscreen={false}
        showSuccess={showSuccessAnimation}
        showWrong={showWrongAnimation}
      />

      {currentQuestions && currentQuestions?.length
        ? currentQuestions.map((question, index) => (
            <QuizModal
              isOpen={
                isModalOpen && !document.fullscreenElement && question?.open
              }
              onClose={closeModal}
              question={question}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              onSubmit={handleSubmitAnswer}
              isFullscreen={false}
              showSuccess={showSuccessAnimation}
              showWrong={showWrongAnimation}
            />
          ))
        : null}

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
      {/* <div className="!bg-white/90 !backdrop-blur-xl !shadow-2xl !sticky !top-0 !z-50 !border-none">
        <div className="!max-w-7xl !mx-auto !px-2 sm:!px-4 !py-2 sm:!py-4">
          <div className="!flex !flex-col sm:!flex-row !items-center !justify-between !gap-4">
            <button
              onClick={handleBackToGrades}
              className="!w-full sm:!w-auto !flex !items-center !justify-center !text-blue-800 hover:!text-red-700 !transition-all !duration-500 !bg-gradient-to-r !from-white/70 !to-blue-100/70 !rounded-full !px-4 sm:!px-6 !py-2 sm:!py-3 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !border-none"
            >
              <ArrowLeft className="!ml-2 sm:!ml-3 !text-lg sm:!text-xl !animate-bounce" />
              <span className="!font-bold !text-sm sm:!text-lg">
                🏠 العودة إلى الصفوف
              </span>
            </button>

            <div
              className="!flex !flex-wrap !items-center !justify-center sm:!justify-end !gap-2 sm:!gap-4 !w-full sm:!w-auto"
              style={{ flexDirection: 'row-reverse' }}
            >
              <div className="!bg-gradient-to-r !from-yellow-400 !via-orange-400 !to-red-400 !rounded-full !px-3 sm:!px-6 !py-2 sm:!py-3 !shadow-xl !border-none">
                <div className="!flex !items-center !text-white !font-bold !text-xs sm:!text-base">
                  🎯 التقدم: {progress}%
                </div>
              </div>

              <motion.div
                key={totalPoints}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="!bg-gradient-to-r !from-purple-500 !via-pink-500 !to-red-500 !rounded-full !px-3 sm:!px-6 !py-2 sm:!py-3 !shadow-xl !border-none"
              >
                <div className="!flex !items-center !text-white !font-bold !text-xs sm:!text-base">
                  <Trophy className="!ml-1 sm:!ml-2 !text-yellow-300" />
                  <span>النقاط: {totalPoints}</span>
                </div>
              </motion.div>

              <button
                onClick={() => setShowContent(!showContent)}
                className="!bg-gradient-to-r !from-blue-600 !to-red-600 hover:!from-blue-500 hover:!to-red-500 !text-white !p-2 sm:!p-3 !rounded-full !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !transition-all !duration-300 !border-none"
              >
                {showContent ? (
                  <X className="!text-lg sm:!text-xl" />
                ) : (
                  <Menu className="!text-lg sm:!text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="!max-w-[100%] !mx-auto !px-1 sm:!px-4 !py-2 sm:!py-2">
        <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-4 sm:!gap-8">
          <div className="lg:!col-span-2">
            <div className="!bg-white !rounded-2xl sm:!rounded-3xl !shadow-2xl !overflow-hidden !transform !transition-all !duration-500 !border-none ">
              <div className="!bg-gradient-to-r !from-blue-600 !via-red-500 !to-indigo-600 !px-2 !py-2 !animate-gradient-x">
                <div className="!flex !min-w-[100%] !items-center !justify-between">
                  <div className="!flex !items-center !text-white">
                    <div>
                      <h2 className="!text-xl sm:!text-3xl !font-bold !drop-shadow-lg">
                        🎬{" "}
                        {currentVideo?.name
                          ? `الفيديو: ${currentVideo?.name}`
                          : "الفيديو"}
                      </h2>
                      {/* <p className="!opacity-90 !text-sm sm:!text-xl !font-semibold">
                        ⏰ المدة: {currentVideo?.video_duration ? currentVideo?.video_duration : "00:00"}
                      </p> */}
                    </div>
                  </div>
                  {currentVideo?.pdf_url && (
                    <button
                      onClick={() => setShowPdfModal(currentVideo?.pdf_url)}
                      className="
    block
    px-4
    py-2
    rounded-full
    text-white
    font-bold
    text-[1.2rem]
    border-none
    cursor-pointer
    transition
    duration-200
    hover:scale-105
    bg-gradient-to-r from-[#4f8cff] to-[#a084ee]
    shadow-[0_4px_24px_rgba(160,132,238,0.33)]
    rtl:font-cairo
  "
                      style={{
                        fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif",
                      }}
                    >
                      📄 عرض ملف الدورة
                    </button>
                  )}
                </div>
              </div>
              <div className="!bg-black !aspect-video md:h-[initial] !max-w-[100%]">
                {questions && currentVideo?.loom_url && (
                  <VideoPlayerWithQuiz
                    isFullScreen={document.fullscreenElement}
                    handleFullScreen={handleFullScreen}
                    questions={questions && questions?.length ? questions : []}
                    currentQuestion={currentQuestion}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    setCurrentQuestion={setCurrentQuestion}
                    setCurrentQuestions={setCurrentQuestions}
                    selectedAnswer={selectedAnswer}
                    currentVideo={currentVideo}
                    videoUrl={currentVideo?.loom_url}
                    setSelectedAnswer={setSelectedAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                    onSubmit={handleSubmitAnswer}
                    currentQuestions={currentQuestions}
                    closeModal={closeModal}
                    showSuccess={showSuccessAnimation}
                    showWrong={showWrongAnimation}
                    answeredQuestions={
                      answeredQuestions && answeredQuestions?.length
                        ? answeredQuestions
                        : []
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {showContent && (
            <div className="lg:!col-span-1">
              <div className="!bg-white !rounded-2xl sm:!rounded-3xl !shadow-2xl !overflow-auto !transform !transition-all !duration-500 !border-none  lg:!max-h-[125vh]">
                <div className="!bg-gradient-to-r  !from-green-500 !via-teal-500 !to-blue-500 !px-4 sm:!px-8 !py-4 sm:!py-6 !animate-gradient-x">
                  <div className="!flex !items-center !text-white">
                    {/* <Book className="!ml-2 sm:!ml-4 !text-2xl sm:!text-3xl !animate-bounce" /> */}
                    <div>
                      <h3 className="!text-xl sm:!text-2xl !font-bold !drop-shadow-lg">
                        📚 دروس الدورة
                      </h3>
                      <p className="!opacity-90 !text-sm sm:!text-lg !font-semibold">
                        اختر مغامرتك! 🎯
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.div
                      key={totalPoints}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      className="!bg-gradient-to-r !from-purple-500 !via-pink-500 !to-red-500 !rounded-full !px-3 sm:!px-6 !py-2 sm:!py-3 !shadow-xl !border-none"
                    >
                      <div className="!flex whitespace-nowrap !items-center !text-white !font-bold !text-xs sm:!text-base">
                        <Trophy className="!ml-1 sm:!ml-2 !text-yellow-300" />
                        <span>النقاط: {totalPoints}</span>
                      </div>
                    </motion.div>
                    <div
                      className="!flex !flex-wrap !items-center !justify-center sm:!justify-end !gap-2 sm:!gap-4 !w-full sm:!w-auto"
                      style={{ flexDirection: "row-reverse" }}
                    >
                   
                    </div>
                  </div>
                </div>

                <div className="!max-h-[100%] !overflow-y-auto">
                  {console.log(courseData, courseData?.units)}
                  {courseData &&
                    courseData.units &&
                    courseData.units.length > 0 &&
                    courseData.units.map((unit, unitIndex) => (
                      <div key={unit.id} className="!border-b !border-gray-200">
                        <div className="!bg-gradient-to-r !from-blue-200 !via-red-200 !to-indigo-200 !px-4 sm:!px-8 !py-3 sm:!py-5 !animate-gradient-x">
                          <h4 className="!font-bold !text-blue-900 !text-base sm:!text-xl !flex !items-center !flex-wrap !gap-2">
                            <span>{unit.unit_name}</span>
                            {unitIndex === currentTab && (
                              <span className="!bg-gradient-to-r !from-yellow-400 !to-orange-400 !text-blue-900 !px-3 !py-1 sm:!px-4 sm:!py-2 !rounded-full !text-xs sm:!text-sm !font-bold !shadow-lg !border-none">
                                ⭐ الوحدة الحالية
                              </span>
                            )}
                          </h4>
                        </div>

                        <div className="!px-3 sm:!px-6 !py-2 sm:!py-4">
                          {unit.videos &&
                            unit.videos.length > 0 &&
                            unit.videos.map((video, videoIndex) => (
                              <button
                                key={video.id}
                                onClick={() =>
                                  handleSelectVideo(unitIndex, videoIndex)
                                }
                                className={`!w-full !text-right !p-3 sm:!p-5 !rounded-xl sm:!rounded-2xl !mb-2 sm:!mb-3 !transition-all !duration-500 !transform hover:!scale-105 !shadow-lg hover:!shadow-2xl !border-none ${
                                  unitIndex === currentTab &&
                                  videoIndex === currentIndex
                                    ? "!bg-gradient-to-r !from-blue-600 !to-red-600 !text-white"
                                    : "!bg-gradient-to-r !from-gray-100 !to-blue-50 hover:!from-blue-100 hover:!to-red-100 !text-gray-800"
                                }`}
                              >
                                <div className="!flex !items-center !justify-between">
                                  <div className="!flex !items-center">
                                    <div
                                      className={`!w-8 !h-8 sm:!w-10 sm:!h-10 !rounded-full !flex !items-center !justify-center !ml-3 sm:!ml-4 !font-bold !text-base sm:!text-lg !border-none ${
                                        unitIndex === currentTab &&
                                        videoIndex === currentIndex
                                          ? "!bg-white !text-blue-600 !shadow-lg"
                                          : "!bg-blue-300 !text-blue-800"
                                      }`}
                                    >
                                      {videoIndex + 1}
                                    </div>
                                    <div>
                                      <p className="!font-bold !text-sm sm:!text-lg">
                                        🎥 {video.video_title}
                                      </p>
                                      <p
                                        className={`!text-xs sm:!text-base !font-semibold ${
                                          unitIndex === currentTab &&
                                          videoIndex === currentIndex
                                            ? "!text-white/90"
                                            : "!text-gray-600"
                                        }`}
                                      >
                                        ⏱️{" "}
                                        {video.video_duration
                                          ? video.video_duration
                                          : "00:00"}
                                      </p>
                                    </div>
                                  </div>

                                  {unitIndex === currentTab &&
                                    videoIndex === currentIndex && (
                                      <div className="!flex !items-center">
                                        <Star className="!text-yellow-300 !fill-current !text-xl sm:!text-2xl !animate-spin" />
                                      </div>
                                    )}
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showPdfModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(30,40,60,0.25)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "rtl",
            fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif",
          }}
          onClick={() => setShowPdfModal(false)}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(60,60,60,0.18)",
              padding: 24,
              maxWidth: 950,
              width: "90vw",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              border: "1.5px solid rgba(255,255,255,0.35)",
              position: "relative",
              direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPdfModal(false)}
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: "pointer",
                boxShadow: "0 2px 8px #aaa",
                zIndex: 123456,
              }}
              aria-label="إغلاق ملف PDF"
            >
              ×
            </button>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                borderRadius: 16,
                overflow: "auto",
                background: "#fff",
              }}
            >
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  marginBottom: 12,
                  color: "#2d3748",
                }}
              >
                ملف الدورة التدريبية
              </div>
              <ReactPdf url={showPdfModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
