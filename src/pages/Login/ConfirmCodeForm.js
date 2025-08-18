import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ConfirmCode() {
  const { email } = useParams();
  const location = useLocation();
  const [codeData, setCodeData] = useState({ code: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCodeData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(location?.state?.code, codeData);
    if (codeData?.code == location?.state?.code) {
      toast.success("Type New Password");
      navigate("/new-password/" + email);
    } else {
      toast.error("Code Not Correct");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Code</h2>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>A 6-digit code has been sent to your register email</p>
            <p className="font-medium text-red-500">"{email}"</p>
            <p className="text-xs text-gray-500 italic">
              If You Don't Find The Code In Your Email Inbox - Just Check{" "}
              <span className="text-red-500 font-medium">" Spam "</span> Inbox
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Code:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={codeData.code}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-center text-lg font-mono tracking-widest"
              placeholder="Enter 6-digit code"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Confirm Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfirmCode;