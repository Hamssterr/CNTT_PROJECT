// ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../Components/Loading";


const ProtectedRoute = ({ role, children }) => {
  const { isLoggedIn, role: userRole, isCheckingAuth } = useContext(AppContext);

  // Nếu đang kiểm tra xác thực, hiển thị loading
  if (isCheckingAuth) {
    return <Loading/>
  }

  // Sau khi kiểm tra xong, nếu không đăng nhập thì chuyển hướng về login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Kiểm tra role nếu được cung cấp
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;