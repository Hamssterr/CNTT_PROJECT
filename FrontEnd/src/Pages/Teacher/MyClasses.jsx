import React, { useState } from "react";
import Navbar from "../../Components/Teacher/NavBar";
import Sidebar from "../../Components/Teacher/SideBar";
import { Users, BookOpen, Calendar, Clock, Medal } from "lucide-react";

// Mock data for classes
const mockClasses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    subject: "Mathematics",
    schedule: "Monday, Wednesday",
    time: "9:00 AM - 10:30 AM",
    totalStudents: 25,
    startDate: "2024-01-15",
    level: "Advanced",
  },
  {
    id: 2,
    name: "Basic Physics",
    subject: "Physics",
    schedule: "Tuesday, Thursday",
    time: "2:00 PM - 3:30 PM",
    totalStudents: 20,
    startDate: "2024-01-16",
    level: "Beginner",
  },
  {
    id: 3,
    name: "Chemistry Lab",
    subject: "Chemistry",
    schedule: "Friday",
    time: "10:00 AM - 12:00 PM",
    totalStudents: 15,
    startDate: "2024-01-18",
    level: "Intermediate",
  },
];

// Mock data for students
const mockStudents = {
  1: [
    {
      id: 1,
      name: "John Doe",
      age: 18,
      grade: "A",
      attendance: "95%",
      email: "john@example.com",
      performance: "Excellent",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 17,
      grade: "B+",
      attendance: "88%",
      email: "jane@example.com",
      performance: "Good",
    },
    {
      id: 3,
      name: "Alice Johnson",
      age: 18,
      grade: "A-",
      attendance: "92%",
      email: "alice@example.com",
      performance: "Very Good",
    },
  ],
  2: [
    {
      id: 4,
      name: "Bob Wilson",
      age: 17,
      grade: "B",
      attendance: "85%",
      email: "bob@example.com",
      performance: "Good",
    },
    {
      id: 5,
      name: "Carol Brown",
      age: 18,
      grade: "A",
      attendance: "98%",
      email: "carol@example.com",
      performance: "Excellent",
    },
  ],
  3: [
    {
      id: 6,
      name: "David Lee",
      age: 17,
      grade: "B+",
      attendance: "90%",
      email: "david@example.com",
      performance: "Very Good",
    },
    {
      id: 7,
      name: "Emma Davis",
      age: 18,
      grade: "A-",
      attendance: "93%",
      email: "emma@example.com",
      performance: "Excellent",
    },
  ],
};

function MyClasses() {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassClick = (classId) => {
    setSelectedClass(classId);
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Very Good":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-25">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Classes</h1>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => handleClassClick(cls.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedClass === cls.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {cls.name}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {cls.level}
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-600">
                    <BookOpen size={18} className="mr-2 text-blue-500" />
                    {cls.subject}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2 text-green-500" />
                    {cls.schedule}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2 text-yellow-500" />
                    {cls.time}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Users size={18} className="mr-2 text-purple-500" />
                    {cls.totalStudents} Students
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Students Section */}
          {selectedClass && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Students in{" "}
                {mockClasses.find((c) => c.id === selectedClass)?.name}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockStudents[selectedClass]?.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Age: {student.age}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.attendance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getPerformanceColor(
                              student.performance
                            )}`}
                          >
                            {student.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClasses;
