import React from 'react'
import StudentDashboard from '../Pages/Students/HomeStudent'
import TimeTable from '../Pages/Students/TimeTable'
import TuitionTable from '../Pages/Students/Tuition'
import ProfileStudent from "../Pages/Students/ProfileStudent"

const StudentRoutes = [
    {path: "/student/dashboard", element: <StudentDashboard/>, role: "student"},
    {path: "/student/timetable", element: <TimeTable/>, role: "student"},
    {path: "/student/tuition", element: <TuitionTable/>, role: "student"},
    {path: "/student/profile", element: <ProfileStudent/>, role: "student"},
]


export default StudentRoutes
