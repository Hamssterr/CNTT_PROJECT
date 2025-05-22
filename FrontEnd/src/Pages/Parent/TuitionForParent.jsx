import React from "react";

import ParentNavbar from "../../Components/Parent/Navbar";
import ParentSidebar from "../../Components/Parent/SideBar";
import TuitionManagementForParent from "../../Components/Parent/Tuition/TuitionManagementForParent"


export const HomeParent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar cố định ở trên cùng */}
      <ParentNavbar />

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
        <ParentSidebar />

        {/* Main Content */}
       <main className="flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Time Table</h1>
     
          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
           <TuitionManagementForParent/>
          </div>
        </main>
      </div>
    </div>
  );
};


export default HomeParent;