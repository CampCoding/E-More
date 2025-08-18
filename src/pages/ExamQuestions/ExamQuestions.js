import { questions } from "../../utils/data";
import Quiz from "../../components/Quiz/Quiz";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../constants";
import { useEffect, useState } from "react";
import { testQuestions } from "./testPage";
import { decryptData } from "../../utils/decrypt";
import useExamQuestions from "./useExamQuestions";
import useGetUserData from "../../Hooks/ApiHooks/useGetUserData";

export default function ExamQuestions() {
  const { id } = useParams();
  const location = useLocation();
  const timer = location?.state?.timer;
  const [pageLoading, setPageLoading] = useState(false);
  // const [exams, setExams] = useState([]);
  const userData = useGetUserData()

  const {
    handlePostData,
    data: { message: exams },
    loading,
  } = useExamQuestions(id);



  useEffect(()=>{
    console.log("userData" , userData)
  },[userData])

  // useEffect(() => {
  //   const localData = localStorage.getItem("elmataryapp");
  //   const decryptedUserData = decryptData(localData);
  //   setUserData(decryptedUserData);
  //   console.log(decryptedUserData);
  //   if (decryptedUserData && decryptedUserData?.student_id) {
  //     const getCourses = () => {
  //       const data_send = {
  //         student_id: decryptedUserData?.student_id,
  //         token_value: decryptedUserData?.token_value,
  //         exam_id: id
  //       };
  //       axios
  //         .post(
  //           base_url + "/user/courses/select_exam_questions.php",
  //           JSON.stringify(data_send)
  //         )
  //         .then((res) => {
  //           if (res.data.status == "success") {
  //             setExams(res.data.message);
  //           }
  //         })
  //         .catch((e) => console.log(e))
  //         .finally(() => {
  //           setPageLoading(false);
  //         });
  //     };
  //     getCourses();
  //   } else {
  //     setExams(testQuestions);
  //   }
  // }, []);

  return (
    <div className="">
      {exams && exams?.length ? (
        <Quiz data={exams} timer={timer} />
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
                No Questions Available
              </h3>
              <p className="text-gray-600 mb-8">
                There are no questions available for this exam at the moment.
                Please contact your instructor or try again later.
              </p>
              <div className="space-y-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-0 animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">
                  Waiting for questions to load...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
