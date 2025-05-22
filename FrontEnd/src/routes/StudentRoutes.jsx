import React from 'react'
import StudentDashboard from '../Pages/Students/HomeStudent'
import StudentProfile from '../Pages/Students/Profile'
import TimeTable from '../Pages/Students/TimeTable'
import TuitionTable from '../Pages/Students/Tuition'

const StudentRoutes = [
    {path: "/student/dashboard", element: <StudentDashboard/>, role: "student"},
    {path: "/student/profile", element: <StudentProfile/>, role: "student"},
    {path: "/student/timetable", element: <TimeTable/>, role: "student"},
    {path: "/student/tuition", element: <TuitionTable/>, role: "student"},
]


export default StudentRoutes
