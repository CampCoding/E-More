import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  ArrowRight,
  Star,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import useGetData from "../../Hooks/ApiHooks/GET/useGetData";
import useExams from "./useExams";

const Exams = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [exams, setExams] = useState([]);

  // Mock navigate function - replace with actual useNavigate
  const navigate = (path, options) => {
    window.location.href = path;
  };

  const { handlePostData, data, loading } = useExams();
  useEffect(() => {
    console.log("examsData", data);
  }, [data]);

  // Mock API call - replace with actual axios call
  useEffect(() => {
    const getCourses = () => {
      // Simulate API loading
      setTimeout(() => {
        // Mock exam data - replace with actual API response
        const mockExams = [
          {
            exam_id: 1,
            exam_name: "Mathematics Challenge",
            exam_description:
              "Test your math skills with fun problems and puzzles!",
            exam_time: 45,
            end_date: "2025-07-15",
          },
          {
            exam_id: 2,
            exam_name: "Science Explorer",
            exam_description:
              "Discover amazing facts about the world around us!",
            exam_time: 30,
            end_date: "2025-07-20",
          },
          {
            exam_id: 3,
            exam_name: "Language Adventure",
            exam_description:
              "Practice reading, writing, and vocabulary skills!",
            exam_time: 35,
            end_date: "2025-07-25",
          },
        ];
        setExams(mockExams);
        setPageLoading(false);
      }, 1000);
    };
    getCourses();
  }, []);

  const getExamIcon = (index) => {
    const icons = ["📐", "🔬", "📚", "🎨", "🌍", "⚡"];
    return icons[index % icons.length];
  };

  const getGradientClass = (index) => {
    const gradients = [
      "from-blue-500 via-blue-500 to-pink-500",
      "from-emerald-500 via-teal-500 to-cyan-500",
      "from-orange-500 via-red-500 to-pink-500",
      "from-indigo-500 via-blue-500 to-cyan-500",
      "from-pink-500 via-rose-500 to-red-500",
      "from-yellow-500 via-orange-500 to-red-500",
    ];
    return gradients[index % gradients.length];
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">⏳</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Loading Your Exams...
          </h2>
          <div className="w-16 h-2 bg-gradient-to-r from-blue-400 to-blue-400 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-25 animate-pulse"></div>
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-15 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-blue-300 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-6 animate-bounce">🎓</div>
          <h1 className="text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Your Exams
            </span>
          </h1>
          {/* <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-xl font-medium">
            Ready to show what you've learned? Let's ace these exams! ✨
          </p> */}
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl border border-white/50 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-800">
              {exams.length}
            </div>
            <div className="text-gray-600">Available Exams</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl border border-white/50 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-800">Ready</div>
            <div className="text-gray-600">To Excel</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl border border-white/50 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-2xl font-bold text-gray-800">Let's Go!</div>
            <div className="text-gray-600">Start Learning</div>
          </div>
        </div> */}

        {/* Exams Grid */}
        {data?.message && data?.message.length >= 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.message?.map((exam, index) => (
              <div
                key={exam.exam_id}
                className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border-2 border-white/50 hover:border-white/80 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden"
                onClick={() => {
                  navigate(`/examQuestion/${exam.exam_id}`, {
                    state: {
                      timer: exam.exam_time,
                    },
                  });
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/20 rounded-tr-full"></div>

                {/* Card Header */}
                <div
                  className={`bg-gradient-to-br ${getGradientClass(
                    index
                  )} p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex justify-between items-start mb-4">
                    <div className="text-4xl animate-bounce group-hover:animate-pulse">
                      {getExamIcon(index)}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-2 drop-shadow-lg group-hover:animate-pulse">
                    {exam.exam_name}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6 relative">
                  <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                    {exam.exam_description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-700">Time</span>
                      </div>
                      <span className="text-blue-600 font-bold">
                        {exam.exam_time} Min
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-700">
                          Due Date
                        </span>
                      </div>
                      <span className="text-blue-600 font-bold">
                        {exam.end_date}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full bg-gradient-to-r border-none ${getGradientClass(
                      index
                    )} hover:opacity-90 text-white py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:animate-pulse`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Zap className="w-5 h-5 group-hover:animate-bounce" />
                      <span>Start Exam!</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/50 shadow-2xl">
            <div className="text-8xl mb-6 animate-bounce">📚</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No Exams Available
            </h3>
            <p className="text-gray-600 text-lg">
              Check back later for new exciting exams!
            </p>
            <div className="mt-6">
              <button className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Refresh Page</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>

          <div className="relative">
            <div className="text-6xl mb-4 animate-bounce">🎯</div>
            <h2 className="text-3xl font-black mb-4 drop-shadow-lg">
              You've Got This!
            </h2>
            <p className="text-lg opacity-90 font-medium drop-shadow-md">
              Every exam is a chance to shine and show your amazing skills! ⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
