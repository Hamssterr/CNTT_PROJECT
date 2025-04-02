// Router.jsx (hoặc file định tuyến của bạn)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "../src/Lib/ProtectedRoute";
import StudentDashboard from "../src/Pages/Students/StudentDashboard";
import AdminDashboard from "../src/Pages/Admin/AdminDashboard";
import Home from "./Pages/Home";
import Login from "../src/Pages/Auth/LoginPage";
import Signup from "../src/Pages/Auth/SignupPage";
import Loading from "./Components/Loading";


const App = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      setLoading(false); 
    }, 1000); 
  }, []);

  if (loading) {
    return <Loading />; 
  }

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <Student   />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;