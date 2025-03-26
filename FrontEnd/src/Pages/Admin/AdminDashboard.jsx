// src/Pages/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { backendUrl, setIsLoggedIn, setRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`);
        if (data.success) {
          setAdminData(data.data);
        } else {
          toast.error(data.message);
          setIsLoggedIn(false);
          setRole(null);
          localStorage.removeItem("role");
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
        setIsLoggedIn(false);
        setRole(null);
        localStorage.removeItem("role");
        navigate("/login");
      }
    };
    fetchAdminData();
  }, [backendUrl, navigate, setIsLoggedIn, setRole]);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setRole(null);
        localStorage.removeItem("role");
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  if (!adminData) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Welcome:</strong> {adminData.firstName} {adminData.lastName}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {adminData.email}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {adminData.role}
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

export default AdminDashboard;