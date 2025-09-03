import React, { useEffect, useState } from "react";
import useGetData from "../../Hooks/ApiHooks/GET/useGetData";
import useGetUserData from "../../Hooks/ApiHooks/useGetUserData";
import usePostData from "./../../Hooks/ApiHooks/POST/usePostData";

const useExams = () => {
  const { handlePostData, loading, setLoading } = usePostData();
  const [data, setData] = useState([]);
  const userData = useGetUserData();

  useEffect(() => {
    console.log("userData", userData);
    const handleSuccess = ({data}) =>{
      console.log("successData" , data);
      setData(data);
    }
    
    handlePostData(
      "user/exams/get_exams.php",
      JSON.stringify({ student_id: userData.student_id }),
      handleSuccess
    );
  }, []);

  return { handlePostData, data, loading };
};

export default useExams;
