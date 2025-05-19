import React, { useState, useEffect, useContext } from "react";
import SideBar from "../../Components/Academic-Finance/SideBar";
import NavBar from "../../Components/Academic-Finance/NavBar";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loading from "../../Components/Loading";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function DashBoard() {
  const { backendUrl } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0,
    unpaidStudents: 0,
    activeClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState([]);
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Giả lập thời gian tải
        const [studentsRes, teachersRes, classesRes, coursesRes] =
          await Promise.all([
            axios.get(`${backendUrl}/api/consultant/getLeadUsers`),
            axios.get(`${backendUrl}/api/admin/getInstructors`),
            axios.get(`${backendUrl}/api/academic-finance/getClasses`),
            axios.get(`${backendUrl}/api/course/getAllCourse`), // Lấy thông tin khóa học
          ]);

        // Tạo map của course price
        const coursePriceMap = coursesRes.data.courses.reduce((acc, course) => {
          acc[course.title] = course.price;
          return acc;
        }, {});

        // Tính total revenue từ học sinh đã thanh toán
        const totalRevenue = studentsRes.data.leadUsers
          .filter((user) => user.paymentStatus === "Paid")
          .reduce((sum, user) => {
            const coursePrice = coursePriceMap[user.course] || 0; // Lấy giá khóa học
            return sum + coursePrice;
          }, 0);

        const unpaidStudents = studentsRes.data.leadUsers.filter(
          (user) => user.paymentStatus === "Unpaid"
        ).length;

        setStats({
          totalStudents: studentsRes.data.leadUsers.length,
          totalTeachers: teachersRes.data.instructors.length,
          totalClasses: classesRes.data.classes.length,
          totalRevenue,
          unpaidStudents,
          activeClasses: classesRes.data.classes.filter(
            (c) => c.status === "Active"
          ).length,
        });

        // Cập nhật recent payments với giá khóa học
        const payments = studentsRes.data.leadUsers
          .filter((user) => user.paymentStatus === "Paid")
          .map((user) => ({
            ...user,
            amountPaid: coursePriceMap[user.course] || 0, // Thêm giá khóa học
          }))
          .slice(0, 5);
        setRecentPayments(payments);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = [
    {
      name: "Paid Students",
      value: stats.totalStudents - stats.unpaidStudents,
    },
    { name: "Unpaid Students", value: stats.unpaidStudents },
  ];

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-gray-100/50">
              <Loading />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Students Card */}
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Students
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {stats.totalStudents}
                      </h3>
                    </div>
                    <Users className="text-blue-500" size={32} />
                  </div>
                </div>

                {/* Total Teachers Card */}
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Teachers
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {stats.totalTeachers}
                      </h3>
                    </div>
                    <GraduationCap className="text-green-500" size={32} />
                  </div>
                </div>

                {/* Active Classes Card */}
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Active Classes
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {stats.activeClasses}
                      </h3>
                    </div>
                    <BookOpen className="text-yellow-500" size={32} />
                  </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Revenue
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        ${stats.totalRevenue}
                      </h3>
                    </div>
                    <DollarSign className="text-purple-500" size={32} />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Payment Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Payment Status
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Recent Payments
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPayments.map((payment, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.studentName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                ${payment.amountPaid}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <UserCheck size={20} />
                    <span>View Students</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <GraduationCap size={20} />
                    <span>Manage Teachers</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                    <Calendar size={20} />
                    <span>Class Schedule</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <AlertCircle size={20} />
                    <span>Payment Alerts</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
