import React from "react";
import { Search, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_2.png";
import { AppContext } from "../context/AppContext";
import Loading from "./Loading";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-300 shadow-sm">
      {/* Logo */}
      <div className="flex-shrink-0 flex">
        <img className="h-12 w-12 rounded-sm" src={logo} alt="Logo" />
      </div>

      {/* Search bar */}
      {/* <div className="flex-grow mx-4 min-w-0 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Find the course"
            className="w-full h-12 py-2 px-4 pl-12 justify-center border shadow-sm border-gray-300 rounded-full focus:outline-none focus:ring-yellow-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={25}
          />
        </div>
      </div> */}

      {/* Enhanced Login-Signup Buttons */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Login Button - Outline Style */}
        <button
          className="group relative flex items-center space-x-2 px-6 py-2.5 border-2 border-blue-500 text-blue-600 rounded-full font-medium text-sm transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => navigate("/login")}
        >
          <LogIn
            size={18}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-semibold">Login</span>
        </button>

        {/* Sign Up Button - Filled Style with Gradient */}
        <button
          className="group relative flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium text-sm transition-all duration-300 ease-in-out hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 md:inline-flex hidden"
          onClick={() => navigate("/signup")}
        >
          <UserPlus
            size={18}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-semibold">Sign Up</span>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
