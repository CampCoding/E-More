import React from 'react'
import './about.css'
const About = ({descrption}) => {
  return (
    <div className='about_page'>
      <img src={require("../../../assets/stu.png")} alt="" />
      <h3>About This Course</h3>
      <p>{descrption}</p>
    </div>
  )
}

export default About
