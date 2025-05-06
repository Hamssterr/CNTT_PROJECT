import React from "react";

import NavbarAdmin from "../../Components/Admin/Navbar";
import SidebarAdmin from "../../Components/Admin/Sidebar";

import RegistrationInformationTableList from "../../Components/Admin/informationRegistrations/RegistrationTableList";

const RegistrationInformation = () => {
  return (
    <div className=" flex flex-col min-h-screen">
      <NavbarAdmin />
      <div className=" flex flex-1">
        <SidebarAdmin />

        <main className=" flex-1 p-5 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Registration Information
          </h1>

          {/* Ví dụ thêm nội dung */}
          <div className=" mt-6">
            <RegistrationInformationTableList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrationInformation;
