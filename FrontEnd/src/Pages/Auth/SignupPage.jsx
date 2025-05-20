import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
// Import assets
import logo from "../../assets/logo_2.png";
import mailIcon from "../../assets/mail_icon.svg";
import lockIcon from "../../assets/lock_icon.svg";
import userIcon from "../../assets/person.png"; // Thêm icon cho name fields

const Signup = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        role: "student",
      });
      console.log("Signup response:", data);
      if (data.success) {
        setIsLoggedIn(true);
        toast.success("Sign up successful! Please log in.");
        clearInput();
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Left Side */}
      <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center bg-white">
        <div className="mb-6">
          <img src={logo} alt="logo" className="w-60 h-60" />
        </div>
        <p className="text-3xl text-center text-blue-900">
          TP Education, <br />
          For all students in the world.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 bg-gray-800 flex flex-col justify-center items-center px-6 sm:px-12 py-10">
        <h2 className="text-3xl text-yellow-400 font-semibold mb-2">
          JOIN US!
        </h2>
        <p className="text-white mb-6">Create your account</p>

        <form onSubmit={onSubmitHandler} className="w-full max-w-sm">
          {/* First Name Input */}
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={userIcon} className="w-5 h-5" alt="first name" />
            <input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              type="text"
              placeholder="First Name"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Last Name Input */}
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={userIcon} className="w-5 h-5" alt="last name" />
            <input
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              type="text"
              placeholder="Last Name"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={mailIcon} className="w-5 h-5" alt="email" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={lockIcon} className="w-5 h-5" alt="password" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-yellow-400 hover:scale-105 hover:shadow-lg"
          >
            Create Account
          </button>

          <div className="text-center mt-4">
            <p className="text-white">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>

        <div className="absolute bottom-10">
          <h1 className="text-2xl text-yellow-400 font-bold">TP Education</h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
