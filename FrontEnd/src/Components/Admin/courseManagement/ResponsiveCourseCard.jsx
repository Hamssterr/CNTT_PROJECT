import React from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  Search,
  Filter,
  ChevronUp,
  Eye,
  Pencil,
  UserPlus,
  Trash2,
  Menu,
  X,
} from "lucide-react";

const ResponsiveCourseCard = ({
  course,
  onView,
  onEdit,
  onAddStudent,
  onDelete,
  onToggleStatus,
}) => (
  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start gap-3 mb-3">
      <div className="relative flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            course.status === "Active" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {course.instructor.name.charAt(0)}
          </div>
          <span className="text-gray-600 text-xs truncate">
            {course.instructor.name}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{course.enrolledUsers.length}</span>
          </div>
          <span>
            {new Date(course.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>

        <button
          onClick={() => onToggleStatus(course)}
          className={`px-3 py-1 rounded-full text-xs font-medium mb-3 ${
            course.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {course.status}
        </button>
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="flex gap-2">
        <button
          className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onView(course)}
        >
          <Eye size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => onEdit(course)}
        >
          <Pencil size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors"
          onClick={() => onAddStudent(course)}
        >
          <UserPlus size={14} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
          onClick={() => onDelete(course)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default ResponsiveCourseCard;