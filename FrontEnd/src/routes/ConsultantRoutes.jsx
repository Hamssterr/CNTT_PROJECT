import DashBoard from "../Pages/Consultant/DashBoard";
import LeadManagement from "../Pages/Consultant/LeadManagement";
import ConsultationSchedule from "../Pages/Consultant/ConsultationSchedule";
import CoursesAndClasses from "../Pages/Consultant/CoursesAndClasses";

const ConsultantRoutes = [
  { path: "/consultant/dashboard", element: <DashBoard />, role: "consultant" },
  {
    path: "/consultant/lead-management",
    element: <LeadManagement />,
    role: "consultant",
  },
  {
    path: "/consultant/schedule",
    element: <ConsultationSchedule />,
    role: "consultant",
  },
  {
    path: "/consultant/courses-classes",
    element: <CoursesAndClasses />,
    role: "consultant",
  },
];

export default ConsultantRoutes;
