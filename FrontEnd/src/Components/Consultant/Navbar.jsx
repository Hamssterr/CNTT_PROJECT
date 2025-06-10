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
  Calendar,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { slide as BurgerMenu } from "react-burger-menu";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo_2.png";
import { motion, AnimatePresence } from "framer-motion";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { backendUrl } = useContext(AppContext);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/notification/all`
      );
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, setNotifications, fetchNotifications };
};

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [consultantData, setConsultantData] = useState(null);
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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

  const handleMarkAsRead = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/consultant/notification/markAsRead/${id}`
      );
      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/consultant/notification/mark-all-read`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
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

  const getNotificationIcon = (type) => {
    const iconProps = { size: 18, strokeWidth: 2 };

    switch (type) {
      case "info":
        return <Info {...iconProps} />;
      case "success":
        return <CheckCircle {...iconProps} />;
      case "warning":
        return <AlertTriangle {...iconProps} />;
      case "error":
        return <XCircle {...iconProps} />;
      case "course":
        return <BookOpen {...iconProps} />;
      case "assignment":
        return <Calendar {...iconProps} />;
      case "student":
        return <Users {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
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
            <div className="relative">
              <Bell
                className="w-5 h-5 cursor-pointer transition duration-300 hover:text-blue-600"
                onClick={toggleNotifications}
              />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate("/consultant/notifications")}
                          className="text-xs hover:underline flex items-center gap-1"
                        >
                          View All <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="hover:bg-white/10 p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                            !notif.read
                              ? "bg-blue-50/40 border-l-2 border-l-blue-400"
                              : ""
                          }`}
                          onClick={() =>
                            !notif.read && handleMarkAsRead(notif._id)
                          }
                        >
                          <div className="flex gap-3">
                            <div className="relative shrink-0">
                              <div
                                className={`p-2.5 rounded-full shadow-sm transition-all duration-200 hover:shadow-md ${
                                  notif.type === "info"
                                    ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                                    : notif.type === "success"
                                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-600"
                                    : notif.type === "warning"
                                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600"
                                    : notif.type === "error"
                                    ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600"
                                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                                }`}
                              >
                                {getNotificationIcon(notif.type)}
                              </div>
                              {!notif.read && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4
                                    className={`text-sm font-semibold transition-colors ${
                                      !notif.read
                                        ? "text-gray-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {notif.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDate(notif.createdAt)}
                                    </span>
                                    {!notif.read && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notif._id);
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded-full transition-all duration-200"
                                      >
                                        Mark as read
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 text-center text-gray-500"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium">
                          No notifications yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          You're all caught up!
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full py-2 px-4 text-sm text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
