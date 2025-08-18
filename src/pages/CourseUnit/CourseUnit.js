import { useNavigate } from 'react-router';
import './CourseUnit.css';
const course_unit = [
    {
        unit_name:"Surgery",
        unit_description:"The Comprehensive General Surgery Course is a rigorous and dynamic educational program designed to provide aspiring surgeons, medical students, and healthcare professionals with a comprehensive foundation in the field of general surgery.",
    },
    {
        unit_name:"Surgery",
        unit_description:"The Comprehensive General Surgery Course is a rigorous and dynamic educational program designed to provide aspiring surgeons, medical students, and healthcare professionals with a comprehensive foundation in the field of general surgery.",
    },
    {
        unit_name:"Surgery",
        unit_description:"The Comprehensive General Surgery Course is a rigorous and dynamic educational program designed to provide aspiring surgeons, medical students, and healthcare professionals with a comprehensive foundation in the field of general surgery.",
    }
]


export default function CourseUnit() {
    const navigate = useNavigate();
  return (
    <div style={{padding:"40px"}}>
        <h1>Course Units</h1>
        <div className="course_units_container">
            {course_unit.map(unit => (
                <div className="course_units_card" onClick={() => {navigate("/courseTopic")}}>
                    <img src="/download.png" alt="Unit image"/> 
                    <div>
                    <h2>{unit.unit_name} unit</h2>
                    <p>{unit.unit_description.substring(0,50)}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
