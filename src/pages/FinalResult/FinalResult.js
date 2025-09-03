import { useParams } from "react-router"
import './finalResult.css';

export default function FinalResult() {
  const {score} = useParams();
  console.log(score);
  return (
    <div style={{padding:"20px"}}>
      <div className="final_result_container">
        <h2>Quiz Result</h2>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
</svg>

<div className="final_result_box">
  <h4>Your Points</h4>
  <p>{score}</p>
  <div></div>
  <p className="final_result_passing_result">Passing Points : {score}</p>
</div>
        <div></div>
        </div>
    </div>
  )
}
