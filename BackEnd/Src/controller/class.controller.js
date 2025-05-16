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

export const getClassesById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra classId hợp lệ
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    // Tìm lớp học theo ID và populate courseId, students.userId
    const classDoc = await Class.findById(id)
      .populate("courseId", "title")
      .populate("students.userId", "name email");

    // Kiểm tra lớp học tồn tại
    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Trả về lớp học
    res.status(200).json({
      success: true,
      class: classDoc,
    });
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch class",
    });
  }
};

export const createClass = async (req, res) => {
  try {
    const { className, room, courseId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!className || !room || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Class name, room, and course ID are required",
      });
    }

    // Validate courseId
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
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
      return res.status(400).json({
        success: false,
        message: "Course schedule is incomplete",
      });
    }

    // Kiểm tra lớp học đã tồn tại cho khóa học này
    const existingClass = await Class.findOne({ courseId });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "A class with this course already exists",
      });
    }

    // Tạo class mới
    const classObj = new Class({
      className,
      room,
      courseId,
      schedule: {
        daysOfWeek: course.schedule.daysOfWeek,
        shift: course.schedule.shift,
      },
      students: course.enrolledUsers.map((enrolled) => ({
        userId: enrolled.userId,
        firstName: enrolled.firstName,
        lastName: enrolled.lastName,
        email: enrolled.email,
        enrolledDate: enrolled.enrolledDate,
        progress: enrolled.progress,
      })),
    });

    const createdClass = await classObj.save();
    // Populate courseId for response
    await createdClass.populate("courseId", "title");
    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: createdClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({
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
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Kiểm tra khóa học nếu courseId được cung cấp
    if (courseId && courseId !== classObj.courseId.toString()) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
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
        return res.status(400).json({
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
        return res.status(400).json({
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
        userId: enrolled.userId,
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
    return res.status(200).json({ success: true, class: updatedClass });
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update class",
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate class ID
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    // Find class
    const classObj = await Class.findById(id);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Delete class
    await classObj.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete class",
    });
  }
};
