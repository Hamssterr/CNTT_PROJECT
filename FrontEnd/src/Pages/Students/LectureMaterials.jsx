import React from "react";
import { motion } from "framer-motion";
import StudentNavbar from "../../Components/Student/Navbar";
import StudentSidebar from "../../Components/Student/SideBar";
import LectureMaterialsManagement from "../../Components/Student/LectureMaterials/LectureMaterialsManagement";

export const LectureMaterials = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-[50px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentNavbar />
      </div>
      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <StudentSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <LectureMaterialsManagement />
        </main>
      </div>
    </div>
  );
};

export default LectureMaterials;
