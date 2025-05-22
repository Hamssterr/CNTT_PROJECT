import React, { useMemo, useState } from "react";

const TimeTableManagement = () => {
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedCourseType, setSelectedCourseType] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");

  const mockStudentData = {
    timetable: [
      {
        id: 1,
        courseTitle: "Advanced Mathematics",
        roomNumber: "R101",
        instructor: "Dr. Smith",
        timing: "09:00 AM - 10:30 AM",
        day: "Monday",
        courseType: "Core",
        semester: "Spring 2024",
      },
      {
        id: 2,
        courseTitle: "Computer Science",
        roomNumber: "R102",
        instructor: "Prof. Johnson",
        timing: "11:00 AM - 12:30 PM",
        day: "Wednesday",
        courseType: "Elective",
        semester: "Spring 2024",
      },
    ],
  };

  const filteredTimetable = useMemo(() => {
    return mockStudentData.timetable.filter((course) => {
      return (
        (selectedSemester === "all" || course.semester === selectedSemester) &&
        (selectedCourseType === "all" ||
          course.courseType === selectedCourseType) &&
        (selectedDay === "all" || course.day === selectedDay)
      );
    });
  }, [selectedSemester, selectedCourseType, selectedDay]);

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Semesters</option>
          <option value="Spring 2024">Spring 2024</option>
          <option value="Fall 2023">Fall 2023</option>
        </select>
        <select
          value={selectedCourseType}
          onChange={(e) => setSelectedCourseType(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Course Types</option>
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
        </select>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Days</option>
          <option value="Monday">Monday</option>
          <option value="Wednesday">Wednesday</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTimetable.map((course) => (
          <div
            key={course.id}
            className={`p-4 rounded-lg shadow-md ${"bg-white"} hover:shadow-lg transition-shadow`}
          >
            <h3 className="text-xl font-semibold mb-2">{course.courseTitle}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Instructor
                </p>
                <p>{course.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Room</p>
                <p>{course.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p>{course.timing}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Day</p>
                <p>{course.day}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableManagement;
