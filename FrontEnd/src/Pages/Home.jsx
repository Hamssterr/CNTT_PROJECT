import React from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/SideBar';
import CourseCard from '../Components/Cource/CourseCard';
import image from '../assets/html-css-pro.png'


const courses = [
  {
    title: "Learn ReactJS Fundamentals",
    description:
      "Master the basics of ReactJS and build modern web applications with this comprehensive course.",
    instructor: "John Doe",
    price: "49.99",
    image: image,
  },
  {
    title: "Advanced JavaScript Concepts",
    description:
      "Dive deep into JavaScript with ES6+, async programming, and functional concepts.",
    instructor: "Jane Smith",
    price: "59.99",
    image: image,
  },
  {
    title: "HTML & CSS Pro",
    description:
      "Become a pro at building responsive and beautiful websites with HTML and CSS.",
    instructor: "Alex Johnson",
    price: "39.99",
    image: image,
  },
  {
    title: "Node.js for Beginners",
    description:
      "Learn server-side development with Node.js and build scalable applications.",
    instructor: "Emily Brown",
    price: "45.00",
    image: image,
  },
  {
    title: "Python Data Science Basics",
    description:
      "Explore data analysis and visualization with Python, Pandas, and Matplotlib.",
    instructor: "Michael Lee",
    price: "69.99",
    image: image,
  },
  {
    title: "Python Data Science Basics",
    description:
      "Explore data analysis and visualization with Python, Pandas, and Matplotlib.",
    instructor: "Michael Lee",
    price: "69.99",
    image: image,
  },
  {
    title: "Python Data Science Basics",
    description:
      "Explore data analysis and visualization with Python, Pandas, and Matplotlib.",
    instructor: "Michael Lee",
    price: "69.99",
    image: image,
  },
  {
    title: "Python Data Science Basics",
    description:
      "Explore data analysis and visualization with Python, Pandas, and Matplotlib.",
    instructor: "Michael Lee",
    price: "69.99",
    image: image,
  },
];

const Home = () => {
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
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                title={course.title}
                description={course.description}
                instructor={course.instructor}
                price={course.price}
                image={course.image}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;