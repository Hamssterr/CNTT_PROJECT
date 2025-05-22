import React from "react";

import StudentNavbar from "../../Components/Student/Navbar";
import StudentSidebar from "../../Components/Student/SideBar";
import TimeTableManagement from "../../Components/Student/TimeTable/TimeTableManagement";



export const TimeTable = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar cố định ở trên cùng */}
      <StudentNavbar />

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
        <StudentSidebar />

        {/* Main Content */}
        <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Time Table</h1>
     
          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
           <TimeTableManagement/>
          </div>
        </main>
      </div>
    </div>
  );
};


export default TimeTable;