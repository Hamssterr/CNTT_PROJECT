import React from "react";
import { Search, UserPlus, LogIn } from "lucide-react"; // Import biểu tượng từ Lucide
import { useNavigate } from 'react-router-dom'


const Navbar = () => {

  const navigate = useNavigate();

  return (
    <nav className=" bg-white shadow-md py-4 px-6 flex items-center justify-between">

      {/* Logo */}
      <div className=" flex w-2/3 md:w-1/3 items-center space-x-4">
        <span className=" text-yellow-500 text-2xl font-bold">T&P</span>

        <div className=" relative flex-1 md:hidden">
          <input
            type="text"
            placeholder="Find the course,...."
            className=" w-full py-2 px-4 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-yellow-500 "
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>

      </div>

      {/* Search bar in Large screen */}
      <div className=" hidden md:flex w-1/3 justify-center">
        <div className=" relative w-full max-w-md">
          <input
            type="text"
            placeholder="Find the course,...."
            className=" w-full py-2 px-4 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-yellow-500 "
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>
      </div>

      {/* Login-Signup Formn */}
      <div className=" w-1/3 flex justify-end space-x-3">
      <button className=" flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
        <UserPlus size={20}/>
        <span onClick={() => navigate("/login")}>Login</span>
      </button>
      <button className=" hidden md:flex items-center space-x-2 text-white px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition ">
        <LogIn size={20}/>
        <span onClick={() => navigate("/signup")}>Sign Up</span>
      </button>
      </div>
    </nav>
  );
};

export default Navbar;
