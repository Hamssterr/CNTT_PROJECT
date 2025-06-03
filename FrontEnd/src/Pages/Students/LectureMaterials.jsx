import React from "react";
import { motion } from "framer-motion";
import StudentNavbar from "../../Components/Student/Navbar";
import StudentSidebar from "../../Components/Student/SideBar";
import LectureMaterialsManagement from "../../Components/Student/LectureMaterials/LectureMaterialsManagement";

export const LectureMaterials = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <StudentNavbar />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-20">
          <LectureMaterialsManagement />
        </main>
      </div>
    </div>
  );
};

export default LectureMaterials;
