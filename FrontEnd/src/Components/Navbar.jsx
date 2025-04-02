import React from "react";
import { Search, UserPlus, LogIn } from "lucide-react"; // Import biểu tượng từ Lucide
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-300">
      {/* Logo */}
      <div className="flex-shrink-0 flex">
        <img className="h-12 w-12 rounded-sm" src={logo} alt="Logo" />
        <span className=" flex justify-center text-center pl-5 pt-2 text-2xl font-bold">Hello</span>
      </div>
      

      {/* Search bar */}
      <div className="flex-grow mx-4 min-w-0 max-w-md ">
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
      </div>

      {/* Login-Signup Form */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button
          className="flex items-center space-x-2 shadow-sm bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition text-base"
          onClick={() => navigate("/login")}
        >
          <UserPlus size={20} />
          <span>Login</span>
        </button>
        <button
          className="items-center space-x-2 shadow-sm text-white px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-base md:inline-flex hidden"
          onClick={() => navigate("/signup")}
        >
          <LogIn size={20} />
          <span>Sign Up</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;