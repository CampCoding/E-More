import axios from "axios";
import SEO from "../../components/SEO/SEO";
import Quiz from "../../components/Quiz/Quiz";
import { base_url } from "../../constants";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { decryptData } from "../../utils/decrypt";
import QBankQuiz from "../../components/Quiz/QBankQuiz";

export default function QuestionBank() {
  const { id } = useParams();
  console.log("examId", id);
  const [searchParams] = useSearchParams();
  const [pageLoading, setPageLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const localData = localStorage.getItem("elmataryapp");
        const userData = decryptData(localData);

        if (!userData?.student_id || !userData?.token_value) {
          console.warn("Missing user data");
          setPageLoading(false);
          return;
        }

        const data_send = {
          student_id: userData.student_id,
          token_value: userData.token_value,
          unit_id: id,
          course_id: searchParams.get("course_id"),
        };

        const response = await axios.post(
          `${base_url}/user/courses/select_questions.php`,
          JSON.stringify(data_send)
        );

        if (response.data.status === "success") {
          setExams(response.data.message);
          setExamData(response.data.data);
        } else {
          console.warn("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setPageLoading(false);
      }
    };

    getCourses();
  }, [id, searchParams]);

  return (
    <div className="mx-auto">
      <SEO title="بنك الأسئلة | Question Bank" lang="ar" />
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center py-20 !min-w-[100%]">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center max-w-md mx-auto">
            <div className="mb-8">
              {/* أيقونة تحميل */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl shadow-lg mb-6 animate-pulse">
                <svg
                  className="w-10 h-10 text-white animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>

              {/* العناوين */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                جارٍ تحميل الأسئلة
              </h3>
              <p className="text-gray-600 mb-8">
                يرجى الانتظار قليلاً ريثما نقوم بجلب الأسئلة الخاصة بالاختبار.
              </p>

              {/* مؤشرات التحميل */}
              <div className="space-y-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full w-2/3 animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full w-1/2 animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full w-3/4 animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">جاري تجهيز الأسئلة...</p>
              </div>
            </div>
          </div>
        </div>
      ) : exams?.length > 0 ? (
        <QBankQuiz data={exams} examData={examData} examId={id} type="qbank" />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 !min-w-[100%]">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center max-w-md mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl shadow-lg mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                لا توجد أسئلة متاحة
              </h3>
              <p className="text-gray-600 mb-8">
                لا توجد حالياً أسئلة متاحة لهذا الاختبار. يرجى التواصل مع المعلم
                أو المحاولة لاحقًا.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
