import Attendance from "../Pages/Teacher/Attendance";
import LectureMaterials from "../Pages/Teacher/LectureMaterials";
import MyClasses from "../Pages/Teacher/MyClasses";
import Notification from "../Pages/Teacher/Notification";
import ProfileTeacher from "../Pages/Teacher/ProfileTeacher"

const TeacherRoutes = [
  {
    path: "/teacher/my-classes",
    element: <MyClasses />,
    role: "teacher",
  },
  {
    path: "/teacher/notification",
    element: <Notification />,
    role: "teacher",
  },
  {
    path: "/teacher/lecture-materials",
    element: <LectureMaterials />,
    role: "teacher",
  },
  {
    path: "/teacher/attendance",
    element: <Attendance />,
    role: "teacher",
  },
    {
    path: "/teacher/profile",
    element: <ProfileTeacher />,
    role: "teacher",
  },
];

export default TeacherRoutes;
