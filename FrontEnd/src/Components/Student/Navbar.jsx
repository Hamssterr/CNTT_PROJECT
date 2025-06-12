import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  LogIn,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo_2.png";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import userImage from "../../assets/3.jpg";
import axios from "axios";
import Loading from "../Loading";
import { motion, AnimatePresence } from "framer-motion";

import { Home, Calendar, Wallet, Menu } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [studentData, setStudentData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        logout();
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
        logout();
        toast.success("Logged out successfully!");
        navigate("/");
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
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
    {
      path: "/student/dashboard",
      icon: Home,
      label: "Home",
      description: "Dashboard Overview",
    },
    {
      path: "/student/timetable",
      icon: Calendar,
      label: "Time Table",
      description: "Class Schedule",
    },
    {
      path: "/student/tuition",
      icon: Wallet,
      label: "Tuition",
      description: "Payment & Fees",
    },
  ];

  // Enhanced mobile menu styles
  const mobileMenuStyles = {
    bmBurgerButton: {
      display: "none",
    },
    bmCrossButton: {
      display: "none",
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
      top: 0,
      left: 0,
    },
    bmMenu: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "0",
      fontSize: "1.15em",
      overflowY: "auto",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
    },
  };

  return (
    <>
      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 40;
        }

        .mobile-menu-container {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 320px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
          z-index: 50;
          overflow-y: auto;
        }

        .mobile-menu-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }

        .mobile-menu-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-menu-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-title h2 {
          color: white;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .mobile-menu-title p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          margin: 0;
          margin-top: 0.25rem;
        }

        .mobile-menu-items {
          padding: 0 1rem;
          flex: 1;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          margin-bottom: 0.5rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(8px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-item.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(8px);
        }

        .mobile-menu-item-icon {
          color: white;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-menu-item:hover .mobile-menu-item-icon,
        .mobile-menu-item.active .mobile-menu-item-icon {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .mobile-menu-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-menu-item-label {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.2;
        }

        .mobile-menu-item-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          line-height: 1.2;
        }

        .mobile-active-indicator {
          position: absolute;
          right: 1rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 20px #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .mobile-menu-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .mobile-logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem 1.5rem;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #fef2f2;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-logout-button:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.2);
        }
      `}</style>

      {/* Enhanced Navbar */}
      <nav className="bg-gradient-to-r from-white via-green-50/30 to-white backdrop-blur-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 shadow-lg relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/40 via-transparent to-blue-50/40 pointer-events-none"></div>

        {/* Enhanced Logo Section */}
        <div className="flex-shrink-0 flex items-center relative z-10">
          <div className="relative group">
            <img
              className="h-12 w-12 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
              src={logo}
              alt="Logo"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="hidden md:flex flex-col ml-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Student Portal
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Welcome{" "}
              {isLoggedIn && studentData?.firstName
                ? `${studentData.firstName} ${studentData.lastName}`
                : ""}
            </span>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex-grow mx-6 min-w-0 max-w-md relative z-10">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Find the course"
              className="w-full h-12 py-3 px-5 pl-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300"
              size={20}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Enhanced Right Menu */}
        <div className="flex items-center space-x-4 flex-shrink-0 relative z-10">
          {isLoggedIn && studentData ? (
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden md:flex flex-col items-end">
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {studentData.firstName} {studentData.lastName}
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Student
                </p>
              </div>

              {/* Enhanced Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-1 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={studentData.profileImage || userImage}
                      alt="User Profile"
                      className="h-11 w-11 rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Enhanced Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">
                            {studentData.firstName} {studentData.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {studentData.email}
                          </p>
                        </div>
                        <button
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-left group"
                          onClick={() => {
                            navigate("/student/profile");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Settings
                            size={18}
                            className="text-gray-500 group-hover:text-green-600"
                          />
                          <span className="text-gray-700 group-hover:text-green-600 font-medium">
                            Profile Settings
                          </span>
                        </button>
                        <button
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-left group"
                          onClick={handleLogout}
                        >
                          <LogOut
                            size={18}
                            className="text-gray-500 group-hover:text-red-600"
                          />
                          <span className="text-gray-700 group-hover:text-red-600 font-medium">
                            Logout
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Enhanced Login Button */}
              <button
                className="group relative flex items-center space-x-2 px-6 py-2.5 border-2 border-green-500 text-green-600 rounded-2xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-green-500 hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => navigate("/login")}
              >
                <LogIn
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Login</span>
              </button>

              {/* Enhanced Sign Up Button */}
              <button
                className="group relative flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl font-semibold text-sm transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-green-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:inline-flex hidden"
                onClick={() => navigate("/signup")}
              >
                <UserPlus
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Sign Up</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
              </button>
            </div>
          )}

          {/* Enhanced Mobile Menu Button */}
          {isLoggedIn && (
            <button
              className="md:hidden p-3 rounded-2xl hover:bg-green-100/80 transition-all duration-300 group"
              onClick={toggleMobileMenu}
            >
              <Menu
                size={24}
                className={`text-gray-600 group-hover:text-green-600 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isLoggedIn && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-overlay"
              onClick={toggleMobileMenu}
            />

            {/* Menu Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu-container"
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-header-content">
                  <img src={logo} alt="logo" className="mobile-menu-logo" />
                  <div className="mobile-menu-title">
                    <h2>Student Portal</h2>
                    <p>Welcome back!</p>
                  </div>
                </div>
              </div>

              <div className="mobile-menu-items">
                {sidebarItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`mobile-menu-item ${isActive ? "active" : ""}`}
                    >
                      <div className="mobile-menu-item-icon">
                        <item.icon size={24} />
                      </div>
                      <div className="mobile-menu-item-content">
                        <span className="mobile-menu-item-label">
                          {item.label}
                        </span>
                        <span className="mobile-menu-item-description">
                          {item.description}
                        </span>
                      </div>
                      {isActive && <div className="mobile-active-indicator" />}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mobile-menu-footer">
                <button onClick={handleLogout} className="mobile-logout-button">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
