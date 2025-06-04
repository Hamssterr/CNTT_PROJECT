import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  Send,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
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
  const [showChatbox, setShowChatbox] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [consultantData, setConsultantData] = useState(null);
  const { notifications, setNotifications, fetchNotifications } =
    useNotifications();

  // Refs for click outside handling
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const chatboxRef = useRef(null);

  // Toggle functions
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
    setShowNotifications(false);
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      logout();
      navigate("/");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/consultant/notification/markAllAsRead`
      );

      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Also add handleMarkAsRead function if not already present
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
        toast.success("Notification marked as read");
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-gray-500 py-3 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <p className="ml-10 text-xl font-bold">Consultant Portal</p>
      </Link>

      {/* Right Menu */}
      <div className="flex items-center gap-5 text-gray-500 relative">
        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <div
            className="relative cursor-pointer"
            onClick={toggleNotifications}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={
                notifications.some((n) => !n.read)
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, -10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="relative z-10"
            >
              <Bell
                className={`w-5 h-5 transition duration-300 hover:text-blue-600 ${
                  notifications.some((n) => !n.read)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              />
            </motion.div>
            {notifications.filter((n) => !n.read).length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-20"
              >
                {notifications.filter((n) => !n.read).length}
              </motion.span>
            )}
            {notifications.some((n) => !n.read) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute -inset-1 rounded-full bg-blue-100/50 pointer-events-none"
              />
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notif.read ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`p-2 rounded-full shrink-0 ${
                              notif.type === "info"
                                ? "bg-blue-100"
                                : notif.type === "success"
                                ? "bg-green-100"
                                : "bg-yellow-100"
                            }`}
                          >
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {notif.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-gray-400">
                                    {new Date(notif.createdAt).toLocaleString()}
                                  </span>
                                  {!notif.read && (
                                    <button
                                      onClick={() =>
                                        handleMarkAsRead(notif._id)
                                      }
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
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
            <span>Consultant</span>
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
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm text-white-600 hover:bg-gray-100"
                onClick={() => {
                  navigate("/consultant/profile");
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
  );
};

export default Navbar;
