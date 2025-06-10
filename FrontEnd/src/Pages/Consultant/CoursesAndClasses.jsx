import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Consultant/Navbar";
import Sidebar from "../../Components/Consultant/Sidebar";
import Footer from "../../Components/Footer";
import { Clock, Users, BookOpen, Award, Search } from "lucide-react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

function CoursesAndClasses() {
  const { backendUrl } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/course/getAllCourse`
        );
        if (data.success) {
          setCourses(data.courses);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [backendUrl]);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category)),
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex min-h-screen bg-gray-100">
        <div className="fixed top-[70px] left-0 bottom-0 z-40 w-[280px]">
          <Sidebar />
        </div>
        <div className="flex-1 p-8 md:ml-20 mt-[70px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Our Courses
            </h1>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {/* Course Image */}
                    <div className="relative h-48">
                      <img
                        src={course.thumbnail || "default-course-image.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        {course.level}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Course Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock size={16} className="mr-2" />
                          <span className="text-sm">
                            {course.duration?.totalHours || 0} hours
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={16} className="mr-2" />
                          <span className="text-sm">
                            {course.maxEnrollment} students
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BookOpen size={16} className="mr-2" />
                          <span className="text-sm">{course.category}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Award size={16} className="mr-2" />
                          <span className="text-sm">{course.level}</span>
                        </div>
                      </div>

                      {/* Price and Status */}
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${course.price}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            course.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoursesAndClasses;
