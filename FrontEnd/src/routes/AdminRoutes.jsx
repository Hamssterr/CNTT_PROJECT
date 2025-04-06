import React from 'react'

import AdminDashboard from '../Pages/Admin/Home'
import AdminCourse from '../Pages/Admin/Course'
import UserManagement from '../Pages/Admin/UserManagement';

const AdminRoutes = [
    { path: "/admin/dashboard", element: <AdminDashboard />, role: "admin" },
    {path: "/admin/course", element: <AdminCourse/>, role: "admin"},
    {path: "/admin/user-management", element: <UserManagement/>, role: "admin"}
  ];
export default AdminRoutes