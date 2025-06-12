import React from "react";

import StudentNavbar from "../../Components/Student/Navbar";
import StudentSidebar from "../../Components/Student/SideBar";
import TuitionManagement from "../../Components/Student/Tuition/TuitionManagement";

export const TimeTable = () => {
  return (
    <div className="flex flex-col min-h-screen mt-[90px]">
      {/* Navbar cố định ở trên cùng */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentNavbar />
      </div>

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <StudentSidebar />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Tuition</h1>

          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
            <TuitionManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeTable;
