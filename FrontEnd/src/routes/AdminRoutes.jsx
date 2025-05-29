import React from "react";

import AdminDashboard from "../Pages/Admin/Home";
import AdminCourse from "../Pages/Admin/CourseManagement";
import UserManagement from "../Pages/Admin/UserManagement";
import RegistrationInformation from "../Pages/Admin/RegistrationInformation";
import BannerManagement from "../Pages/Admin/BannerManagement";
import ClassManagement from "../Pages/Admin/ClassManagement";
import TuitionManagement from "../Pages/Admin/TuitionAndPayment";
import Profileadmin from "../Pages/Admin/ProfileAdmin"

const AdminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard />, role: "admin" },
  { path: "/admin/profile", element: <Profileadmin />, role: "admin" },
  { path: "/admin/course", element: <AdminCourse />, role: "admin" },
  {
    path: "/admin/user-management",
    element: <UserManagement />,
    role: "admin",
  },
  {
    path: "/admin/registration-information",
    element: <RegistrationInformation />,
    role: "admin",
  },
  { path: "/admin/banner", element: <BannerManagement />, role: "admin" },
  { path: "/admin/class", element: <ClassManagement />, role: "admin" },
  { path: "/admin/tuition", element: <TuitionManagement />, role: "admin" },
];
export default AdminRoutes;
