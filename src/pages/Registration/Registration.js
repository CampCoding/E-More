import React, { useState } from 'react';
import './registration.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { base_url } from '../../constants';
import { Spinner } from 'react-bootstrap';

const Registration = () => {
  const navigate = useNavigate();
  const [signLoading, setSignLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    pass: '',
    student_name: '',
    university_id: '1',
    grade_id: '1',
  });
  const [confPass, setConfPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.pass || !formData.student_name) {
      toast.warn('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (formData.pass !== confPass) {
      toast.warn('كلمات المرور غير متطابقة');
      return;
    }

    setSignLoading(true);
    try {
      const response = await axios.post(`${base_url}user/auth/signup_2.php`, {
        pass: formData.pass,
        student_name: formData.student_name,
        university_id: formData.university_id,
        grade_id: formData.grade_id,
        phone: formData.phone
      });
      
      if (response.data.status == "success") {
        toast.success('تم التسجيل بنجاح!');
        const encryptedData = btoa(unescape(encodeURIComponent(JSON.stringify(response.data.message))));
        localStorage.setItem('elmataryapp', encryptedData);
        navigate('/');
      } else {
        toast.error(response.data.status || 'حدث خطأ في التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('حدث خطأ في التسجيل');
    } finally {
      setSignLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex justify-center items-center p-4 min-h-[82vh] font-sans bg-gradient-to-br from-green-100 via-blue-100 to-blue-200" style={{ fontFamily: 'Cairo, Playpen Sans Arabic, sans-serif' }}>
      <div className="flex overflow-hidden flex-col items-stretch w-full max-w-3xl bg-white rounded-2xl border-t-4 border-green-400 shadow-xl md:flex-row">
        {/* Right side: Welcome/graphic */}
        <div className="hidden flex-col gap-4 justify-center items-center p-2 w-1/2 bg-gradient-to-br from-green-100 to-blue-100 md:flex">
          <span className="text-4xl">🎉</span>
          <h2 className="mb-1 text-2xl font-bold text-gray-800">انضم للأكاديمية!</h2>
          <p className="mb-1 text-base text-center text-gray-600">سجّل حسابك وابدأ رحلتك التعليمية معنا اليوم.</p>
          <div className="flex gap-2 justify-center">
            <span className="text-xl animate-bounce">🌟</span>
            <span className="text-xl animate-pulse">📚</span>
            <span className="text-xl animate-bounce">🎯</span>
          </div>
        </div>
        {/* Left side: Form */}
        <div className="flex flex-col flex-1 justify-center p-6">
          {/* Form Card */}
          <div className="mb-4 text-right">
            <h3 className="mb-1 text-2xl font-bold text-gray-700">تسجيل حساب جديد</h3>
            <p className="text-base text-gray-500">أدخل بياناتك للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto w-full max-w-lg">
            <div className="text-right">
              <label htmlFor="phone" className="flex flex-row-reverse gap-2 justify-end items-center mb-2 text-base font-bold text-gray-700">
                رقم الهاتف
                <span className="text-lg">📱</span>
              </label>
              <input
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                value={formData.phone}
                id="phone"
                placeholder="أدخل رقم الهاتف..."
                type="tel"
                className="py-2 px-3 w-full text-base text-right rounded-lg border-2 border-gray-200 transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>

            <div className="text-right">
              <label htmlFor="student_name" className="flex flex-row-reverse gap-2 justify-end items-center mb-2 text-base font-bold text-gray-700">
                الاسم الكامل
                <span className="text-lg">👤</span>
              </label>
              <input
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                value={formData.student_name}
                id="student_name"
                placeholder="أدخل اسمك الكامل..."
                type="text"
                className="py-2 px-3 w-full text-base text-right rounded-lg border-2 border-gray-200 transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>

            <div className="text-right">
              <label htmlFor="pass" className="flex flex-row-reverse gap-2 justify-end items-center mb-2 text-base font-bold text-gray-700">
                كلمة المرور
                <span className="text-lg">🔒</span>
              </label>
              <input
                onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                value={formData.pass}
                id="pass"
                placeholder="أدخل كلمة المرور..."
                type="password"
                className="py-2 px-3 w-full text-base text-right rounded-lg border-2 border-gray-200 transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>

            <div className="text-right">
              <label htmlFor="confPass" className="flex flex-row-reverse gap-2 justify-end items-center mb-2 text-base font-bold text-gray-700">
                تأكيد كلمة المرور
                <span className="text-lg">🔐</span>
              </label>
              <input
                onChange={(e) => setConfPass(e.target.value)}
                value={confPass}
                id="confPass"
                placeholder="أعد إدخال كلمة المرور..."
                type="password"
                className="py-2 px-3 w-full text-base text-right rounded-lg border-2 border-gray-200 transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>

            <button 
              className="flex gap-2 justify-center items-center py-3 px-4 w-full text-base font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-md transition-all duration-300 transform hover:from-green-600 hover:to-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
              type="submit"
              disabled={signLoading}
            >
              {signLoading ? (
                <>
                  <Spinner size="sm" />
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  تسجيل الحساب
                </>
              )}
            </button>

            <div className="flex flex-col gap-2 mt-2 sm:flex-row">
              <button
                type="button"
                className="flex flex-1 gap-2 justify-center items-center py-2 px-3 w-full text-sm font-semibold text-blue-800 bg-blue-100 rounded-lg border border-blue-200 transition-all duration-300 sm:w-auto hover:bg-blue-200 hover:border-blue-300"
                onClick={() => navigate("/login")}
              >
                <span className="text-base">👋</span>
                لدي حساب بالفعل
              </button>
            </div>
            <div className="mt-1 text-center">
              <span className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-100 rounded-full">
                هل لديك حساب؟ يمكنك تسجيل الدخول
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;