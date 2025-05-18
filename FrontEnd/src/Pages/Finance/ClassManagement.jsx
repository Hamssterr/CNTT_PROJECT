import React from "react";

import NavBar from "../../Components/Academic-Finance/Navbar";
import SideBar from "../../Components/Academic-Finance/Sidebar";

import CourseTableList from "../../Components/Admin/courseManagement/CourseTableList";

const ClassManagement = () => {
  return (
    <div className=" flex flex-col min-h-screen">
      <NavBar />
      <div className=" flex flex-1">
        <SideBar />

        <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Course</h1>
     
          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
           <CourseTableList/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassManagement;
