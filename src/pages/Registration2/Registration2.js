import React, { useEffect, useState } from "react";
// import './registration.css'
// import { universitiesData from './data';
import "react-phone-input-2/lib/style.css";
// import './registration.css'
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate } from "react-router";
import axios, { Axios } from "axios";
import {
  API_ROUTES,
  BASES_ROUTES,
  BASE_URL
} from "../../components/axios/BASE_URL";
import { toast } from "react-toastify";
import { base_url } from "../../constants";
// import { Sign1 } from './functions/Sign1'; 
import { Spinner } from "react-bootstrap";
import { UserData } from "../../components/axios";
// import { Sign2 } from './functions/Sign2';
 
const Registration2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  // console.log(location.state)
  const code = location?.state;
  const [changeData, setChangeData] = useState("");
  const [selectedUnis, setSelectedUnis] = useState("");
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [universities, setUniversities] = useState([]);
  const [regData2, setRegData2] = useState({
    pass: "",
    student_name: "",
    university_id: "",
    grade_id: "",
    phone: ""
  });
  const [changeShow, setChangeShow] = useState("email");
  const [confPass, setConfPass] = useState("");
  const [signLoading, setSignLoading] = useState(false);

  const getUnis = () => {
    axios
      .get(base_url + "/user/auth/select_universities_grade.php")
      .then((res) => {
        if (res.data.status == "success") {
          setUniversities(res.data.message);
          setRegData2({
            ...regData2,
            grade_id: null
          });
          setRegData2({
            ...regData2,
            university_id: null
          });
          // setSelectedUnis(res.data.message[0].university_id);
          // setGrades(res.data.message[0].grades);
          // setSelectedGrade(res.data.message[0].grades[0].grade_id);
        }
      })
      .catch((e) => console.log(e));
  };

  const Sign2 = () => {
    if (regData2.student_name == "") {
      toast.warn("أدخل اسمك");
      return;
    }
    if (regData2.pass == "") {
      toast.warn("أدخل كلمة المرور");
      return;
    }
    if (confPass !== regData2.pass) {
      toast.warn("تحقق من كلمة المرور وتأكيدها");
      return;
    }
    if (regData2.university_id == "") {
      toast.warn("اختر مدرستك");
      return;
    }
    if (selectedGrade == "") {
      toast.warn("اختر صفك الدراسي");
      return;
    }
    if (regData2.phone == "") {
      toast.warn("أدخل رقم هاتفك");
      return;
    }
    setSignLoading(true);
    const data_send = {
      email: location?.state?.registData?.email,
      ...regData2,
      grade_id: selectedGrade,
      token_value: UserData?.token_value
    };

    axios
      .post(base_url + "/user/auth/signup_2.php", JSON.stringify(data_send))
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          const encryptedData = btoa(
            JSON.stringify({ ...res.data.message, password: regData2?.pass })
          );
          localStorage.setItem("elmataryapp", encryptedData);
          // navigate("/", { replace: true });
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
          // setChangeData('login')
          // navigate('/login',{replace:true});
        } else if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.error("حدث خطأ ما");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setSignLoading(false);
      });
  };

  useEffect(() => {
    if (changeData == "login") {
      window.location.reload();
    }
  }, [changeData]);

  useEffect(() => {
    getUnis();
  }, []);

  return (
    <div dir="rtl" className= "flex justify-center items-center p-4 min-h-screen font-sans " style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="flex overflow-hidden flex-col w-full max-w-4xl bg-white rounded-2xl shadow-2xl md:flex-row-reverse !border-t-8 !border-red-500 !border-solid">
        {/* Form Side */}
        <div className="flex flex-col flex-1 justify-center p-8 w-full md:w-2/3 min-h-[95vh]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 m-0">أكمل تسجيلك</h2>
            <p className="text-gray-600 text-base mt-2">خطوات قليلة تفصلك عن عالم من المعرفة!</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); Sign2(); }} className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label htmlFor="f_name" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">👤</span>ما هو اسمك؟
                </label>
                <input onChange={(e) => { setRegData2({ ...regData2, student_name: e.target.value }); }} placeholder="أدخل اسمك الكامل..." type="text" id="f_name"
                  className="w-full py-2 px-3 !border-2 !border-solid !border-blue-200 rounded-lg text-base text-right focus:!border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-300" />
              </div>
              <div>
                <label htmlFor="pass" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">🔒</span>أنشئ كلمة مرور
                </label>
                <input onChange={(e) => { setRegData2({ ...regData2, pass: e.target.value }); }} id="pass" placeholder="اجعلها قوية وسرية!" type="password"
                  className="w-full py-2 px-3 !border-2 !border-solid !border-blue-200 rounded-lg text-base text-right focus:!border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-300" />
              </div>
              <div>
                <label htmlFor="confpass" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">✅</span>تأكيد كلمة المرور
                </label>
                <input onChange={(e) => { setConfPass(e.target.value); }} id="confpass" placeholder="اكتب كلمة المرور مرة أخرى..." type="password"
                  className="w-full py-2 px-3 !border-2 !border-solid !border-blue-200 rounded-lg text-base text-right focus:!border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-300" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="mob" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">📱</span>رقم هاتفك
                </label>
                <div className="!border-2 !border-solid !border-blue-200 rounded-lg overflow-hidden focus-within:!border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition-all duration-300">
                  <PhoneInput country={"jo"} value={""} onChange={(e) => { setRegData2({ ...regData2, phone: e }); }}
                    inputStyle={{ width: '100%', padding: '20px 50px', border: 'none', fontSize: '1rem', textAlign: 'right', outline: 'none' }}
                    containerStyle={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <label htmlFor="uni_id" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">🏫</span>اختر مدرستك
                </label>
                <select value={regData2.university_id} onChange={(e) => { setRegData2({ ...regData2, university_id: e.target.value }); let allData = [...universities]; let newData = allData.filter((item) => item.university_id == e.target.value); setGrades(newData[0].grades); setSelectedGrade(newData[0]?.grades[0]?.grade_id); }} id="uni_id" className="w-full py-2.5 px-3 !border-2 !border-solid !border-blue-200 rounded-lg text-base text-right focus:!border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-300 bg-white">
                  <option value={null}>اختر مدرستك...</option>
                  {universities.map((item, index) => <option key={index} value={item.university_id}>{item.university_name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="grade_id" className="flex items-center gap-2 mb-2 font-bold text-gray-700 text-base">
                  <span className="text-lg">📊</span>اختر صفك الدراسي
                </label>
                <select value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setRegData2({ ...regData2, grade_id: e.target.value }); }} id="grade_id" className="w-full py-2.5 px-3 !border-2 !border-solid !border-blue-200 rounded-lg text-base text-right focus:!border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-300 bg-white">
                  <option value={null}>اختر صفك الدراسي...</option>
                  {grades.map((item, index) => <option key={index} value={item.grade_id}>{item.grade_name}</option>)}
                </select>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:from-red-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4" type="submit" disabled={signLoading}>
              {signLoading ? (<> <Spinner size="sm" /> جارٍ إعداد حسابك... </>) : (<> <span className="text-xl">🎉</span> ابدأ رحلتي التعليمية! </>)}
            </button>
            <div className="text-center mt-2">
              <p className="text-sm">
                لديك حساب بالفعل؟{" "}
                <button type="button" className="font-semibold text-blue-600 hover:text-red-500 transition-colors" onClick={() => navigate("/login")}>
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </form>
        </div>
        {/* Welcome Side */}
        <div className="hidden md:flex flex-col gap-6 justify-center items-center p-8 w-full md:w-1/3 bg-gradient-to-br from-red-100 to-blue-100">
          <span className="text-6xl">🚀</span>
          <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">مرحباً بك في أكاديميتنا</h2>
          <p className="mb-4 text-base text-center text-gray-600">نحن سعداء بانضمامك إلينا. استعد لتجربة تعليمية فريدة وممتعة!</p>
          <div className="flex gap-4 justify-center">
            <span className="text-4xl animate-bounce">🌟</span>
            <span className="text-4xl animate-pulse">🎓</span>
            <span className="text-4xl animate-bounce">📚</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration2;
