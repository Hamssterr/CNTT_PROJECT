import React from 'react'
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
function ClassManagement() {
  return (
    <div>
        <SideBar />
        <NavBar />
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Class Management</h1>
            <p className="text-lg">Manage your classes and students here.</p>
        </div>
    </div>
  )
}

export default ClassManagement
