import React, { useState, useEffect } from "react";
import "./allcoursesbanner.css";
import { star } from "./svg";
import { decryptData } from "../../../utils/decrypt";

const AllCoursesBanner = ({ selectedTopic, setSelectedTopic }) => {
  const [userData, setUserData] = useState(null);
  const [coursesType, setCoursesType] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const topics = [
    { id: 1, label: "General Surgery" },
    { id: 2, label: "GIT Surgery" },
    { id: 3, label: "Special Surgery" },
    { id: 4, label: "Revisions" },
    { id: 5, label: "Operative" },
    { id: 6, label: "Anatomy" },
    { id: 7, label: "Clinical" },
  ];

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, []);

  return (
    <div className="">
      <h1 style={{ width: "100%" }}> Your Registered Courses</h1>
    </div>
  );
};

export default AllCoursesBanner;
