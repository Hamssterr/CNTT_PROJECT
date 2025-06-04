import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import {
  ArrowLeft,
  GraduationCap,
  CalendarDays,
  Clock7,
  User,
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
  const [leadsData, setLeadsData] = useState([]);
  const navigate = useNavigate();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    studentName: "",
    email: "",
    phone: "",
    status: "",
    course: "",
    registrationDate: "",
    paymentStatus: "",
  });

  const fetchLeadsData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (response.data.success) {
        setLeadsData(response.data.leadUsers);
      } else {
        toast.error(response.data.message || "Failed to fetch leads.");
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to fetch leads.");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra trùng lặp số điện thoại hoặc email
    const isDuplicate = leadsData.some(
      (lead) =>
        (lead.phone === registerData.phone ||
          lead.email === registerData.email) &&
        lead.course === registerData.course
    );

    if (isDuplicate) {
      toast.warning("Phone number or email already exists!");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/consultant/addNewLeadUser`,
        {
          name: registerData.name, // Parent/Guardian Name
          studentName: registerData.studentName,
          email: registerData.email,
          phone: registerData.phone,
          course: course?.title || "Unknown Course", // Lấy tên khóa học hoặc giá trị mặc định
          status: "Pending", // Mặc định trạng thái là Pending
          registrationDate: new Date().toISOString(), // Ngày đăng ký hiện tại
          paymentStatus: "Unpaid", // Mặc định trạng thái thanh toán là Unpaid
        }
      );

      if (res.data.success) {
        await axios.post(`${backendUrl}/api/consultant/notification/create`, {
          type: "success",
          title: "New Course Registration",
          message: `${registerData.name} has registered for ${course.title}`,
          recipientRole: "consultant",
          metadata: {
            courseId: course._id,
            courseName: course.title,
            studentName: registerData.studentName,
            studentEmail: registerData.email,
          },
        });
        toast.success("Registration successful!");
        setShowRegisterForm(false);
        setRegisterData({
          name: "",
          studentName: "",
          email: "",
          phone: "",
        });
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Internal error.");
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/course/getCourse/${id}`
      );

      if (response.data.success) {
        setCourse(response.data.data);
        console.log("data: ", response.data.data);
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
    fetchLeadsData();
  }, [backendUrl, id]);

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
            <span className="font-medium">Back To Home</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative w-full aspect-[460/259] max-w-[960px] mx-auto lg:max-w-[1200px] xl:max-w-[800px] xl:hidden">
              <img
                src={
                  course?.thumbnail ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=460&h=259&q=80"
                }
                alt={course?.title || "Course thumbnail"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=460&h=259&q=80";
                }}
                loading="lazy"
              />
            </div>

            {/* Body */}
            <div className=" p-6">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <p className="text-3xl font-bold text-gray-900">
                    ${course.price}
                  </p>
                  <button
                    className="mt-2 w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setShowRegisterForm(true)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>

              {/* Course Description */}
              <p
                className="text-gray-600 mb-6"
                style={{ whiteSpace: "pre-line" }}
              >
                {course.description}
              </p>

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

              {/* Instructor Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <GraduationCap className="mr-2 text-blue-600" />
                  Instructor
                </h2>
                <div className="flex items-center">
                  <img
                    src={
                      course.instructor.profileImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {course.instructor.name}
                    </h3>
                    <p className="text-gray-600">
                      {course.instructor.expertise}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                {/* Schedule */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center mb-3">
                    <CalendarDays className="mr-2 text-blue-600" />
                    Schedule
                  </h3>
                  {course.schedule && (
                    <div className="text-gray-600">
                      <p>Days: {course.schedule.daysOfWeek.join(", ")}</p>
                      <p className="flex items-center mt-2">
                        <Clock7 className="mr-2" />
                        {course.schedule.shift}
                      </p>
                    </div>
                  )}
                </div>

                {/* Enrollment Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center mb-3">
                    <User className="mr-2 text-blue-600" />
                    Enrollment
                  </h3>
                  <div className="text-gray-600">
                    <p>
                      {course.enrolledUsers.length} / {course.maxEnrollment}{" "}
                      spots filled
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{
                          width: `${
                            course.maxEnrollment > 0
                              ? (course.enrolledUsers.length /
                                  course.maxEnrollment) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Status</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          </div>
        </main>

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
  );
};

export default CourseDetail;
