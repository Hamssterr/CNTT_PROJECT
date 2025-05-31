import AcademicDashBoard from "../Pages/Finance/DashBoard";
import ClassManagement from "../Pages/Finance/ClassManagement";
import TeacherManagement from "../Pages/Finance/TeacherProfile";
import ReportAttendance from "../Pages/Finance/ReportAttendance";
import PaymentManagement from "../Pages/Finance/TuitionAndPayment";
import StudentProfile from "../Pages/Finance/StudentProfile";
import ProfileFinance from "../Pages/Finance/ProfileFinance";

const AcademicFinanceRoutes = [
  {
    path: "/academic-finance/dashboard",
    element: <AcademicDashBoard />,
    role: "finance",
  },
  {
    path: "/academic-finance/class-management",
    element: <ClassManagement />,
    role: "finance",
  },
  {
    path: "/academic-finance/teacher-management",
    element: <TeacherManagement />,
    role: "finance",
  },
  {
    path: "/academic-finance/student-profile",
    element: <StudentProfile />,
    role: "finance",
  },
  {
    path: "/academic-finance/report-attendance",
    element: <ReportAttendance />,
    role: "finance",
  },
  {
    path: "/academic-finance/payment-management",
    element: <PaymentManagement />,
    role: "finance",
  },
  {
    path: "/academic-finance/profile",
    element: <ProfileFinance />,
    role: "finance",
  },
];

export default AcademicFinanceRoutes;
