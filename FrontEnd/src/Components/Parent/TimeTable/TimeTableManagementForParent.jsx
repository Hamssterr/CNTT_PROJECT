// ... existing imports and CourseDetailModal component ...
import React, { useMemo, useState } from "react";

// Simple Modal Component (can be moved to a separate file if it grows)
const CourseDetailModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">{course.courseTitle}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="space-y-3">
          <p><strong className="text-gray-600">Instructor:</strong> {course.instructor}</p>
          <p><strong className="text-gray-600">Room:</strong> {course.roomNumber}</p>
          <p><strong className="text-gray-600">Timing:</strong> {course.timing}</p>
          <p><strong className="text-gray-600">Day:</strong> {course.day}</p>
          <p><strong className="text-gray-600">Course Type:</strong> {course.courseType}</p>
          <p><strong className="text-gray-600">Semester:</strong> {course.semester}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};


const TimeTableManagementForParent = () => {
  // ... existing mockParentData ...
  const mockParentData = {
    children: [
      {
        id: "child1",
        name: "Alex",
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
            courseTitle: "Introduction to Physics",
            roomNumber: "P205",
            instructor: "Dr. Emily Carter",
            timing: "01:00 PM - 02:30 PM",
            day: "Monday",
            courseType: "Core",
            semester: "Spring 2024",
          },
          {
            id: 3,
            courseTitle: "Computer Science",
            roomNumber: "R102",
            instructor: "Prof. Johnson",
            timing: "11:00 AM - 12:30 PM",
            day: "Wednesday",
            courseType: "Elective",
            semester: "Spring 2024",
          },
           {
            id: 7,
            courseTitle: "Creative Writing",
            roomNumber: "L105",
            instructor: "Ms. Anne",
            timing: "03:00 PM - 04:30 PM",
            day: "Wednesday",
            courseType: "Elective",
            semester: "Spring 2024",
          },
        ],
      },
      {
        id: "child2",
        name: "Jamie",
        timetable: [
          {
            id: 4,
            courseTitle: "World History",
            roomNumber: "H301",
            instructor: "Ms. Davis",
            timing: "10:00 AM - 11:30 AM",
            day: "Tuesday",
            courseType: "Core",
            semester: "Spring 2024",
          },
          {
            id: 5,
            courseTitle: "Art & Design",
            roomNumber: "A101",
            instructor: "Mr. Lee",
            timing: "02:00 PM - 03:30 PM",
            day: "Thursday",
            courseType: "Elective",
            semester: "Spring 2024",
          },
          {
            id: 6,
            courseTitle: "Literature",
            roomNumber: "L202",
            instructor: "Dr. Brown",
            timing: "09:00 AM - 10:30 AM",
            day: "Friday",
            courseType: "Core",
            semester: "Fall 2023",
          },
        ],
      },
      {
        id: "child3",
        name: "Casey",
        timetable: [], 
      }
    ],
  };

  const [selectedChildId, setSelectedChildId] = useState(
    mockParentData.children.length > 0 ? mockParentData.children[0].id : ""
  );
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedCourseType, setSelectedCourseType] = useState("all");
  const [selectedDayFilter, setSelectedDayFilter] = useState("all"); 

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState(null);

  // ... existing functions: handleViewDetails, handleCloseModal, selectedChildTimetable, filteredTimetable, groupedTimetableByDay ...
  // ... handleChildChange, availableSemesters, availableCourseTypes, availableDaysForFilter ...

  const handleViewDetails = (course) => {
    setSelectedCourseForDetail(course);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourseForDetail(null);
  };

  const selectedChildTimetable = useMemo(() => {
    if (!selectedChildId) return [];
    const child = mockParentData.children.find(
      (c) => c.id === selectedChildId
    );
    return child ? child.timetable : [];
  }, [selectedChildId, mockParentData.children]);

  const filteredTimetable = useMemo(() => {
    return selectedChildTimetable.filter((course) => {
      return (
        (selectedSemester === "all" || course.semester === selectedSemester) &&
        (selectedCourseType === "all" ||
          course.courseType === selectedCourseType) &&
        (selectedDayFilter === "all" || course.day === selectedDayFilter) 
      );
    });
  }, [selectedChildTimetable, selectedSemester, selectedCourseType, selectedDayFilter]);
  
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const groupedTimetableByDay = useMemo(() => {
    const grouped = filteredTimetable.reduce((acc, course) => {
      const day = course.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(course);
      acc[day].sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.timing.split(' - ')[0]}`);
        const timeB = new Date(`1970/01/01 ${b.timing.split(' - ')[0]}`);
        return timeA - timeB;
      });
      return acc;
    }, {});
    
    const sortedGrouped = {};
    dayOrder.forEach(day => {
        if (grouped[day]) {
            sortedGrouped[day] = grouped[day];
        }
    });
    return sortedGrouped;

  }, [filteredTimetable]);


  const handleChildChange = (e) => {
    setSelectedChildId(e.target.value);
    setSelectedSemester("all");
    setSelectedCourseType("all");
    setSelectedDayFilter("all"); 
  };
  
  const availableSemesters = useMemo(() => {
    if (!selectedChildTimetable) return [];
    const semesters = new Set(selectedChildTimetable.map(course => course.semester));
    return ["all", ...Array.from(semesters).sort()];
  }, [selectedChildTimetable]);

  const availableCourseTypes = useMemo(() => {
    if (!selectedChildTimetable) return [];
    const courseTypes = new Set(selectedChildTimetable.map(course => course.courseType));
    return ["all", ...Array.from(courseTypes).sort()];
  }, [selectedChildTimetable]);

  const availableDaysForFilter = useMemo(() => { 
    if (!selectedChildTimetable) return [];
    const days = new Set(selectedChildTimetable.map(course => course.day));
    const sortedDays = Array.from(days).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    return ["all", ...sortedDays];
  }, [selectedChildTimetable]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Children's Timetable
      </h2>

      {/* ... existing JSX for child selector and filters ... */}
      {mockParentData.children.length > 0 ? (
        <>
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <label
              htmlFor="childSelector"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Child:
            </label>
            <select
              id="childSelector"
              value={selectedChildId}
              onChange={handleChildChange}
              className="w-full md:w-1/2 lg:w-1/3 p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              {mockParentData.children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          {selectedChildId && selectedChildTimetable.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow">
                <div>
                    <label htmlFor="semesterFilter" className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
                    <select
                    id="semesterFilter"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    disabled={availableSemesters.length <= 1}
                    >
                    {availableSemesters.map(semester => (
                        <option key={semester} value={semester}>
                        {semester === "all" ? "All Semesters" : semester}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="courseTypeFilter" className="block text-xs font-medium text-gray-600 mb-1">Course Type</label>
                    <select
                    id="courseTypeFilter"
                    value={selectedCourseType}
                    onChange={(e) => setSelectedCourseType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    disabled={availableCourseTypes.length <= 1}
                    >
                    {availableCourseTypes.map(type => (
                        <option key={type} value={type}>
                        {type === "all" ? "All Course Types" : type}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="dayFilter" className="block text-xs font-medium text-gray-600 mb-1">Day of Week</label>
                    <select
                    id="dayFilter"
                    value={selectedDayFilter}
                    onChange={(e) => setSelectedDayFilter(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    disabled={availableDaysForFilter.length <= 1}
                    >
                    {availableDaysForFilter.map(day => (
                        <option key={day} value={day}>
                        {day === "all" ? "All Days" : day}
                        </option>
                    ))}
                    </select>
                </div>
              </div>

              {Object.keys(groupedTimetableByDay).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedTimetableByDay).map(([day, courses]) => (
                    <div key={day} className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2">
                        {day}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer bg-gray-50 hover:bg-indigo-50"
                            onClick={() => handleViewDetails(course)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleViewDetails(course)}
                          >
                            <h4 className="text-md font-semibold text-gray-800 mb-1">
                              {course.courseTitle}
                            </h4>
                            <p className="text-sm text-gray-600">{course.timing}</p>
                            <p className="text-xs text-gray-500 mt-1">{course.roomNumber} - {course.instructor}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleViewDetails(course); }}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                View Details &rarr;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-500 text-lg">
                    No timetable entries match your current filter selection for {mockParentData.children.find(c => c.id === selectedChildId)?.name}.
                  </p>
                </div>
              )}
            </>
          ) : selectedChildId && selectedChildTimetable.length === 0 ? (
             <div className="text-center py-10 bg-white p-4 rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                    {mockParentData.children.find(c => c.id === selectedChildId)?.name} currently has no timetable entries.
                </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="text-center py-10 bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No children found in the system.
          </p>
        </div>
      )}

      {/* Conditionally render the modal */}
      {isDetailModalOpen && (
        <CourseDetailModal 
          course={selectedCourseForDetail} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default TimeTableManagementForParent;
