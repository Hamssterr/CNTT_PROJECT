import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/SideBar";
import CourseCard from "../Components/Cource/CourseCard";

import axios from "axios";
import { AppContext } from "../context/AppContext";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { motion as Motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(0);
  const [banners, setBanners] = useState([]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/course/getAllCourseForPublicRoute`
      );
      setCourses(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Loading courses failed. Please try again.");
      setLoading(false);
    }
  };

  const fetchBannersData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/banner/getBanner`);
      setBanners(response.data.banners);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchBannersData();
  }, [backendUrl]);

  // Filter courses by category (fallback if category field is missing)
  const theoryCourses = courses.filter(
    (course) => course.category?.toLowerCase() === "theory"
  );
  const programmingCourses = courses.filter(
    (course) => course.category?.toLowerCase() === "programming"
  );

  const nextBanner = () => {
    if (banners.length > 0) {
      setDirection(1);
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }
  };

  const prevBanner = () => {
    if (banners.length > 0) {
      setDirection(-1);
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const goToBanner = (index) => {
    if (banners.length > 0) {
      setDirection(index > currentBanner ? 1 : -1);
      setCurrentBanner(index);
    }
  };

  // Navigate to the course associated with the banner
  const handleBannerClick = () => {
    const banner = banners[currentBanner];
    if (banner?.courseId) {
      navigate(`/getCourse/${banner.courseId._id}`);
    } else {
      console.warn("No courseId found for this banner");
    }
  };

  // Animation variants for the banner
  const bannerVariants = {
    enter: (direction = 1) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction = 1) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute",
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main Container with Sidebar and Content */}
      <div className="flex flex-1 pt-20">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-30">
          {/* Hero Banner with Navigation and Pagination Dots */}
          <section className="relative mb-12">
            {banners.length > 0 && (
              <AnimatePresence initial={false} custom={direction}>
                <Motion.div
                  key={currentBanner}
                  custom={direction}
                  variants={bannerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`relative overflow-hidden rounded-2xl py-12 px-6 text-white bg-gradient-to-r ${banners[currentBanner].gradient} h-[400px] md:h-[450px] flex items-center`}
                >
                  {/* Background overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                      backgroundImage: `url(${banners[currentBanner].backgroundImage})`,
                      backgroundSize: "85%",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Text content */}
                  <div className="relative z-10 text-left space-y-6 pl-8 w-3/4">
                    <h1 className="text-2xl md:text-4xl font-extrabold flex items-center gap-2">
                      {banners[currentBanner].title}
                      <span className="text-yellow-400 text-xl md:text-2xl">
                        ⭐
                      </span>
                    </h1>
                    <p className="text-sm md:text-lg max-w-md md:max-w-lg">
                      {banners[currentBanner].description}
                    </p>
                    <button
                      onClick={handleBannerClick}
                      className={`inline-block rounded-full px-6 py-2 font-semibold transition-colors duration-300 bg-white ${banners[currentBanner].buttonColor} hover:bg-gray-100 text-black`}
                      disabled={!banners[currentBanner].courseId}
                    >
                      {banners[currentBanner].buttonText}
                    </button>
                  </div>
                </Motion.div>
              </AnimatePresence>
            )}

            {/* Controls */}
            {/* Left Button */}
            <button
              onClick={prevBanner}
              className="absolute top-1/2 left-4 -translate-x-full transform -translate-y-1/2 bg-gray-200 text-gray-800 p-3 rounded-full hover:bg-gray-300 transition-colors z-20"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Button */}
            <button
              onClick={nextBanner}
              className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-gray-200 text-gray-800 p-3 rounded-full hover:bg-gray-300 transition-colors z-20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentBanner === index ? "bg-blue-600" : "bg-gray-300"
                  } hover:bg-blue-400 transition-colors`}
                ></button>
              ))}
            </div>
          </section>

          {/* Courses Section */}
          <section id="courses">
            {/* Theory Courses */}
            <section className="mb-12 pl-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Theory Courses
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 text-lg">{error}</div>
              ) : theoryCourses.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                  There are no theory courses at present.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-7">
                  {theoryCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      title={course.title}
                      description={course.description}
                      instructor={course.instructor?.name || "Unknown"}
                      price={course.price}
                      image={course.thumbnail}
                      category={course.category || "theory"}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Programming Courses */}
            <section className="pl-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Programming Courses
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 text-lg">{error}</div>
              ) : programmingCourses.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                  There are no programming courses at present.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-7">
                  {programmingCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      title={course.title}
                      description={course.description}
                      instructor={course.instructor?.name || "Unknown"}
                      price={course.price}
                      image={course.thumbnail}
                      category={course.category || "programming"}
                    />
                  ))}
                </div>
              )}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
