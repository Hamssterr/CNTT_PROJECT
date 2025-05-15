import React, { useState } from "react";
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

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "urgent",
    title: "Schedule Change Notice",
    message:
      "Your Advanced Mathematics class on Monday has been rescheduled to 2:00 PM",
    sender: "Academic Office",
    timestamp: "2024-01-15T10:30:00",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Teaching Materials Available",
    message:
      "Updated curriculum materials for Physics class are now available in the resource center",
    sender: "Admin",
    timestamp: "2024-01-14T15:45:00",
    read: true,
  },
  {
    id: 3,
    type: "success",
    title: "Attendance Report Submitted",
    message:
      "Your attendance report for last week has been successfully processed",
    sender: "System",
    timestamp: "2024-01-13T09:15:00",
    read: true,
  },
  // Add more mock notifications as needed
];

// Thêm custom styles cho modal
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    transition: 'opacity 200ms ease-in-out'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '42rem',
    width: '90%',
    padding: 0,
    border: 'none',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    background: 'transparent'
  }
};

// Set Modal app element
Modal.setAppElement('#root');

function Notification() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Notifications
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === "unread"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === "read"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md cursor-pointer ${
                    !notification.read ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <MailOpen size={18} />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {notification.sender}
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

      {/* Notification Detail Modal */}
      <Modal
        isOpen={selectedNotification !== null}
        onRequestClose={() => setSelectedNotification(null)}
        style={customStyles}
        closeTimeoutMS={200}
        contentLabel="Notification Details"
      >
        <div className="bg-white rounded-2xl overflow-hidden animate-modal-entry">
          <div className={`p-6 ${
            selectedNotification?.type === 'urgent' ? 'bg-red-50' :
            selectedNotification?.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
          }`}>
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3">
              {selectedNotification && getTypeIcon(selectedNotification.type)}
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedNotification?.title}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Mail size={16} />
                  From: <span className="font-medium">{selectedNotification?.sender}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {selectedNotification && formatDate(selectedNotification.timestamp)}
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
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedNotification?.read
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedNotification?.read ? 'Read' : 'Unread'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedNotification?.type === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : selectedNotification?.type === 'info'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedNotification?.type.charAt(0).toUpperCase() + selectedNotification?.type.slice(1)}
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
