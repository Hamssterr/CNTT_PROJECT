import Course from "../model/course.model.js";
import Attendance from "../model/attendance.model.js";
export const getMyCourses = async (req, res) => {
  try {
    const instructorId = req.user.userId; // ID giáo viên đang đăng nhập

    // Tìm các khóa học có instructor.id trùng với instructorId
    const courses = await Course.find({ "instructor.id": instructorId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses for instructor", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const saveAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceData } = req.body;

    // Kiểm tra nếu đã lưu điểm danh cho ngày hôm nay
    const existingAttendance = await Attendance.findOne({ classId, date });
    if (existingAttendance) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Attendance already saved for today.",
        });
    }

    // Lưu điểm danh mới
    const newAttendance = new Attendance({
      classId,
      date,
      attendanceData,
    });
    await newAttendance.save();

    res
      .status(200)
      .json({ success: true, message: "Attendance saved successfully." });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


