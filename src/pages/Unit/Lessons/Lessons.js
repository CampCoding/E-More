import React, { useEffect, useState } from 'react'
import CourseDetails from '../../CourseDetails/CourseDetails'

const Lessons = ({course,handleChange,checkOwn}) => {
  // console.log(course)
  // console.log("erer")
  // const [videos,setVideos]=useState([]);
  return (
    <div>
      <CourseDetails checkOwn={checkOwn} course={course} handleChange={handleChange}/>
    </div>
  )
}

export default Lessons
