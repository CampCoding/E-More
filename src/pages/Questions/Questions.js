import { useNavigate } from 'react-router';
import './Questions.css';

const  all_courses = [
    {
        course_name:"General Surgery",
        course_content:"The Comprehensive General Surgery Course is a rigo...",
    },
    {
        course_name:"GIT 2022",
        course_content:"The Comprehensive General Surgery Course is a rigo...",
    },
    {
        course_name:"Specialm Surgery 2022",
        course_content:"The Comprehensive General Surgery Course is a rigo...",
    },
    {
        course_name:"GIT 2022",
        course_content:"The Comprehensive General Surgery Course is a rigo..."
    }
]
export default function Questions() {
    const navigate = useNavigate();
  return (
    <div style={{padding: "40px"}}>
        <h1>Questions</h1>
        <div className="questions_card_container">
            {all_courses.map((course , index) => 
                <div className='questions_card' key={index} onClick={() => {
                    navigate("/courseunits");
                }}>
                    <img src="/1113864724_1692610416item_img.jpeg" alt="surgery image"/>
                    <div>
                    <h2>{course.course_name}</h2>
                    <p>{course.course_content}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
