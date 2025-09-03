import { useNavigate } from 'react-router';
import './CourseTopics.css';

const course_topic = [
    {
        topic_name:"Bioterrorism and Disaster Medicine",
    }, 
    {
        topic_name:"Breast Cancer",
    },
    {
        topic_name:"Colorectal Cancer",
    },
    {
        topic_name:"Inflammatory Bowel Disease",
    },
    {
        topic_name:"Medical Malpractice and Legal Issues",
    },
    {
        topic_name:"Pain Management",
    },
    {
        topic_name:"Perioperative Nursing",
    },

]

export default function CourseTopic() {
    const navigate = useNavigate();
    return (
        <div style={{padding :"40px"}}>
            <h1>Course Topic</h1>
            <div className="course_topic_container">
                {course_topic.map(topic => (
                    <div className="course_topic_card" onClick={() => {
                        navigate("/questionBank")
                    }}>
                      <h2>{topic.topic_name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}