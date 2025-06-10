import React from "react";

import NavBar from "../../Components/Academic-Finance/NavBar";
import SideBar from "../../Components/Academic-Finance/SideBar";
import ClassTableList from "../../Components/Admin/classManagement/ClassTableList";

const ClassManagement = () => {
  return (
    <div className=" flex flex-col min-h-screen mt-[70px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className=" flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <SideBar />
        </div>

        <main className="flex-1 p-5 md:ml-30 ">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Welcome to Class Management
          </h1>

          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
            <ClassTableList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassManagement;
