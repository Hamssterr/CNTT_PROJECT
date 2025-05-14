import React from 'react'
import Navbar from '../../Components/Teacher/NavBar';
import Sidebar from '../../Components/Teacher/SideBar';

function MyClasses() {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          Here is the my classes page
        </div>
      </div>
    </div>
  );
}

export default MyClasses
