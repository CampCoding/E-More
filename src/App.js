import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router";
import SEO from "./components/SEO/SEO";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import Footer from "./components/Footer/Footer";
import Books from "./pages/Books/Books";
import Cart from "./pages/Cart/Cart";
import Units from "./pages/Unit/Units";
import Profile from "./pages/Profile/Profile";
import CourseContent from "./pages/courseVideos";
import VideoPlayer from "./pages/courseVideos/new-player";
import ProfileUnits from "./pages/Profile/ProfileUnits/ProfileUnits";
import ProfileVideo from "./pages/Profile/ProfileUnits/ProfileVideo/ProfileVideo";
import AllCourses from "./pages/AllCourses/AllCourses";
import Contact from "./pages/Contact/Contact";
import TechSup from "./components/TechSup/TechSup";
import { useEffect, useState } from "react";
// import ExpandList from './components/ExpandList/ExpandList';
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from 'react-bootstrap';
import "react-loading-skeleton/dist/skeleton.css";
import { Object } from "core-js";
import ExternalRedirectGuard from "./pages/ExternalRedirectGuard/ExternalRedirectGuard";
import Registration2 from "./pages/Registration2/Registration2";
import { ToastContainer, toast } from "react-toastify";
import CourseQuestions from "./pages/CourseQuestions/CourseQuestions";
import VideoQuestions from "./pages/VideoQuestions/VideoQuestions";
import axios from "axios";
import { base_url } from "./constants";
import "./newStyle.css";
import VideoLoader from "./components/loader";
import CourseVideo from "./pages/Home/Courses/CourseVideo/CourseVideo";
import Enroll from "./pages/Unit/Enroll/Enroll";
import FloatingActionButton from "./components/helpcenter";
import Subscribe from "./pages/subscribe";
import MyCourses from "./pages/mycourses/AllCourses";
import Exams from "./pages/Exams/Exams";
import ExamContent from "./pages/ExamContent/ExamContent";
import ExamQuestions from "./pages/ExamQuestions/ExamQuestions";
import FinalResult from "./pages/FinalResult/FinalResult";
import Questions from "./pages/Questions/Questions";
import CourseUnit from "./pages/CourseUnit/CourseUnit";
import CourseTopic from "./pages/CourseTopics/CourseTopics";
import QuestionBank from "./pages/QuestionBank/QuestionBank";
import AllUnivs from "./pages/AllCourses/AllUnivs";
import AllGrades from "./pages/AllCourses/Allgrades";
import Coursesquestions from "./pages/mycourses/Coursesquestions";
import Unitquestions from "./pages/AllCourses/Unitquestions";
import AllCoursesLanding from "./pages/AllCourses/AllCourseslanding";
import Examslanding from "./pages/AllCourses/Examslanding";
import CoursesquestionsLanding from "./pages/AllCourses/CoursesquestionsLanding";
import ResetPassword from "./pages/Login/ResetPasswordForm";
import ConfirmCode from "./pages/Login/ConfirmCodeForm";
import NewPassword from "./pages/Login/NewPasswordForm";
import FreeCourses from "./pages/Home/FreeCourses";
import { decryptData } from "./utils/decrypt";
import DraftsPage from "./pages/Drafts/DraftsPage";
import LineMatchingGame from "./Drafts.jsx/Match";
import WordArrangementPuzzle from "./Drafts.jsx/WordArrangement";
import TopHeader from "./components/Header/TopHeader";
import MobileNavBar from './components/Header/MobileNavBar';
import NotesPage from "./pages/Notes/NotesPage";

function App() {
  const { pathname } = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, [pathname]);

  const [allLoading, setAllLoading] = useState(true);
  return (
    <div className="">
      <>
        <>
          <SEO title="المستر الفلاح | Mr. Elfallah" lang="ar" />
          <TopHeader />
          <Header />
          {/* <MobileNavBar /> */}

          <FloatingActionButton />
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/line-matching" element={<LineMatchingGame />} />
            <Route
              path="/word-arrangement"
              element={<WordArrangementPuzzle />}
            />
            <Route path="/confirm-code/:email" element={<ConfirmCode />} />
            <Route path="/new-password/:email" element={<NewPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscribe" element={<Subscribe />} />
            {/* <Route path="*" element={<VideoPlayer />} /> */}
            <Route path="/drafts" element={<DraftsPage />} />
            <Route path="/notes" element={<NotesPage />} />

            {userData && Object.keys(userData).length > 0 ? (
              <>
                <Route path="/book" element={<Books />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/units" element={<Units />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profileunits" element={<ProfileUnits />} />
                <Route path="/lessonvideo" element={<ProfileVideo />} />
                <Route path="/allcourses/:id" element={<AllCourses />} />
                <Route path="/allgrades/:id" element={<AllGrades />} />
                <Route path="/allcourses" element={<AllUnivs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/techsup" element={<TechSup />} />
                <Route path="/videos" element={<CourseVideo />} />
                <Route path="/supscripe" element={<Subscribe />} />
                <Route path="/CourseContent" element={<CourseContent />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/coursedetails" element={<CourseDetails />} />
                <Route path="/studentCourses" element={<MyCourses />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/examContent/:examId" element={<ExamContent />} />
                <Route path="/examQuestion/:id" element={<ExamQuestions />} />
                <Route path="/finalResult/:score" element={<FinalResult />} />
                <Route path="/questions" element={<Coursesquestions />} />
                <Route path="/questionsunits/:id" element={<Unitquestions />} />
                <Route path="/questions/:id" element={<Questions />} />
                <Route path="/courseunits" element={<CourseUnit />} />
                <Route path="/courseTopic" element={<CourseTopic />} />
                <Route path="/questionBank/:id" element={<QuestionBank />} />
                <Route path="/coursequestions" element={<CourseQuestions />} />
                <Route path="/videoquestions" element={<VideoQuestions />} />
                <Route path="/freecourses" element={<FreeCourses />} />
                <Route path="*" element={<Home />} />
              </>
            ) : (
              <>
                <Route path="/coursedetails" element={<CourseDetails />} />
                <Route index path="/" element={<Home />} />
                <Route path="/freecourses" element={<FreeCourses />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/signup" element={<Registration />} />
                <Route path="/supscripe" element={<Subscribe />} />
                <Route path="/signup2" element={<Registration2 />} />
                <Route path="/login" element={<Login />} />
                <Route path="/book" element={<Books />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/CourseContent" element={<CourseContent />} />
                <Route path="/finalResult/:score" element={<FinalResult />} />
                <Route path="/techsup" element={<TechSup />} />
                <Route path="/allcourses" element={<AllUnivs />} />
                <Route path="/units" element={<Units />} />
                <Route path="/allcourses/:id" element={<AllCourses />} />
                <Route path="/allgrades/:id" element={<AllGrades />} />
                <Route path="/exams" element={<Examslanding />} />
                <Route path="*" element={<Home />} />
                <Route path="/examQuestion/:id" element={<ExamQuestions />} />
                <Route
                  path="/questions"
                  element={<CoursesquestionsLanding />}
                />
              </>
            )}
            { }
          </Routes>
        </>
      </>
      { }

      <ToastContainer />
      { }
    </div>
  );
}

export default App;
