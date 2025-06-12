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
  Settings,
  ChevronDown,
  Search,
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
  const [consultantData, setConsultantData] = useState([]);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  );
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();

  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const sidebarItems = [
    {
      path: "/consultant/dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Overview & Analytics",
      singleLine: true,
    },
    {
      path: "/consultant/notifications",
      icon: BellRing,
      label: "Notifications",
      description: "Messages & Updates",
      singleLine: true,
    },
    {
      path: "/consultant/lead-management",
      icon: Users,
      label: "Lead Management",
      description: "Manage Prospects",
      singleLine: false,
    },
    {
      path: "/consultant/schedule",
      icon: Calendar,
      label: "Schedule",
      description: "Appointments & Events",
      singleLine: true,
    },
    {
      path: "/consultant/courses-classes",
      icon: BookOpen,
      label: "Courses",
      description: "Course Materials",
      singleLine: true,
    },
  ];

  // Fetch consultant data
  useEffect(() => {
    const fetchConsultantData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/consultant/profile`
        );

        if (data.success) {
          setConsultantData({
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
      fetchConsultantData();
    }
  }, [backendUrl, isLoggedIn]);

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
        `${backendUrl}/api/consultant/notification/markAllAsRead`,
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
        return <X {...iconProps} />;
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
      `}</style>

      {/* Enhanced Navbar */}
      <nav className="bg-gradient-to-r from-white via-blue-50/30 to-white backdrop-blur-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 shadow-lg relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-transparent to-purple-50/40 pointer-events-none"></div>

        {/* Left side - Enhanced Logo Section */}
        <div className="flex items-center relative z-10">
          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 p-3 rounded-2xl hover:bg-blue-100/80 transition-all duration-300 group"
            type="button"
          >
            <Menu
              className={`w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-all duration-300 ${
                showMobileMenu ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img
                src={logo}
                alt="logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">Consultant Portal</span>
                <span className="sm:hidden">Portal</span>
              </p>
              <p className="hidden md:block text-sm text-gray-500 font-medium">
                Welcome back, Consultant
              </p>
            </div>
          </Link>
        </div>

        {/* Enhanced Search Bar (Optional) */}
        <div className="hidden lg:flex flex-grow mx-6 min-w-0 max-w-md relative z-10">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search leads, courses..."
              className="w-full h-11 py-3 px-5 pl-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
              size={18}
            />
          </div>
        </div>

        {/* Enhanced Right Menu */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-500 relative z-10">
          {/* Enhanced Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2.5 rounded-2xl hover:bg-blue-100/80 transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate("/consultant/notifications")}
                          className="text-xs hover:underline flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-lg transition-all duration-200"
                        >
                          View All <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="hover:bg-white/10 p-1.5 rounded-full transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                            !notif.read
                              ? "bg-blue-50/40 border-l-4 border-l-blue-400"
                              : ""
                          }`}
                          onClick={() =>
                            !notif.read && handleMarkAsRead(notif._id)
                          }
                        >
                          <div className="flex gap-3">
                            <div className="relative shrink-0">
                              <div
                                className={`p-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
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
                        className="w-full py-2 px-4 text-sm text-center text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 p-2 rounded-2xl hover:bg-blue-100/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={consultantData?.profileImage || profileImage}
                    alt="User Profile"
                    className="h-11 w-11 rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {consultantData?.firstName +
                      " " +
                      consultantData?.lastName || "Consultant"}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {consultantData?.role}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-all duration-300 ${
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
                        {consultantData?.firstName} {consultantData?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {consultantData?.email}
                      </p>
                    </div>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-left group"
                      onClick={() => {
                        navigate("/consultant/profile");
                        setShowProfileMenu(false);
                      }}
                    >
                      <Settings
                        size={18}
                        className="text-gray-500 group-hover:text-blue-600"
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">
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
                <h2>Consultant Portal</h2>
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
