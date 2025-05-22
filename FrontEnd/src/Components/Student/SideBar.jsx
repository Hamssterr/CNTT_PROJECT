import React from "react";
import {
  Home,
  Calendar,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { path: "/student/dashboard", icon: Home, label: "Home" },
    { path: "/student/timetable", icon: Calendar, label: "Time Table" },
     { path: "/student/tuition", icon: Wallet, label: "Tuition" },
  ];

  return (
    <div className="h-full w-30 bg-transparent flex-col items-center pt-20 space-y-10 fixed top-0 left-0 md:inline-flex hidden">
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
              <span
                className={`text-xs mt-2 ${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
