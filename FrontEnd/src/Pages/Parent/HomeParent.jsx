import React from "react";

import ParentNavbar from "../../Components/Parent/Navbar";
import ParentSidebar from "../../Components/Parent/SideBar";

export const HomeParent = () => {
  return (
    <div className="flex flex-col min-h-screen mt-[80px]">
      {/* Navbar cố định ở trên cùng */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ParentNavbar />
      </div>

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <ParentSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Home</h1>
          <p className="text-lg">
            This is the main content area. You can add your courses, blogs, or
            any other content here.
          </p>
          {/* Ví dụ thêm nội dung */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-7">
            <h1>Hello</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeParent;
