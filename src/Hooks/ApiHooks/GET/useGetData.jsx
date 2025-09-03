import React, { useState } from "react";
import {toast} from "react-toastify";
import { fetchData } from "../../../api/apiService";

const useGetData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const handleGetData = (
    url = "",
    params,
    onSuccess = () => null,
    statusKey = "status",
    dataKey = "message"
  ) => {
    setLoading(true);
    fetchData(url, params)
      .then((res) => {
        if (res.data[statusKey] == "success") {
          setData(res.data[dataKey]);
          setOriginalData(res.data[dataKey]);

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

  return { handleGetData, data, originalData, loading, setLoading , setData};
};

export default useGetData;
