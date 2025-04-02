import React from 'react';

const CourseCard = ({ title, description, instructor, price, image }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg m-4 bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <img 
        className="w-full h-48 object-cover" 
        src={image} 
        alt={title} 
      />
      
      {/* Card Content */}
      <div className="px-6 py-4">
        {/* Course Title */}
        <div className="font-bold text-xl mb-2 text-gray-800">{title}</div>
        
        {/* Course Description */}
        <p className="text-gray-600 text-base line-clamp-3">
          {description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-6 pt-4 pb-2">
        {/* Instructor */}
        <div className="flex items-center mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2.5 py-0.5 rounded-full">
            {instructor}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">${price}</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;