import React, { useContext, useEffect, useState } from "react";
import { Search, UserPlus, LogIn } from "lucide-react"; // Import biểu tượng từ Lucide
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import userImage from "../../assets/3.jpg";
import axios from "axios";
import Loading from "../Loading";

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [studentData, setStudentData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/student/dashboard`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          setStudentData(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(
          "Fetch student data error:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Failed to load dashboard"
        );
        logout(); // Gọi logout từ context khi lỗi xác thực
        navigate("/login");
      }
    };

    if (isLoggedIn) {
      fetchStudentData();
    } else {
      navigate("/");
    }
  }, [backendUrl, isLoggedIn, logout, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        logout(); //
        toast.success("Logged out successfully!");
        navigate("/");
        setIsDropdownOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      logout();
      navigate("/");
    }
  };

  return (
    <nav className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-300">
      {/* Logo */}
      <div className="flex-shrink-0 flex">
        <img className="h-12 w-12 rounded-sm" src={logo} alt="Logo" />
        <span className=" hidden md:flex justify-center text-center pl-5 pt-2 text-2xl font-bold">
          Hello
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-grow mx-4 min-w-0 max-w-md ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Find the course"
            className="w-full h-12 py-2 px-4 pl-12 justify-center border shadow-sm border-gray-300 rounded-full focus:outline-none focus:ring-yellow-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={25}
          />
        </div>
      </div>

      {/* Login-Signup Form and User Menu */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {isLoggedIn && studentData ? (
          <div className="flex items-center space-x-2 relative">
            <p className=" text-lg text-gray-800 font-semibold hidden md:block">
              {studentData.firstName} {studentData.lastName}
            </p>
            <div className=" relative">
            <img
              src={userImage}
              alt="User Profile"
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 top-full">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Dashboard
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/student/profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
            </div>
          </div>
        ) : (
          <>
            <button
              className="flex items-center space-x-2 shadow-sm bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition text-base"
              onClick={() => navigate("/login")}
            >
              <UserPlus size={20} />
              <span>Login</span>
            </button>
            <button
              className="items-center space-x-2 shadow-sm text-white px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-base md:inline-flex hidden"
              onClick={() => navigate("/signup")}
            >
              <LogIn size={20} />
              <span>Sign Up</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
