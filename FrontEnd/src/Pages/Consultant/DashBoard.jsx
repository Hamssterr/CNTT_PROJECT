import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Consultant/Navbar";
import {
  Users,
  CalendarCheck,
  UserPlus,
  Users2,
  CalendarDays,
} from "lucide-react";
import axios from "axios";

function DashBoard() {
  const { backendUrl } = useContext(AppContext);
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
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Advisor Dashboard
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Cards & Tables */}
            <div className="lg:col-span-2">
              {/* Statistic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card
                  icon={<UserPlus />}
                  title="New Leads Today"
                  number={dashboardData.newLeadsToday}
                  color="bg-blue-500"
                />
                <Card
                  icon={<Users />}
                  title="Total Leads"
                  number={dashboardData.totalLeads}
                  color="bg-purple-500"
                />
                <Card
                  icon={<CalendarCheck />}
                  title="Appointments Today"
                  number={dashboardData.appointmentsToday}
                  color="bg-green-500"
                />
                <Card
                  icon={<Users2 />}
                  title="Total Students"
                  number={dashboardData.totalStudents}
                  color="bg-orange-500"
                />
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 gap-4">
                {/* Today's Appointments Table */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">
                    Today's Appointments
                  </h2>
                  <table className="w-full text-left">
                    <thead className="text-sm font-semibold text-gray-600 border-b">
                      <tr>
                        <th className="py-2">Time</th>
                        <th>Title</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.todayAppointments.length > 0 ? (
                        dashboardData.todayAppointments.map((apt, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-gray-100"
                          >
                            <td className="py-2">{apt.time}</td>
                            <td>{apt.title}</td>
                            <td>{apt.desc}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-4 text-center text-gray-500"
                          >
                            No appointments scheduled for today
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Recent Leads Table */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
                  <table className="w-full text-left">
                    <thead className="text-sm font-semibold text-gray-600 border-b">
                      <tr>
                        <th className="py-2">Name</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentLeads.length > 0 ? (
                        dashboardData.recentLeads.map((lead, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-gray-100"
                          >
                            <td className="py-2">{lead.name}</td>
                            <td>{lead.phone}</td>
                            <td>
                              <span
                                className={`${
                                  lead.status === "Contacted"
                                    ? "text-blue-600"
                                    : lead.status === "Not Responding"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                                }`}
                              >
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-4 text-center text-gray-500"
                          >
                            No new leads today
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="bg-white p-4 rounded-xl shadow h-120">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarDays /> Calendar
              </h2>
              <iframe
                src="https://calendar.google.com/calendar/embed?height=400&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FHo_Chi_Minh&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=MONTH"
                className="w-full h-[400px] rounded-lg border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Card Component
function Card({ icon, title, number, color }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 ${color} rounded-xl shadow text-white`}
    >
      <div className="p-3 bg-white/30 rounded-full">{icon}</div>
      <div>
        <div className="text-xl font-semibold">{number}</div>
        <div className="text-sm">{title}</div>
      </div>
    </div>
  );
}

export default DashBoard;
