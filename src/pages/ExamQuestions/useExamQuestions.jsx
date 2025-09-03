import React, { useEffect, useState } from "react";
import useGetData from "../../Hooks/ApiHooks/GET/useGetData";
import useGetUserData from "../../Hooks/ApiHooks/useGetUserData";
import usePostData from "./../../Hooks/ApiHooks/POST/usePostData";
import { questions } from "../../utils/data";

const useExamQuestions = (id) => {
  const { handlePostData, loading, setLoading } = usePostData();
  const [data, setData] = useState([]);
  const userData = useGetUserData();

  // عشان لو مش مسجل دخول ياصاحبي ما ينفذش الريكويست ع الفاضي
  useEffect(() => {
    console.log("userData", userData);
    if (userData) {
      const handleSuccess = ({ data }) => {
        console.log("successData", data);
        setData(data);
      };
      handlePostData(
        "user/courses/select_exam_questions.php",
        JSON.stringify({
          exam_id: id,
          student_id: userData?.student_id,
          access_token: userData?.token_value,
        }),
        handleSuccess
      );
    } else {
      setData({ message: questions });
    }
  }, []);

  return { handlePostData, data, loading };
};

export default useExamQuestions;
