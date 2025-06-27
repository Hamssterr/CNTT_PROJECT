import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  LogIn,
  Home,
  Route,
  School,
  Database,
  AppWindow,
  User,
  BadgeDollarSign,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo_2.png";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import userImage from "../../assets/3.jpg";
import axios from "axios";
import Loading from "../Loading";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext);
  const [adminData, setAdminData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
          withCredentials: true,
        });

        if (data.success) {
          setAdminData(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(
          "Fetch admin data error:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Failed to load dashboard"
        );
        logout();
        navigate("/login");
      }
    };

    if (isLoggedIn) {
      fetchAdminData();
    } else {
      navigate("/");
    }
  }, [backendUrl, isLoggedIn, logout, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        setIsDropdownOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      logout();
      navigate("/");
    }
  };

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
    <nav className="bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 shadow-lg relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-orange-50/30 pointer-events-none"></div>

      {/* Logo Section */}
      <div className="flex-shrink-0 flex items-center relative z-10">
        <div className="relative group">
          <img
            className="h-12 w-12 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
            src={logo}
            alt="Logo"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="hidden md:flex flex-col ml-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Admin Panel
          </span>
          <span className="text-sm text-gray-500 font-medium">
            Welcome{" "}
            {isLoggedIn && adminData?.role
              ? adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)
              : ""}
          </span>
        </div>
      </div>

      {/* Enhanced Search Bar */}

      {/* User Section */}
      <div className="flex items-center space-x-4 flex-shrink-0 relative z-10">
        {isLoggedIn && adminData ? (
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="hidden md:flex flex-col items-end">
              <p className="text-lg font-bold text-gray-800 leading-tight">
                {adminData.firstName} {adminData.lastName}
              </p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {adminData.role}
              </p>
            </div>

            {/* Enhanced Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-1 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={adminData.profileImage || userImage}
                    alt="User Profile"
                    className="h-11 w-11 rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {adminData.firstName} {adminData.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{adminData.email}</p>
                    </div>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-left group"
                      onClick={() => {
                        navigate("/admin/profile");
                        setIsDropdownOpen(false);
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
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            {/* Enhanced Login Button */}
            <button
              className="group relative flex items-center space-x-2 px-6 py-2.5 border-2 border-blue-500 text-blue-600 rounded-2xl font-semibold text-sm transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate("/login")}
            >
              <LogIn
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Login</span>
            </button>

            {/* Enhanced Sign Up Button */}
            <button
              className="group relative flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold text-sm transition-all duration-300 ease-in-out hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:inline-flex hidden"
              onClick={() => navigate("/signup")}
            >
              <UserPlus
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Sign Up</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
            </button>
          </div>
        )}

        {/* Enhanced Mobile Menu Button */}
        {isLoggedIn && (
          <button
            className="md:hidden p-3 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 group"
            onClick={toggleMobileMenu}
          >
            <Menu
              size={24}
              className={`text-gray-600 group-hover:text-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="md:hidden absolute right-4 top-20 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
          <div className="py-4">
            <div className="px-4 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={adminData?.profileImage || userImage}
                  alt="User Profile"
                  className="h-10 w-10 rounded-xl object-cover border-2 border-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {adminData?.firstName} {adminData?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {adminData?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-300 text-left group ${
                      isActive
                        ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-r-4 border-orange-500"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "text-orange-600"
                          : "text-gray-500 group-hover:text-gray-700 group-hover:scale-110"
                      }`}
                    />
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
