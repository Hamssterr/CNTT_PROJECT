import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import {
  Bell,
  Info,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  ChevronRight,
  MailOpen,
  Mail,
  X,
} from "lucide-react";
import Modal from "react-modal";
import axios from "axios";

// Thêm custom styles cho modal
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
    transition: "opacity 200ms ease-in-out",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "42rem",
    width: "90%",
    padding: 0,
    border: "none",
    borderRadius: "1rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    background: "transparent",
  },
};

// Set Modal app element
Modal.setAppElement("#root");

function Notification() {
  const { backendUrl, user } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/teacher/notifications`,
          {
            withCredentials: true,
          }
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [backendUrl, user]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="text-red-500" size={20} />;
      case "info":
        return <Info className="text-blue-500" size={20} />;
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/teacher/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    markAsRead(notification._id);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-20">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Notifications
                </h1>
                <p className="mt-1 text-gray-600 text-sm">
                  Manage your notifications and updates
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                {["all", "unread", "read"].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`
                      flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        filter === filterType
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    bg-white rounded-xl shadow-sm p-4 sm:p-6 
                    transition-all duration-300 hover:shadow-md 
                    cursor-pointer transform hover:scale-[1.01]
                    ${!notification.read ? "border-l-4 border-blue-500" : ""}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`
                        p-2 rounded-lg
                        ${
                          notification.type === "urgent"
                            ? "bg-red-50"
                            : notification.type === "info"
                            ? "bg-blue-50"
                            : "bg-green-50"
                        }
                      `}
                      >
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <MailOpen size={18} className="text-blue-500" />
                          </button>
                        )}
                      </div>

                      <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          <span className="truncate max-w-[150px]">
                            {notification.sender}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      <Modal
        isOpen={selectedNotification !== null}
        onRequestClose={() => setSelectedNotification(null)}
        style={customStyles}
        closeTimeoutMS={200}
        contentLabel="Notification Details"
      >
        <div className="bg-white rounded-2xl overflow-hidden animate-modal-entry max-h-[90vh] overflow-y-auto">
          <div
            className={`
            p-6 relative
            ${
              selectedNotification?.type === "urgent"
                ? "bg-gradient-to-r from-red-50 to-red-100"
                : selectedNotification?.type === "info"
                ? "bg-gradient-to-r from-blue-50 to-blue-100"
                : "bg-gradient-to-r from-green-50 to-green-100"
            }
          `}
          >
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/50 rounded-lg">
                {selectedNotification && getTypeIcon(selectedNotification.type)}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {selectedNotification?.title}
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Mail size={16} />
                  From:{" "}
                  <span className="font-medium">
                    {selectedNotification?.sender}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {selectedNotification &&
                    formatDate(selectedNotification.timestamp)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification?.message}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Additional Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedNotification?.read
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedNotification?.read ? "Read" : "Unread"}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Priority
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedNotification?.type === "urgent"
                            ? "bg-red-100 text-red-800"
                            : selectedNotification?.type === "info"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedNotification?.type.charAt(0).toUpperCase() +
                          selectedNotification?.type.slice(1)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Notification;
