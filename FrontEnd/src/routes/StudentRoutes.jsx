import React from 'react'
import StudentDashboard from '../Pages/Students/HomeStudent'
import StudentProfile from '../Pages/Students/Profile'

const StudentRoutes = [
    {path: "/student/dashboard", element: <StudentDashboard/>, role: "student"},
    {path: "/student/profile", element: <StudentProfile/>, role: "student"},
]


export default StudentRoutes
