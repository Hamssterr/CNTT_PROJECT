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
  BellRing,
  Calendar
} from "lucide-react";
import { slide as BurgerMenu } from "react-burger-menu";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo_2.png";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [consultantData, setConsultantData] = useState(null);

  // Refs for click outside handling
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Sidebar items
  const sidebarItems = [
    {
      path: "/consultant/dashboard",
      icon: Home,
      label: "Dashboard",
      singleLine: true,
    },
    {
      path: "/consultant/notifications",
      icon: BellRing,
      label: "Notifications",
      singleLine: true,
    },
    {
      path: "/consultant/lead-management",
      icon: Users, // Icon mới cho Lead Management
      label: ["Lead", "Management"],
      singleLine: false,
    },
    {
      path: "/consultant/schedule",
      icon: Calendar, // Icon mới cho Schedule
      label: "Schedule",
      singleLine: true,
    },
    {
      path: "/consultant/courses-classes",
      icon: BookOpen, // Icon mới cho Courses
      label: "Courses",
      singleLine: true,
    },
  ];

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Lead",
      message: "You have a new lead assignment.",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "Reminder",
      message: "Follow up with client ABC is due today.",
      time: "1 hour ago",
    },
  ]);

  // Toggle functions
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileMenu(false);
  };

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

  // Handle notification dismiss
  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

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

  // Mobile menu styles
  const mobileMenuStyles = {
    bmBurgerButton: {
      display: "none", // Ẩn nút mặc định vì chúng ta dùng custom
    },
    bmCrossButton: {
      display: "none", // Ẩn nút đóng mặc định
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
      {/* CSS Styles cho mobile menu */}
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

      <div className="flex items-center justify-between px-4 md:px-8 border-gray-500 py-3 relative bg-white shadow-sm">
        {/* Left side - Hamburger + Logo */}
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10" />
            <p className="ml-2 md:ml-10 text-lg md:text-xl font-bold">
              <span className="hidden sm:inline">Consultant Portal</span>
              <span className="sm:hidden">Portal</span>
            </p>
          </Link>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-3 md:gap-5 text-gray-500 relative">
          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <Bell
              className="w-5 h-5 cursor-pointer transition duration-300 hover:opacity-70"
              onClick={toggleNotifications}
            />
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-72 max-w-[90vw] bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <Bell className="text-gray-600" size={20} />
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <Bell className="text-orange-500 mt-1" size={18} />
                      <div className="ml-3 flex-1">
                        <h4 className="text-md font-medium text-gray-800">
                          {notif.title}
                        </h4>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-400">{notif.time}</p>
                      </div>
                      <button
                        onClick={() => handleDismiss(notif.id)}
                        className="ml-3 text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <div
              className="cursor-pointer hover:text-gray-700 flex items-center gap-1"
              onClick={toggleProfileMenu}
            >
              <span className="hidden sm:inline">Consultant</span>
              <span className="sm:hidden">T</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/consultant/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  Profile
                </button>

                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu với thư viện react-burger-menu */}
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
          {/* Header với logo */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-header-content">
              <img src={logo} alt="logo" className="mobile-menu-logo" />
              <div className="mobile-menu-title">
                <h2>Consultant Portal</h2>
                <p>Welcome back!</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
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

          {/* Footer với logout */}
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
