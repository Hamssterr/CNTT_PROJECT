// src/Pages/StudentDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const StudentDashboard = () => {
  const { backendUrl, isLoggedIn, logout } = useContext(AppContext); // Sử dụng logout từ context
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Token đã được thêm vào header bởi AppContext, chỉ cần gửi request
        const { data } = await axios.get(`${backendUrl}/api/student/dashboard`, {
          withCredentials: true, // Nếu vẫn cần cookie
        });
        console.log("Student dashboard data:", data); // Debug
        if (data.success) {
          setStudentData(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Fetch student data error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
        logout(); // Gọi logout từ context khi lỗi xác thực
        navigate("/login");
      }
    };

    // Chỉ fetch data nếu user đã login
    if (isLoggedIn) {
      fetchStudentData();
    } else {
      navigate("/login");
    }
  }, [backendUrl, isLoggedIn, logout, navigate]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, {
        withCredentials: true, // Nếu backend yêu cầu cookie để logout
      });
      if (data.success) {
        logout(); // Gọi logout từ context
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      logout(); 
      navigate("/");
    }
  };

  if (!studentData) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Student Dashboard</h1>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Welcome:</strong> {studentData.firstName} {studentData.lastName}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {studentData.email}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {studentData.role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;