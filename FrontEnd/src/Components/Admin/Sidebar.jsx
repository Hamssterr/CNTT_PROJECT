import React from "react";
import {
  Home,
  Route,
  School,
  Database,
  AppWindow,
  User,
  BadgeDollarSign,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách các mục trong Sidebar với đường dẫn tương ứng
  const sidebarItems = [
    { path: "/admin/dashboard", icon: Home, label: "Home" },
    { path: "/admin/course", icon: Route, label: "Course" },
    { path: "/admin/user-management", icon: User, label: "User" },
    { path: "/admin/banner", icon: AppWindow, label: "Banner" },
    {
      path: "/admin/registration-information",
      icon: Database,
      label: "Registration",
    },
    { path: "/admin/class", icon: School, label: "Class" },
    { path: "/admin/tuition", icon: BadgeDollarSign, label: "Tuition" },
  ];

  return (
    <div className="h-full w-30 bg-transparent flex-col items-center pt-20 fixed top-0 left-0 md:inline-flex hidden overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {/* Sidebar Items */}
        <div className="flex flex-col items-center space-y-6 mt-6 pr-7 pb-6">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 cursor-pointer group min-h-[80px] w-16 ${
                  isActive
                    ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 shadow-md scale-105"
                    : "hover:bg-gray-100 text-gray-600 hover:scale-102"
                }`}
              >
                <item.icon
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-600 group-hover:text-gray-800 group-hover:scale-110"
                  }`}
                />
                <span
                  className={`text-xs mt-2 text-center leading-tight font-medium transition-all duration-300 ${
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

      {/* Scroll Indicator (Optional) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-200 rounded-full opacity-30">
        <div className="w-full h-2 bg-orange-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Sidebar;
