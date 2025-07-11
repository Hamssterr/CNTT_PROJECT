import React from "react";

import ParentNavbar from "../../Components/Parent/Navbar";
import ParentSidebar from "../../Components/Parent/SideBar";
import ChildrenForParent from "../../Components/Parent/ChildrenList/ChildrenManagementForParent"


export const HomeParent = () => {
  return (
    <div className="flex flex-col min-h-screen mt-[15px]">
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
        <main className="flex-1 p-5 md:ml-20">
          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
            <ChildrenForParent />
          </div>
        </main>
      </div>
    </div>
  );
};


export default HomeParent;