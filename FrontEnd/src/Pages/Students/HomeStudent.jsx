import React from "react";

import StudentNavbar from "../../Components/Student/Navbar";
import CourseCard from "../../Components/Cource/CourseCard";
import StudentSidebar from "../../Components/Student/SideBar";



export const HomeStudent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar cố định ở trên cùng */}
      <StudentNavbar />

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
        <StudentSidebar />

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


export default HomeStudent;