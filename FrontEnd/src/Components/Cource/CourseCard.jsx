import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({id, title, description, instructor, price, image }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/getCourse/${id}`);
  }

  return (
    <div 
    onClick={handleClick}
    className="w-full rounded-xl overflow-hidden shadow-md  bg-white transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
      {/* Course Image */}
      <div className="w-full h-[130px] sm:h-[130px] md:h-[130px] lg:h-[130px] overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt={title} />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Course Title */}
        <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>

        {/* Course Description */}
        <p className="text-gray-700 text-sm line-clamp-2">{description}</p>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        {/* Instructor */}
        <div className="flex items-center mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {instructor}
          </span>
        </div>

        {/* Price & Enroll Button */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">${price}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

