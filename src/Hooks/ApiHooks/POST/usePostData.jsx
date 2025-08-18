import React, { useState } from "react";
import {toast} from "react-toastify";
import {  postData } from "../../../api/apiService";

const usePostData = () => {
  const [loading, setLoading] = useState(false);

  const handlePostData = async (
    url = "",
    data,
    onSuccess = () => null,
    statusKey = "status",
  ) => {
    setLoading(true);
    await postData(url, data)
      .then((res) => {
        if (res.data[statusKey] == "success") {
          onSuccess(res);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!";
        throw new Error(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { handlePostData, loading, setLoading };
};

export default usePostData;
