import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  Calendar,
  MessageCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
  Trash2,
  Sparkles,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Archive,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleDeleteNotification = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Delete Notification?",
        text: "This notification will be permanently removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F10808FF",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-2xl",
          title: "text-xl font-bold",
          content: "text-gray-600",
          confirmButton: "rounded-xl px-6 py-3 font-medium",
          cancelButton: "rounded-xl px-6 py-3 font-medium",
        },
      });
      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `${backendUrl}/api/consultant/notifications/${id}`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          setNotifications((prev) => prev.filter((notif) => notif._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Notification has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: true,
            customClass: {
              popup: "rounded-2xl",
              title: "text-xl font-bold text-green-600",
              content: "text-gray-600",
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const result = await Swal.fire({
        title: "Delete all notification?",
        text: "All notifications will be permanently removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-2xl",
          title: "text-xl font-bold",
          content: "text-gray-600",
          confirmButton: "rounded-xl px-6 py-3 font-medium",
          cancelButton: "rounded-xl px-6 py-3 font-medium",
        },
      });

      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `${backendUrl}/api/consultant/notifications/clear-all`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          setNotifications([]);
          Swal.fire({
            title: "Deleted!",
            text: "Notification has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: true,
            customClass: {
              popup: "rounded-2xl",
              title: "text-xl font-bold text-green-600",
              content: "text-gray-600",
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
      toast.error("Failed to clear all notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    const iconProps = { size: 20, strokeWidth: 2 };
    switch (type) {
      case "info":
        return <Info {...iconProps} className="text-blue-600" />;
      case "success":
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case "warning":
        return <AlertTriangle {...iconProps} className="text-amber-600" />;
      case "error":
        return <X {...iconProps} className="text-red-600" />;
      case "message":
        return <MessageCircle {...iconProps} className="text-purple-600" />;
      case "calendar":
        return <Calendar {...iconProps} className="text-indigo-600" />;
      default:
        return <Bell {...iconProps} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "from-blue-100 to-blue-50 border-blue-200";
      case "success":
        return "from-green-100 to-green-50 border-green-200";
      case "warning":
        return "from-amber-100 to-amber-50 border-amber-200";
      case "error":
        return "from-red-100 to-red-50 border-red-200";
      case "message":
        return "from-purple-100 to-purple-50 border-purple-200";
      case "calendar":
        return "from-indigo-100 to-indigo-50 border-indigo-200";
      default:
        return "from-gray-100 to-gray-50 border-gray-200";
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "read" && notif.read);

    const matchesSearch =
      notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
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
            className="max-w-5xl mx-auto"
          >
            {/* Enhanced Header */}
            <div className="mb-8 mt-[70px]">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Bell className="w-8 h-8 text-white" />
                      </div>
                      {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Notifications
                      </h1>
                      <p className="text-gray-500 mt-1">
                        Stay updated with the latest information
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                          {notifications.length} total
                        </span>
                        <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                          {unreadCount} unread
                        </span>
                        <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                          {readCount} read
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchNotifications}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
                      title="Refresh notifications"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark all read
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearAllNotifications}
                      disabled={notifications.length === 0}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear all
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Filter and Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  {[
                    { key: "all", label: "All", count: notifications.length },
                    { key: "unread", label: "Unread", count: unreadCount },
                    { key: "read", label: "Read", count: readCount },
                  ].map((filterOption) => (
                    <motion.button
                      key={filterOption.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        filter === filterOption.key
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {filterOption.label}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          filter === filterOption.key
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {filterOption.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">
                  Loading notifications...
                </p>
              </motion.div>
            )}

            {/* Enhanced Notification List */}
            <AnimatePresence mode="wait">
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative overflow-hidden bg-gradient-to-r ${getTypeColor(
                      notification.type
                    )} 
                      backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2
                      ${
                        !notification.read
                          ? "ring-2 ring-blue-200 ring-opacity-50"
                          : ""
                      }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Enhanced Icon */}
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(
                            notification.type
                          )} 
                          shadow-md group-hover:scale-110 transition-transform duration-300`}
                        >
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3
                                  className={`font-bold text-lg ${
                                    !notification.read
                                      ? "text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                                    New
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 leading-relaxed mb-3">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {formatDate(notification.createdAt)}
                                  </span>
                                </div>

                                {!notification.read && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      handleMarkAsRead(notification._id)
                                    }
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-all duration-200"
                                  >
                                    Mark as read
                                  </motion.button>
                                )}
                              </div>
                            </div>

                            {/* Action Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleDeleteNotification(notification._id)
                              }
                              className="p-2 hover:bg-red-100 rounded-xl transition-all duration-200 group/btn opacity-0 group-hover:opacity-100"
                              title="Delete notification"
                            >
                              <X className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Enhanced Empty State */}
            {!loading && filteredNotifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Bell className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm || filter !== "all"
                    ? "No matching notifications"
                    : "No notifications"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You're all caught up! Check back later for new updates."}
                </p>

                <div className="flex gap-3 justify-center">
                  {(searchTerm || filter !== "all") && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchTerm("");
                        setFilter("all");
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                    >
                      Clear filters
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchNotifications}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
