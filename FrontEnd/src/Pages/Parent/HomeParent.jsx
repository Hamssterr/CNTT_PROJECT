import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import ParentNavbar from "../../Components/Parent/Navbar";
import ParentSidebar from "../../Components/Parent/SideBar";
import Loading from "../../Components/Loading";

export const HomeParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    children: [],
    upcomingClasses: [],
    totalCourses: 0,
    ongoingCourses: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch children data
        const childrenResponse = await axios.get(
          `${backendUrl}/api/parent/getDataChildrenForParent`,
          { withCredentials: true }
        );

        // Fetch class data
        const classResponse = await axios.get(
          `${backendUrl}/api/parent/getClassWithHaveChildren`,
          { withCredentials: true }
        );

        if (childrenResponse.data.success && classResponse.data.success) {
          const children = childrenResponse.data.data;
          const classes = classResponse.data.data;

          // Calculate statistics
          const currentDate = new Date();
          const ongoingCourses = classes.filter((course) => {
            const startDate = new Date(course.courseId?.duration?.startDate);
            const endDate = new Date(course.courseId?.duration?.endDate);
            return startDate <= currentDate && currentDate <= endDate;
          });

          // Get upcoming classes (next 5 classes)
          const upcomingClasses = classes
            .filter(
              (course) =>
                new Date(course.courseId?.duration?.startDate) > currentDate
            )
            .slice(0, 5);

          setDashboardData({
            children,
            upcomingClasses,
            totalCourses: classes.length,
            ongoingCourses: ongoingCourses.length,
          });
        }
      } catch (error) {
        toast.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen mt-[80px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ParentNavbar />
      </div>

      <div className="flex flex-1">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[60px]">
          <ParentSidebar />
        </div>

        <main className="flex-1 p-5 md:ml-30 ">
          <div className="mt-6">
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Welcome to Parent Dashboard
                  </span>
                </h2>
                <p className="mt-2 text-gray-600">
                  Monitor your children's educational journey and upcoming
                  classes
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Children Count */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Children
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {dashboardData.children.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Link
                    to="/parent/children-management"
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    View Details
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Total Courses */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Courses
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {dashboardData.totalCourses}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                  <Link
                    to="/parent/timetable"
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                  >
                    View Timetable
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Ongoing Courses */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Ongoing Courses
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {dashboardData.ongoingCourses}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Link
                    to="/parent/timetable"
                    className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
                  >
                    View Active Courses
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Children Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Children List */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    My Children
                  </h3>
                  {dashboardData.children.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <img
                            src={
                              child.profileImage
                                ? child.profileImage
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    `${child.firstName} ${child.lastName}`
                                  )}&background=random&color=fff&size=100&font-size=0.5&bold=true`
                            }
                            alt={`${child.firstName}'s profile`}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{`${child.firstName} ${child.lastName}`}</h4>
                            <p className="text-sm text-gray-500">
                              Student ID: {child.id}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No children found
                    </p>
                  )}
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Upcoming Classes
                  </h3>
                  {dashboardData.upcomingClasses.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.upcomingClasses.map((course) => (
                        <div
                          key={course._id}
                          className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-800">
                              {course.courseId?.title || "Unnamed Course"}
                            </h4>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {course.schedule?.shift || "N/A"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {course.schedule?.daysOfWeek?.join(", ") ||
                              "Schedule not set"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No upcoming classes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeParent;
