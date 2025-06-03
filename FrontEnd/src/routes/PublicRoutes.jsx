import React from "react";

import Home from "../Pages/Home";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/SignupPage";
import CourseDetail from "../Components/Cource/CourseDetail";
import ResetPassword from "../Pages/Auth/ResetPasswordPage"
import ForgotPasswordPage from "../Pages/Auth/ForgotPasswordPage"
const PublicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <RegisterPage /> },
  { path: "/getCourse/:id", element: <CourseDetail /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
];

export default PublicRoutes;
