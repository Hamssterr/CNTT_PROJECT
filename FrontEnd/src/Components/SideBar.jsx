import React from "react";
import { Home, Route, BookOpen, Megaphone } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-full w-30 bg-transparent flex-col items-center pt-20 space-y-10 fixed top-0 left-0 md:inline-flex hidden">
      {/* Sidebar Items */}
      <div className="flex flex-col items-center space-y-8 mt-6 pr-7">
      
        <div className="flex flex-col items-center p-5 rounded-xl bg-orange-100 hover:bg-orange-200 transition cursor-pointer group">
          <Home size={28} className="text-orange-600 group-hover:text-orange-700" />
          <span className="text-xs text-orange-600 mt-2 group-hover:text-orange-700">Home</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
          <Route size={28} className="text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs text-gray-600 mt-2 group-hover:text-gray-800">Routes</span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
          <BookOpen size={28} className="text-gray-600 group-hover:text-gray-800" />
          <span className="text-xs text-gray-600 mt-2 group-hover:text-gray-800">Blogs</span>
        </div>
      </div>

      {/* Floating Button */}
      <div className="absolute bottom-10 bg-orange-500 p-4 rounded-full shadow-lg hover:bg-orange-600 transition cursor-pointer">
        <Megaphone size={28} className="text-white" />
      </div>
    </div>
  );
};

export default Sidebar;
