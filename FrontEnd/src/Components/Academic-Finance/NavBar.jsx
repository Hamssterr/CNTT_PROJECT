import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, X, Send } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo_2.png";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [consultantData, setConsultantData] = useState(null);

  // Refs for click outside handling
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const chatboxRef = useRef(null);

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
          <Bell
            className="w-5 h-5 cursor-pointer transition duration-300 hover:opacity-70"
            onClick={toggleNotifications}
          />
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-10">
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
            <span>Academic-Finance</span>
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
