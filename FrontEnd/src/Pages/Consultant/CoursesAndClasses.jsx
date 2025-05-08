import React from 'react'
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
function CoursesAndClasses() {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-30">
          <h1 className="text-2xl font-bold mb-4">Course and Classes</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-lg">Courses and Classes here</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoursesAndClasses
