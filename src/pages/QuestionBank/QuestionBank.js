import axios from "axios";
import SEO from "../../components/SEO/SEO";
import Quiz from "../../components/Quiz/Quiz";
import { questions } from "../../utils/data";
import { base_url } from "../../constants";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { decryptData } from '../../utils/decrypt';
import { useSearchParams } from "react-router-dom";
export default function QuestionBank() {
  const { id } = useParams();
  const [pageLoading, setPageLoading] = useState(false);
  const [exams, setExams] = useState([
    {
      question_text: "What is the capital of France?",
      question_valid_answer: "Paris is the capital and largest city of France.",
      real_answers: [
        { answer_text: "London", answer_check: false },
        { answer_text: "Berlin", answer_check: false },
        { answer_text: "Paris", answer_check: true },
        { answer_text: "Madrid", answer_check: false }
      ]
    },
    {
      question_text: "Which planet is closest to the Sun?",
      question_valid_answer: "Mercury is the closest planet to the Sun.",
      real_answers: [
        { answer_text: "Venus", answer_check: false },
        { answer_text: "Mercury", answer_check: true },
        { answer_text: "Earth", answer_check: false },
        { answer_text: "Mars", answer_check: false }
      ]
    },
    {
      question_text: "What is 2 + 2?",
      question_valid_answer: "2 + 2 equals 4.",
      real_answers: [
        { answer_text: "3", answer_check: false },
        { answer_text: "4", answer_check: true },
        { answer_text: "5", answer_check: false },
        { answer_text: "6", answer_check: false }
      ]
    }
  ]);
  const [course_id] = useSearchParams();
  useEffect(() => {
    const getCourses = () => {
      const localData = localStorage.getItem("elmataryapp");
      const userData = decryptData(localData);
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        unit_id: id,
        course_id: course_id.get("course_id")
      };
      axios
        .post(
          base_url + "/user/courses/select_questions.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status == "success") {
            // setExams(res.data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setPageLoading(false);
        });
    };
    getCourses();
  }, []);
  return (
    <div className="mx-auto">
      <SEO title="بنك الأسئلة | Question Bank" lang="ar" />
      <Quiz data={exams} />
    </div>
  );
}
