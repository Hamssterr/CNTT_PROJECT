import React from "react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";

import CourseTableList from "../../Components/Admin/courseManagement/CourseTableList";

const Course = () => {
  return (
    <div className=" flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className=" flex flex-1">
        <SidebarAdmin />

        <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Course</h1>
          <p className="text-lg">
            This is the main content area. You can add your courses, blogs, or
            any other content here.
          </p>
          {/* Ví dụ thêm nội dung */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-7">
           <CourseTableList/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Course;
