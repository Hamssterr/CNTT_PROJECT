import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [OTP, setOTP] = useState(0);
  const [isOTPSubmited, setIsOTPSubmited] = useState(false);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const inputRefs = React.useRef([]);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/send-reset-otp", {
        email,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const OTPValue = inputRefs.current.map((el) => el.value).join("");
    setOTP(OTPValue);
    try {
      const { data } = await axios.post(backendUrl + "/api/check-otp", {
        email,
        OTP: OTPValue,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsOTPSubmited(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/reset-password", {
        email,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gray-600">
      {/* email input form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-yellow-400 text-2xl font-semibold text-center mb-4">
            Email Verify OTP
          </h1>
          <p className="text-center mb-6 text-white">
            Enter the 6-digit code sent to your email
          </p>

          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-md">
            <img src={assets.mail_icon} className="w-5 h-5" />
            <input
              type="Email"
              placeholder="Email"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-yellow-500 text-white rounded-full cursor-pointer transition-all duration-300 hover:from-indigo-400 hover:to-indigo-800 hover:scale-105 hover:shadow-lg">
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}
      {!isOTPSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-yellow-400 text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-white">
            Enter the 6-digit code sent to your email
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-3 bg-yellow-500 text-white rounded-full cursor-pointer transition-all duration-300 hover:from-indigo-400 hover:to-indigo-800 hover:scale-105 hover:shadow-lg">
            Submit
          </button>
        </form>
      )}
      {/* new password input form */}
      {isEmailSent && isOTPSubmited && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-yellow-400 text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-white">
            Enter the your new password below
          </p>
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-md">
            <img src={assets.lock_icon} className="w-5 h-5" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 bg-yellow-500 text-white rounded-full cursor-pointer transition-all duration-300 hover:from-indigo-400 hover:to-indigo-800 hover:scale-105 hover:shadow-lg">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default ResetPassword;
