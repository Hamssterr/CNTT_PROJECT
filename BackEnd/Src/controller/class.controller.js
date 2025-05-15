import User from "../model/user.model.js";
import Class from "../model/class.model.js";
import Course from "../model/course.model.js";
import mongoose from "mongoose";

export const getClasses = async (req, res) => {
  const classes = await Class.find({})
    .populate("courseId", "title")
    .populate("students.userId", "name email");
  res.json({ success: true, classes });
};

export const createClass = async (req, res) => {
  try {
    const { className, room, courseId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!className || !room || !courseId) {
      res.status(400).json({
        success: false,
        message: "Class name, room, and course ID are required",
      });
    }

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
    }

    // Kiểm tra schedule của khóa học
    if (
      !course.schedule ||
      !course.schedule.daysOfWeek ||
      !course.schedule.shift
    ) {
      res
        .status(400)
        .json({ success: false, message: "Course schedule is incomplete" });
    }

    // Kiểm tra lớp học đã tồn tại cho khóa học này
    const existingClass = await Class.findOne({ courseId });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "A class with this course already exists",
      });
    }

    // Tạo class mới chứa:....
    const classObj = new Class({
      className,
      room,
      courseId,
      schedule: {
        daysOfWeek: course.schedule.daysOfWeek,
        shift: course.schedule.shift,
      },
      students: course.enrolledUsers.map((enrolled) => ({
        userId: enrolled.userId, // String sẽ được Mongoose chuyển thành ObjectId
        firstName: enrolled.firstName,
        lastName: enrolled.lastName,
        email: enrolled.email,
        enrolledDate: enrolled.enrolledDate,
        progress: enrolled.progress,
      })),
    });

    const createdClass = await classObj.save();
    res.status(201).json({ success: true, class: createdClass });
  } catch (error) {
    console.error("Error create class", error);
    res.status(400).json({
      success: false,
      message: "Failed to create class",
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { className, room, courseId } = req.body;
    const { id: classId } = req.params;

    // Tìm lớp học
    const classObj = await Class.findById(classId);
    if (!classObj) {
      res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Kiểm tra khóa học nếu courseId được cung cấp
    if (courseId && courseId !== classObj.courseId.toString()) {
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Kiểm tra schedule của khóa học
      if (
        !course.schedule ||
        !course.schedule.daysOfWeek ||
        !course.schedule.shift
      ) {
        res.status(400).json({
          success: false,
          message: "Course schedule is incomplete",
        });
      }

      // Kiểm tra xem courseId đã được sử dụng trong lớp học khác chưa
      const existingClass = await Class.findOne({
        courseId,
        _id: { $ne: classId },
      });
      if (existingClass) {
        res.status(400).json({
          success: false,
          message: "This course is already associated with another class",
        });
      }

      // Cập nhật courseId và schedule
      classObj.courseId = courseId;
      classObj.schedule = {
        daysOfWeek: course.schedule.daysOfWeek,
        shift: course.schedule.shift,
      };

      // Đồng bộ students với enrolledUsers của course mới
      classObj.students = course.enrolledUsers.map((enrolled) => ({
        userId: enrolled.userId, // Chuyển String thành ObjectId tự động bởi Mongoose
        email: enrolled.email,
         firstName: enrolled.firstName,
        lastName: enrolled.lastName,
        enrolledDate: enrolled.enrolledDate,
        progress: enrolled.progress,
      }));
    }

    // Cập nhật các trường khác nếu được cung cấp
    if (className) classObj.className = className;
    if (room) classObj.room = room;

    const updatedClass = await classObj.save();
    res.json({ success: true, class: updatedClass });
  } catch (error) {
    console.error("Error updated class", error);

    res.status(400).json({
      success: false,
      message: "Failed to updated class",
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    await classObj.remove();
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleted class", error);

    res.status(400).json({
      success: false,
      message: "Failed to deleted class",
    });
  }
};
