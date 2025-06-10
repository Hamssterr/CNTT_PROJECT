import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Calendar,
  MessageCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/consultant/notification/all`
      );
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
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
      toast.error("Failed to mark notifications as read");
    }
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

  const handleClearNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 mt-[70px]">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-gray-500 mt-1">
                  Stay updated with the latest information
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Mark all as read
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Clear all
                </motion.button>
              </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 bg-white rounded-xl shadow-sm border border-gray-100 
                    ${!notification.read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full 
                        ${
                          notification.type === "info"
                            ? "bg-blue-100"
                            : notification.type === "success"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleClearNotification(notification.id)
                            }
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                      {!notification.read && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Mark as read
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No notifications
                </h3>
                <p className="mt-1 text-gray-500">
                  You're all caught up! Check back later for new updates.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
