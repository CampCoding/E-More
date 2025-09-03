import React, { useState } from 'react';
import { MapPin, Calendar, BookOpen, Users, Target, MessageCircle, UserIcon, Edit, Save, X } from 'lucide-react';
import { decryptData } from '../../utils/decrypt';
import { Link } from 'react-router-dom';
import { base_url } from '../../constants';
import axios from 'axios';

// Get decrypted user data from localStorage
const localData = localStorage.getItem("elmataryapp");
const decryptedUserData = decryptData(localData);

const QuickActions = () => (
  null
  // <div className="mb-12">
  //   <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
  //     إجراءات سريعة
  //   </h2>
  //   <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  //     <Link
  //       to="/courseunits"
  //       className="bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl text-white p-6 rounded-2xl font-medium transition-all duration-300 flex flex-col items-center gap-3 group"
  //     >
  //       <BookOpen size={28} />
  //       <span className="text-sm font-medium">بدء درس جديد</span>
  //     </Link>
  //     <Link
  //       to="/profileunits"
  //       className="bg-gradient-to-br from-red-500 to-red-600 hover:shadow-xl text-white p-6 rounded-2xl font-medium transition-all duration-300 flex flex-col items-center gap-3 group"
  //     >
  //       <Users size={28} />
  //       <span className="text-sm font-medium">انضم لمجموعة</span>
  //     </Link>
  //     <Link
  //       to="/exams"
  //       className="bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-xl text-white p-6 rounded-2xl font-medium transition-all duration-300 flex flex-col items-center gap-3 group"
  //     >
  //       <Target size={28} />
  //       <span className="text-sm font-medium">اختبار سريع</span>
  //     </Link>
  //     <Link
  //       to="/questions"
  //       className="bg-gradient-to-br from-green-500 to-teal-500 hover:shadow-xl text-white p-6 rounded-2xl font-medium transition-all duration-300 flex flex-col items-center gap-3 group"
  //     >
  //       <MessageCircle size={28} />
  //       <span className="text-sm font-medium">محادثة مباشرة</span>
  //     </Link>
  //   </div>
  // </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    student_name: decryptedUserData?.student_name || '',
    phone: decryptedUserData?.phone || '',
    pass: '' // Password field for updates
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await axios.post(base_url + 'user/auth/profile-update.php', {
        student_id: decryptedUserData?.student_id,
        student_name: formData.student_name,
        phone: formData.phone,
        pass: formData.pass
      });


      if (result?.data?.status === 'success') {
        setMessage('تم تحديث الملف الشخصي بنجاح!');
        
        // Update localStorage with new data
        const updatedUserData = {
          ...decryptedUserData,
          student_name: formData.student_name,
          phone: formData.phone
        };

        const encryptedData = btoa(unescape(encodeURIComponent(JSON.stringify(updatedUserData))));
        localStorage.setItem('elmataryapp', encryptedData);
        
        // Note: You'll need to import encryptData function
        // const encryptedData = encryptData(updatedUserData);
        // localStorage.setItem("elmataryapp", encryptedData);
        
        setIsEditing(false);
        
        // Clear password field
        setFormData(prev => ({ ...prev, pass: '' }));
        
        // Reload page after 2 seconds to show success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } else if (result.status === 'invalid') {
        setMessage('يرجى ملء جميع الحقون المطلوبة.');
      } else {
        setMessage('حدث خطأ أثناء تحديث الملف الشخصي.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      student_name: decryptedUserData?.student_name || '',
      phone: decryptedUserData?.phone || '',
      pass: ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30" dir="rtl">
      <div className="max-w-2xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center gap-6">
          <UserIcon size={100} />
          {/* <img
            src={decryptedUserData?.profile_image}
            alt="الملف الشخصي"
            className="w-24 h-24 rounded-full border-4 border-white shadow-2xl"
          /> */}
          {!isEditing ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                مرحباً بعودتك، <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">{decryptedUserData?.student_name}</span>
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                استمر في رحلتك التعليمية الرائعة! 🚀
              </p>
              
              {/* Display user info */}
              <div className="w-full space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="font-medium">{decryptedUserData?.student_name || 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-medium">{decryptedUserData?.phone || 'غير محدد'}</p>
                </div>
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">الموقع</p>
                  <p className="font-medium">{decryptedUserData?.location || 'غير محدد'}</p>
                </div> */}
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                  <p className="font-medium">{decryptedUserData?.join_date || 'غير محدد'}</p>
                </div> */}
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <Edit size={20} />
                تعديل المعلومات
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                تعديل المعلومات الشخصية
              </h2>
              
              {/* Message display */}
              {message && (
                <div className={`w-full p-4 rounded-lg ${
                  message.includes('نجح') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              {/* Edit form */}
              <form className="w-full space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور الجديدة *
                  </label>
                  <input
                    type="password"
                    name="pass"
                    value={formData.pass}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        حفظ التغييرات
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <X size={20} />
                    إلغاء
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <div className="mt-12">
          <QuickActions />
        </div>
        {/* 
        // The following sections are commented out as per instructions:
        <div className="mt-12">
          <StatsGrid userData={decryptedUserData} />
        </div>
        <div className="mt-12">
          <CoursesList courses={courses} />
        </div>
        <div className="mt-12">
          <AchievementsSection achievements={achievements} />
        </div>
        <div className="mt-12">
          <UpcomingLessons lessons={upcomingLessons} />
        </div>
        */}
      </div>
    </div>
  );
};

export default Profile;