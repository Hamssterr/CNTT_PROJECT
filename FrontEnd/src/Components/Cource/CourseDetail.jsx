import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  BookOpen,
  Users,
  ArrowLeft,
  Clock2,
  X, 
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../Navbar";
import SideBar from "../SideBar";
import Loading from "../Loading";
import CourseRegisterForm from "./CourseRegisterForm";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/course/register`, {
        courseId: id,
        ...registerData,
      });
  
      if (res.data.success) {
        toast.success("Register successfull!");
        setShowRegisterForm(false);
        setRegisterData({ email: "", name: "", phoneNumber: "" });
      } else {
        toast.error(res.data.message || "Register Error.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Internal error.");
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/getCourse/${id}`);
      if (response.data.success) {
        setCourse(response.data.data);
      } else {
        toast.error(response.data.message || "Can not found the course.");
      }
    } catch (error) {
      console.error("Failed to fetch course: ", error);
      toast.error("Can not found the course. Please try again.");
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [backendUrl, id]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDuration = (hours) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    let result = "";
    if (h > 0) {
      result += `${h.toString().padStart(2)} hour${h > 1 ? "s" : ""} `;
    }
    if (m > 0) {
      result += `${m.toString().padStart(2, "0")} minute${m > 1 ? "s" : ""}`;
    }

    return result || "00 hour 00 minute";
  };

  if (!course) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-5 md:ml-30">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {course.title || "None"}
              </h1>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {course.instructor?.name || "Không xác định"}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  What will you get from this course?
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✓</span>
                    <span className="text-gray-600">
                      {course.description ||
                        "Cách học thuật căn bản chuyên ngành IT"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  The target you can get in this course?
                </h2>
                <ul className="space-y-2">
                  {course.target?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">✓</span>
                      <span className="text-gray-600">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  COURSE CONTENT
                </h2>
                <p className="text-gray-500 mb-4">
                  {course.content?.length || 0} Chapter •{" "}
                  {course.content?.reduce(
                    (total, section) => total + (section.lessons?.length || 0),
                    0
                  ) || 0}{" "}
                  Lesson • Duration{" "}
                  {course.duration?.totalHours
                    ? formatDuration(course.duration.totalHours)
                    : "00 hour 00 minute"}
                </p>
                <div className="space-y-2">
                  {course.content?.map((section) => (
                    <div key={section.sectionId} className="border rounded-md">
                      <button
                        onClick={() => toggleSection(section.sectionId)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition"
                      >
                        <span className="text-gray-700 font-medium">
                          {section.title}
                        </span>
                        {expandedSections[section.sectionId] ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      {expandedSections[section.sectionId] &&
                        section.lessons?.length > 0 && (
                          <div className="pl-8 pr-4 pb-4">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.lessonId}
                                className="flex items-center gap-2 py-2 text-gray-600"
                              >
                                <PlayCircle
                                  size={16}
                                  className="text-blue-500"
                                />
                                <span>{lesson.title}</span>
                                <span className="ml-auto text-gray-500">
                                  {lesson.durationMinutes
                                    ? `${lesson.durationMinutes} phút`
                                    : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-80 w-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={course.thumbnail || "None"}
                    alt="Course Thumbnail"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                    <h3 className="text-white text-lg font-semibold">
                      {course.title || "None"}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    OPEN REGISTRATION
                  </h4>
                  <p className="text-gray-600 mb-4">View course introduction</p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>
                        Total Course:{" "}
                        {course.content?.reduce(
                          (total, section) =>
                            total + (section.lessons?.length || 0),
                          0
                        ) || 0}{" "}
                        section
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-500" />
                      <span>
                        {(() => {
                          const totalMinutes =
                            course.content?.reduce(
                              (total, section) =>
                                total +
                                (section.lessons?.reduce(
                                  (sum, lesson) =>
                                    sum + (lesson.durationMinutes || 0),
                                  0
                                ) || 0),
                              0
                            ) || 0;
                          return `${totalMinutes} minute${
                            totalMinutes !== 1 ? "s" : ""
                          }`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <span>Level: {course.level || "cơ bản"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>
                        Total Hour:{" "}
                        {course.duration?.totalHours
                          ? formatDuration(course.duration.totalHours)
                          : "00 giờ 00 phút"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-500" />
                      <span>
                        {course.schedule?.daysOfWeek?.length > 0
                          ? `Day: ${course.schedule.daysOfWeek.join(" - ")}`
                          : "Học lịch mở, mở lịch"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock2 size={16} className="text-gray-500" />
                      <span>
                        {course.schedule?.daysOfWeek?.length > 0
                          ? `Time: ${course.schedule.shift}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-green-600">
                        {course.price === 0
                          ? "Free"
                          : `${course.price} ${course.currency || "VND"}`}
                      </span>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    REGISTER FOR COURSE
                  </button>

                  {/* Register Form */}
                  {showRegisterForm && (
                    <CourseRegisterForm
                      registerData={registerData}
                      handleChange={handleRegisterChange}
                      handleSubmit={handleRegisterSubmit}
                      onClose={() => setShowRegisterForm(false)}
                    />
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

export default CourseDetail;
