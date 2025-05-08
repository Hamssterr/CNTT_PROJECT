import React from "react";
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

function DashBoard() {
  // Sample data
  const dashboardData = {
    newLeadsToday: 5,
    totalLeads: 150,
    appointmentsToday: 8,
    totalStudents: 120,
    todayAppointments: [
      {
        time: "09:30 AM",
        title: "Initial Consultation",
        desc: "Meeting with potential student",
      },
      {
        time: "02:00 PM",
        title: "Follow-up Meeting",
        desc: "Course registration discussion",
      },
      {
        time: "04:30 PM",
        title: "Academic Counseling",
        desc: "Career path planning",
      },
    ],
    recentLeads: [
      {
        name: "John Smith",
        phone: "0123456789",
        status: "Contacted",
      },
      {
        name: "Mary Johnson",
        phone: "0987654321",
        status: "Not Responding",
      },
      {
        name: "David Wilson",
        phone: "0123498765",
        status: "New",
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-30">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
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
                      {dashboardData.todayAppointments.map((apt, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                          <td className="py-2">{apt.time}</td>
                          <td>{apt.title}</td>
                          <td>{apt.desc}</td>
                        </tr>
                      ))}
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
                      {dashboardData.recentLeads.map((lead, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Available Courses Table */}
                <div className="bg-white p-4 rounded-xl shadow">
                  <h2 className="text-lg font-semibold mb-4">
                    Available Courses
                  </h2>
                  <table className="w-full text-left">
                    <thead className="text-sm font-semibold text-gray-600 border-b">
                      <tr>
                        <th className="py-2">Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-100">
                        <td className="py-2">Advanced English Conversation</td>
                        <td>
                          <span className="text-green-600">
                            5 spots available
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-100">
                        <td className="py-2">Basic Office Computing</td>
                        <td>
                          <span className="text-green-600">
                            10 spots available
                          </span>
                        </td>
                      </tr>
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
