import React from 'react'

import AdminDashboard from '../Pages/Admin/Home'
import AdminCourse from '../Pages/Admin/Course'
import UserManagement from '../Pages/Admin/UserManagement';
import RegistrationInformation from "../Pages/Admin/RegistrationInformation"
import BannerManagement from '../Pages/Admin/BannerManagement'
import ClassManagement from '../Pages/Admin/ClassManagement';

const AdminRoutes = [
    { path: "/admin/dashboard", element: <AdminDashboard />, role: "admin" },
    {path: "/admin/course", element: <AdminCourse/>, role: "admin"},
    {path: "/admin/user-management", element: <UserManagement/>, role: "admin"},
    {path: "/admin/registration-information", element: <RegistrationInformation/>, role: "admin"},
    {path: "/admin/banner", element: <BannerManagement/>, role: "admin"},
    {path: "/admin/class", element: <ClassManagement />, role: "admin"}
  ];
export default AdminRoutes