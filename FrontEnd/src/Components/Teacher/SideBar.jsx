import React from "react";
import {
  Home,
  BookOpen,
  User,
  Users,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define sidebar items with corresponding paths
  const sidebarItems = [
    {
      path: "/teacher/notification",
      icon: BookOpen,
      label: "Notification",
      singleLine: true,
    },
    {
      path: "/teacher/my-classes",
      icon: User,
      label: ["My", "Classes"],
      singleLine: false,
    },
    {
      path: "/teacher/lecture-materials",
      icon: Users,
      label: ["Lecture", "Materials"],
      singleLine: false,
    },
    {
      path: "/teacher/attendance",
      icon: ClipboardList,
      label: "Attendance",
      singleLine: true,
    },
  ];

  return (
    <div className="h-full w-30 bg-transparent flex-col items-center pt-20 space-y-10 fixed top-0 left-0 md:inline-flex hidden overflow-y-auto max-h-screen">
      {/* Sidebar Items */}
      <div className="flex flex-col items-center space-y-8 mt-6 pr-7">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-3 rounded-xl transition cursor-pointer group ${
                isActive
                  ? "bg-orange-200 text-orange-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon
                size={28}
                className={`${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              />
              {item.singleLine ? (
                <span
                  className={`text-xs mt-2 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  {item.label.map((text, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i === 0 ? "mt-2" : "mt-0"} ${
                        isActive
                          ? "text-orange-700"
                          : "text-gray-600 group-hover:text-gray-800"
                      }`}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
