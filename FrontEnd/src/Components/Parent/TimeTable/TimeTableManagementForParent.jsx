import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import CourseDetailModal from "./CourseDetailModal";

const TimeTableManagementForParent = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDayFilter, setSelectedDayFilter] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState(null);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/parent/getClassWithHaveChildren`
      );
      const { data } = response;

      if (Array.isArray(data.data)) {
        // Deduplicate classes by _id
        const classMap = new Map();
        data.data.forEach((classItem) => {
          if (classMap.has(classItem._id)) {
            const existing = classMap.get(classItem._id);
            existing.students = [
              ...existing.students,
              ...classItem.students.filter(
                (newStudent) =>
                  !existing.students.some(
                    (existingStudent) =>
                      existingStudent.userId === newStudent.userId
                  )
              ),
            ];
          } else {
            classMap.set(classItem._id, { ...classItem });
          }
        });

        const uniqueClasses = Array.from(classMap.values());
        setClassData(uniqueClasses);

        // Check for duplicate class IDs
        const classIds = uniqueClasses.map((classItem) => classItem._id);
        const uniqueClassIds = new Set(classIds);
        if (uniqueClassIds.size !== classIds.length) {
          console.warn("Duplicate class IDs detected:", classIds);
        }

        // Create uniqueChildren
        const uniqueChildren = Array.from(
          new Set(
            uniqueClasses.flatMap((classItem) =>
              classItem.students.map((student, index) => {
                const userId =
                  student.userId || `fallback-${classItem._id}-${index}`;
                return JSON.stringify({
                  id: userId,
                  name: `${student.firstName || "Unknown"} ${
                    student.lastName || "Student"
                  }`.trim(),
                });
              })
            )
          ),
          (str) => JSON.parse(str)
        );

        setChildren(uniqueChildren);
        if (uniqueChildren.length > 0) {
          setSelectedChildId(uniqueChildren[0].id);
        } else {
          setSelectedChildId("");
        }
      } else {
        setClassData([]);
        setChildren([]);
        toast.error(data.message || "No timetable found");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load timetable data";
      toast.error(errorMessage);
      setClassData([]);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

  const getNextClassDay = (startDate, endDate, daysOfWeek, currentDate) => {
    // Validate inputs
    if (
      !startDate ||
      !endDate ||
      !daysOfWeek ||
      !Array.isArray(daysOfWeek) ||
      !currentDate
    ) {
      return "N/A";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date(currentDate);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isNaN(today.getTime())
    ) {
      return "N/A";
    }

    const daysMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };

    // For upcoming courses, find the first class day after startDate
    let referenceDate = today < start ? start : today;

    const referenceDay = referenceDate.getDay();
    const referenceDayName = Object.keys(daysMap).find(
      (key) => daysMap[key] === referenceDay
    );

    // Check if reference date is a class day
    if (daysOfWeek.includes(referenceDayName)) {
      // Return reference date with appropriate label
      const label =
        referenceDate.getTime() === today.getTime()
          ? "Current Day"
          : "Next Day";
      return `${referenceDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} (${label})`;
    }

    // Find the next class day
    let minDiff = 7;
    let nextDay = null;

    for (const day of daysOfWeek) {
      const targetDay = daysMap[day];
      if (targetDay === undefined) continue;
      const diff = (targetDay - referenceDay + 7) % 7 || 7;
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }

    if (!nextDay) return "N/A";

    const nextDate = new Date(referenceDate);
    nextDate.setDate(referenceDate.getDate() + minDiff);

    if (nextDate > end) {
      return "N/A";
    }

    // Return next date with "Next Day" label
    return `${nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} (Next Day)`;
  };

  const timetable = useMemo(() => {
    const currentDate = new Date();
    const timetableData = classData.map((classItem) => {
      const course = {
        id: classItem._id,
        courseTitle: classItem.courseId?.title || "Unknown Course",
        roomNumber: classItem.room || "N/A",
        instructor: classItem.instructor?.name || "Unknown Instructor",
        timing: classItem.schedule?.shift || "N/A",
        nextClassDay: getNextClassDay(
          classItem.courseId?.duration?.startDate,
          classItem.courseId?.duration?.endDate,
          classItem.schedule?.daysOfWeek,
          currentDate
        ),
        category: classItem.courseId?.category || "Unknown",
        level: classItem.courseId?.level || "Unknown",
        startDate: classItem.courseId?.duration?.startDate,
        endDate: classItem.courseId?.duration?.endDate,
        studentIds: classItem.students.map(
          (student) =>
            student.userId || `fallback-${classItem._id}-${student._id}`
        ),
      };
      return course;
    });

    return timetableData;
  }, [classData]);

  const selectedChildTimetable = useMemo(() => {
    if (!selectedChildId) return [];
    const filtered = timetable.filter((course) =>
      course.studentIds.includes(selectedChildId)
    );
    return filtered;
  }, [timetable, selectedChildId]);

  const filteredTimetable = useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
    return selectedChildTimetable.filter((course) => {
      const startDate = course.startDate ? new Date(course.startDate) : null;
      const endDate = course.endDate ? new Date(course.endDate) : null;
      const isValidDate =
        startDate &&
        endDate &&
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime());

      let statusMatch = true;
      if (selectedDayFilter === "upcoming" && isValidDate) {
        startDate.setHours(0, 0, 0, 0);
        statusMatch = startDate > currentDate;
      } else if (selectedDayFilter === "ongoing" && isValidDate) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        statusMatch = startDate <= currentDate && currentDate <= endDate;
      }

      const matches =
        (selectedCategory === "all" || course.category === selectedCategory) &&
        (selectedLevel === "all" || course.level === selectedLevel) &&
        statusMatch;

      return matches;
    });
  }, [
    selectedChildTimetable,
    selectedCategory,
    selectedLevel,
    selectedDayFilter,
  ]);

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const groupedTimetableByDay = useMemo(() => {
    const grouped = filteredTimetable.reduce((acc, course) => {
      // Use "Upcoming" for courses with nextClassDay = "N/A" and upcoming status
      let day;
      if (course.nextClassDay === "N/A" && selectedDayFilter === "upcoming") {
        day = "Upcoming";
      } else {
        day = course.nextClassDay
          .split(",")[0]
          .replace(/\s*\((Current|Next)\s*Day\)$/, "");
      }

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(course);
      acc[day].sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.timing.split(" - ")[0]}`);
        const timeB = new Date(`1970/01/01 ${b.timing.split(" - ")[0]}`);
        return timeA - timeB;
      });
      return acc;
    }, {});

    const sortedGrouped = {};
    // Prioritize "Upcoming" group if present
    if (grouped["Upcoming"]) {
      sortedGrouped["Upcoming"] = grouped["Upcoming"];
    }
    dayOrder.forEach((day) => {
      if (grouped[day]) {
        sortedGrouped[day] = grouped[day];
      }
    });
    return sortedGrouped;
  }, [filteredTimetable, selectedDayFilter]);

  const handleChildChange = (e) => {
    setSelectedChildId(e.target.value);
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedDayFilter("all");
  };

  const handleViewDetails = (course) => {
    setSelectedCourseForDetail(course);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourseForDetail(null);
  };

  const availableCategories = useMemo(() => {
    const categories = new Set(
      selectedChildTimetable.map((course) => course.category)
    );
    const categoryList = ["all", ...Array.from(categories).sort()];
    return categoryList;
  }, [selectedChildTimetable]);

  const availableLevels = useMemo(() => {
    const levels = new Set(
      selectedChildTimetable.map((course) => course.level)
    );
    const levelList = ["all", ...Array.from(levels).sort()];
    return levelList;
  }, [selectedChildTimetable]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Children's Timetable
      </h2>

      {children.length > 0 ? (
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
              {children.map((child) => (
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
                  <label
                    htmlFor="categoryFilter"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    disabled={availableCategories.length <= 1}
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="levelFilter"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Level
                  </label>
                  <select
                    id="levelFilter"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    disabled={availableLevels.length <= 1}
                  >
                    {availableLevels.map((level) => (
                      <option key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="statusFilter"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Course Status
                  </label>
                  <select
                    id="statusFilter"
                    value={selectedDayFilter}
                    onChange={(e) => setSelectedDayFilter(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="all">All Courses</option>
                    <option value="upcoming">Upcoming Courses</option>
                    <option value="ongoing">Ongoing Courses</option>
                  </select>
                </div>
              </div>

              {Object.keys(groupedTimetableByDay).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedTimetableByDay).map(
                    ([day, courses]) => (
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
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleViewDetails(course)
                              }
                            >
                              <h4 className="text-md font-semibold text-gray-800 mb-1">
                                {course.courseTitle}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {course.timing}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {course.roomNumber} - {course.instructor}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Date: {course.nextClassDay}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(course);
                                }}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-500 text-lg">
                    {selectedDayFilter === "upcoming"
                      ? "No upcoming courses available for "
                      : selectedDayFilter === "ongoing"
                      ? "No ongoing courses available for "
                      : "No timetable entries match your current filter selection for "}
                    {children.find((c) => c.id === selectedChildId)?.name}.
                  </p>
                </div>
              )}
            </>
          ) : selectedChildId && selectedChildTimetable.length === 0 ? (
            <div className="text-center py-10 bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                {children.find((c) => c.id === selectedChildId)?.name} currently
                has no timetable entries.
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
