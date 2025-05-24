import React, { useContext, useEffect, useMemo, useState } from "react";

import Loading from "../../Loading";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const TimeTableManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");

  const fetchClassData = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response = await axios.get(
        `${backendUrl}/api/student/getClassByIdStudent`
      );
      const { data } = response;
      if (data.success && Array.isArray(data.classes)) {
        setClassData(data.classes);
      } else {
        setClassData([]);
        toast.error(data.message || "No timetable found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load timetable data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [backendUrl]);

  // Hàm tìm ngày học tiếp theo dựa trên ngày hiện tại
  const getNextClassDay = (startDate, endDate, daysOfWeek, currentDate) => {
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

    // Kiểm tra ngày hợp lệ
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(today.getTime())) {
      return "N/A";
    }

    // Kiểm tra nếu hôm nay nằm ngoài khoảng thời gian khóa học
    if (today < start || today > end) {
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

    const todayDay = today.getDay();
    let minDiff = 7; // Khoảng cách nhỏ nhất đến ngày học tiếp theo
    let nextDay = null;

    // Tìm ngày học tiếp theo gần nhất
    for (const day of daysOfWeek) {
      const targetDay = daysMap[day];
      if (targetDay === undefined) continue; // Bỏ qua ngày không hợp lệ
      const diff = (targetDay - todayDay + 7) % 7 || 7; // Đảm bảo diff không bằng 0
      if (diff < minDiff) {
        minDiff = diff;
        nextDay = day;
      }
    }

    if (!nextDay) return "N/A";

    // Tính ngày cụ thể của ngày học tiếp theo
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + minDiff);

    // Kiểm tra nếu ngày tiếp theo vượt quá endDate
    if (nextDate > end) {
      return "N/A";
    }

    return nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const timetable = useMemo(() => {
    const currentDate = new Date(); // Lấy ngày hiện tại
    return classData.map((classItem, index) => ({
      id: classItem._id || index,
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
    }));
  }, [classData]);

  const filteredTimetable = useMemo(() => {
    return timetable.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;
      const matchesDay =
        selectedDay === "all" || course.nextClassDay.includes(selectedDay);

      return matchesCategory && matchesLevel && matchesDay;
    });
  }, [timetable, selectedCategory, selectedLevel, selectedDay]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Categories</option>
          <option value="Theory">Theory</option>
          <option value="Practical">Practical</option>
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 rounded-lg border"
        >
          <option value="all">All Days</option>
          {timetable
            .map((course) => course.nextClassDay)
            .filter((value, index, self) => value !== "N/A" && self.indexOf(value) === index)
            .map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTimetable.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>No classes found for the selected filters.</p>
          </div>
        ) : (
          filteredTimetable.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">
                {course.courseTitle}
              </h3>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Class Day</p>
                <p>{course.nextClassDay}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p>{course.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                <p>{course.level}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimeTableManagement;
