import axios from 'axios';
import { Eye } from 'lucide-react';
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaEyeSlash } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { base_url } from '../../constants';
import './login.css';
import { MetaTags, pageMetaTags } from '../../utils/metaTags';

const Login = () => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    pass: ''
  });

  const handleSub = () => {
    if (loginData.email == '') {
      toast.warn('أدخل البريد الإلكتروني');
      return;
    }
    if (loginData.pass == '') {
      toast.warn('أدخل كلمة المرور');
      return;
    }
    setLoginLoading(true);
    const data_send = {
      ...loginData
    };
    axios
      .post(base_url + '/user/auth/new_login.php', JSON.stringify(data_send))
      .then((res) => {
        console.log(res.data)
        if (res.data.status == 'success') {
         
          const encryptedData = btoa(unescape(encodeURIComponent(JSON.stringify(res.data.message))));
          localStorage.setItem('elmataryapp', encryptedData);

          window.location.href = "/";
          toast.success(res.data.status)
        } else if ((res.data.status = 'error')) {
          toast.error(res.data.message);
        } else {
          toast.error('حدث خطأ ما');
        }
      })
      .finally(() => {
        setLoginLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <MetaTags {...pageMetaTags.login} />
      <div
        dir="rtl"
        className="flex justify-center items-center p-2 py-3 font-sans bg-gradient-to-br from-blue-50 to-pink-50"
        style={{ fontFamily: 'Cairo, Playpen Sans Arabic, sans-serif' }}
      >
        <div
          className="flex overflow-hidden flex-col items-stretch w-full max-w-4xl bg-white rounded-3xl border-t-8 border-blue-400 shadow-2xl md:flex-row"
        >
          {/* Right side: Welcome/graphic */}
          <div className="hidden flex-col gap-4 justify-center items-center p-6 w-1/2 bg-gradient-to-br from-blue-100 to-pink-100 md:flex">
            <span className="text-5xl">📚</span>
            <h2 className="mb-1 text-2xl font-bold text-gray-800">أهلاً بعودتك!</h2>
            <p className="mb-1 text-base text-center text-gray-600">سجّل دخولك وابدأ رحلتك التعليمية معنا اليوم.</p>
            <div className="flex gap-2 justify-center">
              <span className="text-2xl animate-bounce">🌟</span>
              <span className="text-2xl animate-pulse">📖</span>
              <span className="text-2xl animate-bounce">✏️</span>
            </div>
          </div>
          {/* Left side: Form */}
          <div className="flex flex-col flex-1 justify-center p-4 md:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSub();
              }}
              className="flex flex-col gap-3 mx-auto max-w-lg"
            >
              <div className="mb-1 text-right">
                <h3 className="mb-0 text-xl font-bold text-gray-700">تسجيل الدخول</h3>
                <p className="text-sm text-gray-500">أدخل بياناتك للمتابعة</p>
              </div>

              <div className="mb-2 text-right">
                <label
                  htmlFor="phone"
                  className="flex flex-row-reverse gap-1 justify-end items-center mb-1 text-base font-bold text-gray-700"
                >
                 رقم الهاتف
                  <span className="mx-3 text-lg">📧</span>
                  </label>
                <input
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value });
                  }}
                  className="p-3 w-full text-sm text-right rounded-xl border-2 border-blue-200 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  type="phone"
                  id="phone"
                  placeholder="أدخل رقم الهاتف..."
                />
              </div>

              <div className="mb-2 text-right">
                <label
                  htmlFor="password"
                  className="flex flex-row-reverse gap-1 justify-end items-center mb-1 text-base font-bold text-gray-700"
                >
                  كلمة المرور
                  <span className="mx-3 text-lg">🔐</span>
                  </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setLoginData({ ...loginData, pass: e.target.value });
                    }}
                    className="p-3 pr-10 w-full text-sm text-right rounded-xl border-2 border-blue-200 transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    type={showPass ? "text" : "password"}
                    id="password"
                    placeholder="أدخل كلمة المرور..."
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 text-blue-500 transition-colors duration-200 transform -translate-y-1/2 hover:text-blue-700"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <Eye className="text-lg" color="black" />
                    ) : (
                      <FaEyeSlash className="text-lg text-[black]" color="black" />
                    )}
                  </button>
                </div>
              </div>

              <button
                className="flex gap-2 justify-center items-center p-3 w-full text-base font-bold text-white bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl shadow-lg transition-all duration-300 transform hover:from-blue-600 hover:to-pink-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Spinner size="sm" color="blue" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🚀</span>
                    دخول
                  </>
                )}
              </button>

              <div className="flex flex-col gap-2 mt-2 mb-1 sm:flex-row">
                {/* <button
                  type="button"
                  className="flex flex-1 gap-1 justify-center items-center p-2 w-full text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-xl border-2 border-yellow-200 transition-all duration-300 sm:w-auto hover:bg-yellow-200 hover:border-yellow-300"
                  onClick={() => navigate("/reset-password")}
                >
                  <span className="text-base">🤔</span>
                  نسيت كلمة المرور؟
                </button> */}
                <div className="mt-2 text-right">
                <span className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                  هل تحتاج للمساعدة؟
                </span>
              </div>
                <button
                  type="button"
                  className="flex flex-1 gap-1 justify-center items-center p-2 w-full text-sm font-semibold text-green-800 bg-green-100 rounded-xl border-2 border-green-200 transition-all duration-300 sm:w-auto hover:bg-green-200 hover:border-green-300"
                  onClick={() => navigate("/signup")}
                >
                  <span className="text-base">✨</span>
                  مستخدم جديد؟ سجل الآن
                </button>
              </div>

           
              <div className="mt-2 text-right">
                <p className="text-sm font-semibold text-blue-600">
                  🎓 التعلم معنا ممتع وسهل!
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
