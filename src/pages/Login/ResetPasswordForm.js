import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function ResetPassword() {
  const [resetData, setResetData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateRandomCode = () => {
    const nums = "0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += nums[Math.floor(Math.random() * nums.length)];
    }
    return code;
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = generateRandomCode();
    setIsLoading(true);
    axios
      .post(
        "https://medicotoon.com/medicotoon/backend/user/auth/send_code_to_mail.php",
        {
          email: resetData?.email,
          code: code
        }
      )
      .then((res) => {
        if (res?.data?.status) {
          toast.success("Check You Email");
          navigate("/confirm-code/" + resetData?.email, {
            state: {
              code: code
            }
          });
          setIsLoading(false);
        } else {
          toast.error(res?.data?.message);
          setIsLoading(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Back button */}
        <button
          onClick={() => (window.location.href = "/login")}
          className="mb-6 flex items-center !bg-none gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243A6 6 0 0121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your email to receive a reset code
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="resetEmail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="resetEmail"
              name="email"
              value={resetData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send Reset Code"
            )}
          </button>

          {/* Message display */}
          {message && (
            <div
              className={`text-center p-3 rounded-lg text-sm ${
                message.includes('sent')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Remember your password?{" "}
            <button
              onClick={() => console.log("Navigate to login")}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
