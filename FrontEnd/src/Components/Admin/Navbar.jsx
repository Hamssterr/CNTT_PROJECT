import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  LogIn,
  Home,
  Route,
  School,
  Database,
  AppWindow,
  User,
  BadgeDollarSign,
  Menu,
} from "lucide-react"; // Import biểu tượng từ Lucide
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
  const [adminData, setAdminData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Trạng thái menu mobile

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
          withCredentials: true,
        });

        if (data.success) {
          setAdminData(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(
          "Fetch admin data error:",
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
      fetchAdminData();
    } else {
      navigate("/");
    }
  }, [backendUrl, isLoggedIn, logout, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  const sidebarItems = [
    { path: "/admin/dashboard", icon: Home, label: "Home" },
    { path: "/admin/course", icon: Route, label: "Course" },
    { path: "/admin/user-management", icon: User, label: "User" },
    {
      path: "/admin/registration-information",
      icon: Database,
      label: "Registration",
    },
    { path: "/admin/banner", icon: AppWindow, label: "Banner" },
    { path: "/admin/class", icon: School, label: "Class" },
    { path: "/admin/tuition", icon: BadgeDollarSign, label: "Tuition" },
  ];

  return (
    <nav className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-300">
      {/* Logo */}
      <div className="flex-shrink-0 flex">
        <img className="h-12 w-12 rounded-sm" src={logo} alt="Logo" />
        <span className=" hidden md:flex justify-center text-center pl-5 pt-2 text-2xl font-bold">
          Hello{" "}
          {isLoggedIn && adminData?.role
            ? adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)
            : ""}
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-grow mx-4 min-w-0 max-w-md ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Find the function"
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
        {isLoggedIn && adminData ? (
          <div className="flex items-center space-x-2">
            <p className=" text-lg text-gray-800 font-semibold hidden md:block">
              {adminData.firstName} {adminData.lastName}
            </p>
            <div className=" relative">
              <img
                src={adminData.profileImage || userImage}
                alt="User Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 top-full">
                  <ul className="py-1">
                    {/* <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Dashboard
                    </li> */}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/admin/profile");
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

        {/* Hamburger Menu Button (hiển thị trên màn hình nhỏ) */}
        {isLoggedIn && (
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={toggleMobileMenu}
          >
            <Menu size={25} className="text-gray-600" />
          </button>
        )}
      </div>
      {/* Mobile Menu (hiển thị khi nhấn hamburger) */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="md:hidden absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 top-20">
          <div className="flex flex-col items-center space-y-4 py-4">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false); // Đóng menu sau khi chọn
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-xl transition cursor-pointer ${
                    isActive
                      ? "bg-orange-200 text-orange-700"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <item.icon
                    size={24}
                    className={isActive ? "text-orange-700" : "text-gray-600"}
                  />
                  <span
                    className={`text-sm ${
                      isActive ? "text-orange-700" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
