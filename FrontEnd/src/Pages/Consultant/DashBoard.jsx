import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Consultant/Navbar";
import Loading from "../../Components/Loading";
import {
  Users,
  CalendarCheck,
  UserPlus,
  Users2,
  CalendarDays,
  TrendingUp,
  Activity,
  Clock,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import axios from "axios";

function DashBoard() {
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    newLeadsToday: 0,
    totalLeads: 0,
    appointmentsToday: 0,
    totalStudents: 0,
    todayAppointments: [],
    recentLeads: [],
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Fetch leads data
      const leadsResponse = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      const leads = leadsResponse.data.leadUsers;

      // Get today's date at start of day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate new leads today
      const newLeadsToday = leads.filter((lead) => {
        const leadDate = new Date(lead.createdAt);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === today.getTime();
      }).length;

      // Get total leads/students count
      const totalLeads = leads.length;
      const totalStudents = new Set(leads.map((lead) => lead.studentName)).size;

      // Fetch consultation schedules
      const schedulesResponse = await axios.get(
        `${backendUrl}/api/consultant/getSchedules`
      );
      const schedules = schedulesResponse.data.schedules;

      // Get today's appointments
      const todayAppointments = schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.start);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === today.getTime();
      });

      // Get recent leads (created today)
      const recentLeads = leads
        .filter((lead) => {
          const leadDate = new Date(lead.createdAt);
          leadDate.setHours(0, 0, 0, 0);
          return leadDate.getTime() === today.getTime();
        })
        .map((lead) => ({
          name: lead.name,
          phone: lead.phone,
          status: lead.status,
        }));

      setDashboardData({
        newLeadsToday,
        totalLeads,
        appointmentsToday: todayAppointments.length,
        totalStudents,
        todayAppointments: todayAppointments.map((apt) => ({
          time: new Date(apt.start).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          title: apt.title,
          desc: apt.desc,
        })),
        recentLeads,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex min-h-screen">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-20">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 mt-[70px]">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Advisor Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Activity className="w-4 h-4" />
              Live Dashboard
            </div>
          </div>

          {/* Main Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Column - Cards & Tables */}
              <div className="xl:col-span-3 space-y-6">
                {/* Enhanced Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <StatCard
                    icon={<UserPlus className="w-6 h-6" />}
                    title="New Leads Today"
                    number={dashboardData.newLeadsToday}
                    gradient="from-emerald-500 to-teal-600"
                    shadowColor="shadow-emerald-200"
                    trend="+12%"
                    trendIcon={<TrendingUp className="w-3 h-3" />}
                  />
                  <StatCard
                    icon={<Users className="w-6 h-6" />}
                    title="Total Leads"
                    number={dashboardData.totalLeads}
                    gradient="from-blue-500 to-indigo-600"
                    shadowColor="shadow-blue-200"
                    trend="+8%"
                    trendIcon={<TrendingUp className="w-3 h-3" />}
                  />
                  <StatCard
                    icon={<CalendarCheck className="w-6 h-6" />}
                    title="Appointments Today"
                    number={dashboardData.appointmentsToday}
                    gradient="from-violet-500 to-purple-600"
                    shadowColor="shadow-violet-200"
                    trend="+15%"
                    trendIcon={<TrendingUp className="w-3 h-3" />}
                  />
                  <StatCard
                    icon={<Users2 className="w-6 h-6" />}
                    title="Total Students"
                    number={dashboardData.totalStudents}
                    gradient="from-orange-500 to-red-500"
                    shadowColor="shadow-orange-200"
                    trend="+5%"
                    trendIcon={<TrendingUp className="w-3 h-3" />}
                  />
                </div>

                {/* Enhanced Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Appointments Table */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Today's Appointments
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">
                              Time
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">
                              Title
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600 hidden sm:table-cell">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.todayAppointments.length > 0 ? (
                            dashboardData.todayAppointments.map(
                              (apt, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                >
                                  <td className="py-4 px-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                      {apt.time}
                                    </span>
                                  </td>
                                  <td className="py-4 px-2 font-medium text-slate-800">
                                    {apt.title}
                                  </td>
                                  <td className="py-4 px-2 text-slate-600 text-sm hidden sm:table-cell">
                                    {apt.desc}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="py-8 text-center text-slate-500"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <CalendarCheck className="w-8 h-8 text-slate-300" />
                                  <span>
                                    No appointments scheduled for today
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Leads Table */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Recent Leads
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">
                              Name
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600 hidden sm:table-cell">
                              Phone
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-600">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentLeads.length > 0 ? (
                            dashboardData.recentLeads.map((lead, index) => (
                              <tr
                                key={index}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="py-4 px-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-slate-800">
                                      {lead.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-2 text-slate-600 hidden sm:table-cell">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {lead.phone}
                                  </div>
                                </td>
                                <td className="py-4 px-2">
                                  <StatusBadge status={lead.status} />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="py-8 text-center text-slate-500"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Users className="w-8 h-8 text-slate-300" />
                                  <span>No new leads today</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Enhanced Calendar */}
              <div className="xl:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                      <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Calendar
                    </h2>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-inner">
                    <iframe
                      src="https://calendar.google.com/calendar/embed?height=400&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FHo_Chi_Minh&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=MONTH"
                      className="w-full h-[400px] border-0"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Enhanced Card Component
function StatCard({
  icon,
  title,
  number,
  gradient,
  shadowColor,
  trend,
  trendIcon,
}) {
  return (
    <div
      className={`relative group cursor-pointer transform hover:scale-105 transition-all duration-300`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity ${shadowColor} shadow-lg group-hover:shadow-xl`}
      ></div>
      <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
          {trend && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              {trendIcon}
              <span className="text-xs font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className="text-white">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{number}</div>
          <div className="text-sm opacity-90 font-medium">{title}</div>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Contacted":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "Not Responding":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          status === "Contacted"
            ? "bg-blue-500"
            : status === "Not Responding"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}
      ></div>
      {status}
    </span>
  );
}

export default DashBoard;
