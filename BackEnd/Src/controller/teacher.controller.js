import Course from "../model/course.model.js";

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


