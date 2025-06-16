import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  X,
  Send,
  Menu,
  BookOpen,
  User,
  Users,
  ClipboardList,
  LogOut,
  Home,
  DollarSign,
  Settings,
  ChevronDown,
  Search,
  BellRing,
  Clock,
  ArrowRight,
} from "lucide-react";
import { slide as BurgerMenu } from "react-burger-menu";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo_2.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  );
  const [acaData, setAcaData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);

  // Refs for click outside handling
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Enhanced sidebar items with descriptions
  const sidebarItems = [
    {
      path: "/academic-finance/dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Overview & Analytics",
      singleLine: true,
    },
    {
      path: "/academic-finance/class-management",
      icon: BookOpen,
      label: "Class Management",
      description: "Manage Classes",
      singleLine: false,
    },
    {
      path: "/academic-finance/teacher-management",
      icon: User,
      label: "Teacher Management",
      description: "Manage Teachers",
      singleLine: false,
    },
    {
      path: "/academic-finance/student-profile",
      icon: Users,
      label: "Student Profiles",
      description: "Student Information",
      singleLine: false,
    },
    {
      path: "/academic-finance/report-attendance",
      icon: ClipboardList,
      label: "Report Attendance",
      description: "Attendance Reports",
      singleLine: false,
    },
    {
      path: "/academic-finance/payment-management",
      icon: DollarSign,
      label: "Payment & Tuition",
      description: "Financial Management",
      singleLine: false,
    },
  ];

  useEffect(() => {
    const fetchAcaData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/academic-finance/profile`
        );

        if (data.success) {
          setAcaData({
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            role: data.data.role,
            email: data.data.email,
          });
          setProfileImage(data.data.profileImage || profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch consultant data:", error);
      }
    };

    if (isLoggedIn) {
      fetchAcaData();
    }
  }, [backendUrl, isLoggedIn]);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const handleMobileMenuStateChange = (state) => {
    setShowMobileMenu(state.isOpen);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
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
        setShowProfileMenu(false);
        setShowMobileMenu(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      logout();
      navigate("/");
    }
  };

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

        .bm-item-list {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        @media (max-width: 480px) {
          .mobile-menu-header {
            padding: 1.5rem 1rem;
          }

          .mobile-menu-items {
            padding: 0 0.75rem;
          }

          .mobile-menu-item {
            padding: 0.875rem 1rem;
          }
        }
      `}</style>

      {/* Enhanced Navbar */}
      <nav className="bg-gradient-to-r from-white via-green-50/30 to-white backdrop-blur-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 shadow-lg relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/40 via-transparent to-blue-50/40 pointer-events-none"></div>

        {/* Left side - Enhanced Logo Section */}
        <div className="flex items-center relative z-10">
          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 p-3 rounded-2xl hover:bg-green-100/80 transition-all duration-300 group"
            type="button"
          >
            <Menu
              className={`w-6 h-6 text-gray-600 group-hover:text-green-600 transition-all duration-300 ${
                showMobileMenu ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Enhanced Logo */}
          <Link
            to="/academic-finance/dashboard"
            className="flex items-center group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">
                  Academic-Finance Portal
                </span>
                <span className="sm:hidden">Portal</span>
              </p>
              <p className="hidden md:block text-sm text-gray-500 font-medium">
                Financial & Academic Management
              </p>
            </div>
          </Link>
        </div>


        {/* Enhanced Right Menu */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-500 relative z-10">
          {/* Enhanced Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 p-2 rounded-2xl hover:bg-green-100/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={acaData?.profileImage || profileImage}
                    alt="User Profile"
                    className="h-11 w-11 rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                    {acaData?.firstName + " " + acaData?.lastName}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {acaData?.role}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 group-hover:text-green-600 transition-all duration-300 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {acaData?.firstName + " " + acaData?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{acaData?.email}</p>
                    </div>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-left group"
                      onClick={() => {
                        navigate("/academic-finance/profile");
                        setShowProfileMenu(false);
                      }}
                    >
                      <Settings
                        size={18}
                        className="text-gray-500 group-hover:text-green-600"
                      />
                      <span className="text-gray-700 group-hover:text-green-600 font-medium">
                        Profile
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
      </nav>

      {/* Enhanced Mobile Menu */}
      <div className="md:hidden">
        <BurgerMenu
          isOpen={showMobileMenu}
          onStateChange={handleMobileMenuStateChange}
          customBurgerIcon={false}
          customCrossIcon={false}
          disableAutoFocus
          noOverlay={false}
          width={320}
          styles={mobileMenuStyles}
        >
          <div className="mobile-menu-header">
            <div className="mobile-menu-header-content">
              <img src={logo} alt="logo" className="mobile-menu-logo" />
              <div className="mobile-menu-title">
                <h2>Academic-Finance Portal</h2>
                <p>Welcome back!</p>
              </div>
            </div>
          </div>

          <div className="mobile-menu-items">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  onClick={() => handleMobileNavigation(item.path)}
                  className={`mobile-menu-item ${isActive ? "active" : ""}`}
                >
                  <div className="mobile-menu-item-icon">
                    <item.icon size={24} />
                  </div>
                  <div className="mobile-menu-item-content">
                    <span className="mobile-menu-item-label">{item.label}</span>
                    <span className="mobile-menu-item-description">
                      {item.description}
                    </span>
                  </div>
                  {isActive && <div className="mobile-active-indicator" />}
                </div>
              );
            })}
          </div>

          <div className="mobile-menu-footer">
            <button onClick={handleLogout} className="mobile-logout-button">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </BurgerMenu>
      </div>
    </>
  );
};

export default Navbar;
