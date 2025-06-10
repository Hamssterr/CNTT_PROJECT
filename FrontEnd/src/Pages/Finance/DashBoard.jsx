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
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const [studentsRes, teachersRes, classesRes, coursesRes] =
          await Promise.all([
            axios.get(`${backendUrl}/api/consultant/getLeadUsers`),
            axios.get(`${backendUrl}/api/admin/getInstructors`),
            axios.get(`${backendUrl}/api/academic-finance/getClasses`),
            axios.get(`${backendUrl}/api/course/getAllCourse`),
          ]);

        const coursePriceMap = coursesRes.data.courses.reduce((acc, course) => {
          acc[course.title] = course.price;
          return acc;
        }, {});

        const totalRevenue = studentsRes.data.leadUsers
          .filter((user) => user.paymentStatus === "Paid")
          .reduce((sum, user) => {
            const coursePrice = coursePriceMap[user.course] || 0;
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

        const payments = studentsRes.data.leadUsers
          .filter((user) => user.paymentStatus === "Paid")
          .map((user) => ({
            ...user,
            amountPaid: coursePriceMap[user.course] || 0,
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

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const pieData = [
    {
      name: "Paid Students",
      value: stats.totalStudents - stats.unpaidStudents,
    },
    { name: "Unpaid Students", value: stats.unpaidStudents },
  ];

  // Sample data for charts
  const monthlyRevenueData = [
    { month: "Jan", revenue: 4000, students: 240 },
    { month: "Feb", revenue: 3000, students: 180 },
    { month: "Mar", revenue: 5000, students: 300 },
    { month: "Apr", revenue: 2780, students: 190 },
    { month: "May", revenue: 1890, students: 120 },
    { month: "Jun", revenue: 2390, students: 150 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            {trend && (
              <div className="flex items-center gap-2">
                {trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 mt-[70px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="flex">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <SideBar />
        </div>
        <div className="flex-1 lg:ml-25">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's what's happening with your academy.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">This Month</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Reports</span>
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-96 bg-white rounded-2xl shadow-sm">
                <Loading />
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <StatCard
                    title="Total Students"
                    value={stats.totalStudents.toLocaleString()}
                    icon={Users}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    trend="up"
                    trendValue="+12%"
                  />
                  <StatCard
                    title="Total Teachers"
                    value={stats.totalTeachers.toLocaleString()}
                    icon={GraduationCap}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    trend="up"
                    trendValue="+5%"
                  />
                  <StatCard
                    title="Active Classes"
                    value={stats.activeClasses.toLocaleString()}
                    icon={BookOpen}
                    color="bg-gradient-to-br from-yellow-500 to-orange-500"
                    trend="up"
                    trendValue="+8%"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    trend="up"
                    trendValue="+15%"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                  {/* Revenue Trend */}
                  <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Revenue Trend
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Monthly revenue overview
                        </p>
                      </div>
                      <button className="mt-3 sm:mt-0 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenueData}>
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3B82F6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3B82F6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Payment Status
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Student payment overview
                        </p>
                      </div>
                    </div>
                    <div className="h-48 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
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
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Payments & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Payments */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Recent Payments
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Latest payment transactions
                        </p>
                      </div>
                      <button className="mt-3 sm:mt-0 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-0 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {recentPayments.map((payment, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50/50 transition-colors duration-200"
                            >
                              <td className="py-4 px-0">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {payment.studentName
                                      ?.charAt(0)
                                      ?.toUpperCase() || "S"}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {payment.studentName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {payment.course}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  ${payment.amountPaid?.toLocaleString()}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                                  Paid
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Actions & Alerts */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Add New Student
                          </span>
                        </button>
                        <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Create Class
                          </span>
                        </button>
                        <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Payment Reports
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Alerts
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">
                                {stats.unpaidStudents} Unpaid Students
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">
                                Follow up on pending payments
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex gap-3">
                            <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                All Classes Active
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                Great job maintaining attendance!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
