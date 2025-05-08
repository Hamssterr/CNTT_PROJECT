import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/SideBar';
import CourseCard from '../Components/Cource/CourseCard';

import axios from 'axios';
import { AppContext } from '../context/AppContext';


const Home = () => {

  const {backendUrl} = useContext(AppContext);
  const [courses, setCourse] = useState([]);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/getAllCourseForPublicRoute`);
      setCourse(response.data.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, [backendUrl])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar cố định ở trên cùng */}
      <Navbar />

      {/* Container chính với Sidebar và Main Content */}
      <div className="flex flex-1">
       
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-30">
          <h1 className="text-3xl font-bold mb-4">Welcome to Home</h1>
          <p className="text-lg">
            This is the main content area. You can add your courses, blogs, or any other content here.
          </p>
          {/* Ví dụ thêm nội dung */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-7">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                description={course.description}
                instructor={course.instructor?.name || "Unknow"}
                price={course.price}
                image={course.thumbnail}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;