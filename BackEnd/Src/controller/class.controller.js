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
    const { className, room, courseId, schedule } = req.body;

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const existingClass = await Class.findOne({ courseId });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "A class with this course already exists",
      });
    }

    const classObj = new Class({
      className,
      room,
      courseId,
      schedule,
      students: [],
    });

    const createdClass = await classObj.save();
    res.status(201).json({ success: true, class: createdClass });
  } catch (error) {
    console.error("Error create class", error);
    res.status(400).json({
      message: "Failed to create class",
      success: false,
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { className, room, courseId, schedule } = req.body;

    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      res.status(404);
      throw new Error("Class not found");
    }

    // Kiểm tra khóa học nếu courseId được cung cấp
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({
          message: "Course not found",
          success: false
        });
        
      }

      // Kiểm tra xem courseId đã được sử dụng trong lớp học khác chưa
      if (courseId !== classObj.courseId.toString()) {
        const existingClass = await Class.findOne({ courseId });
        if (existingClass) {
          res.status(400).json({
            success: false,
            message: "This course is already associated with another class",
          });
        }
      }
    }

    // Cập nhật chỉ các trường được cung cấp
    classObj.className = className || classObj.className;
    classObj.room = room || classObj.room;
    classObj.courseId = courseId || classObj.courseId;
    classObj.schedule = schedule || classObj.schedule;

    const updatedClass = await classObj.save();
    res.json({ success: true, class: updatedClass });
  } catch (error) {
    console.error("Error update class", error);

    res.status(400).json({
      message: "Failed to update class",
      success: false,
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      res.status(404);
      throw new Error("Class not found");
    }

    await classObj.remove();
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleted class", error);

    res.status(400).json({
      message: "Failed to deleted class",
      success: false,
    });
  }
};
