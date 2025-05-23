import User from "../model/user.model.js";
import Class from "../model/class.model.js";
import Course from "../model/course.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const uploadMaterial = async (req, res) => {
  try {
    const { classId } = req.params;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Upload file lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `class_materials/${classId}`,
    });

    // Tìm lớp học và thêm tài liệu vào danh sách
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    const newMaterial = {
      name: file.originalname,
      url: result.secure_url,
      uploadedAt: new Date(),
    };

    classObj.materials.push(newMaterial);
    await classObj.save();

    res.status(200).json({
      success: true,
      message: "Material uploaded successfully",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Error uploading material:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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

    // Kiểm tra thông tin instructor
    if (
      !course.instructor ||
      !course.instructor.id ||
      !course.instructor.name
    ) {
      return res.status(400).json({
        success: false,
        message: "Course instructor information is incomplete",
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
      instructor: {
        id: course.instructor.id,
        name: course.instructor.name,
      },
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
    await createdClass.populate("courseId", "title instructor");
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

    // Kiểm tra khóa học nếu courseId được cung cấp hoặc lấy khóa học hiện tại
    let course;
    if (courseId && courseId !== classObj.courseId.toString()) {
      // Validate courseId
      if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      course = await Course.findById(courseId);
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

      // Kiểm tra thông tin instructor
      if (
        !course.instructor ||
        !course.instructor.id ||
        !course.instructor.name
      ) {
        return res.status(400).json({
          success: false,
          message: "Course instructor information is incomplete",
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

      // Cập nhật courseId, schedule, instructor, và students
      classObj.courseId = courseId;
      classObj.schedule = {
        daysOfWeek: course.schedule.daysOfWeek,
        shift: course.schedule.shift,
      };
      classObj.instructor = {
        id: course.instructor.id,
        name: course.instructor.name,
      };
      classObj.students = course.enrolledUsers.map((enrolled) => ({
        userId: enrolled.userId,
        email: enrolled.email,
        firstName: enrolled.firstName,
        lastName: enrolled.lastName,
        enrolledDate: enrolled.enrolledDate,
        progress: enrolled.progress,
      }));
    } else {
      // Nếu không thay đổi courseId, kiểm tra và cập nhật instructor từ khóa học hiện tại
      course = await Course.findById(classObj.courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Current course not found",
        });
      }
      if (
        !course.instructor ||
        !course.instructor.id ||
        !course.instructor.name
      ) {
        return res.status(400).json({
          success: false,
          message: "Current course instructor information is incomplete",
        });
      }
      classObj.instructor = {
        id: course.instructor.id,
        name: course.instructor.name,
      };
    }

    // Cập nhật các trường khác nếu được cung cấp
    if (className) classObj.className = className;
    if (room) classObj.room = room;

    const updatedClass = await classObj.save();
    // Populate courseId for response
    await updatedClass.populate("courseId", "title");
    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
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

// API: Lấy danh sách lớp học của giảng viên đăng nhập
export const getClassesByInstructor = async (req, res) => {
  try {
    const instructorId = req.user?.userId;

    // Kiểm tra xem instructorId có tồn tại không
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Instructor ID not found",
      });
    }

    // Kiểm tra xem instructorId có hợp lệ không
    if (!mongoose.isValidObjectId(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    // Tìm tất cả các lớp học mà instructor.id khớp với userId
    const classes = await Class.find({ "instructor.id": instructorId })
      .populate("courseId", "title")
      .lean();

    // Kiểm tra xem có lớp học nào không
    if (!classes || classes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No classes found for this instructor",
        classes: [],
      });
    }

    // Trả về danh sách lớp học
    return res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      classes,
    });
  } catch (error) {
    console.error("Error retrieving classes by instructor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
    });
  }
};

// API: Lấy danh sách lớp học của học sinh đăng nhập
export const getClassByIdStudent = async (req, res) => {
  try {
    const studentId = req.user?.userId;

    // Kiểm tra xem studentId có tồn tại không
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Student ID not found",
      });
    }

    // Kiểm tra xem studentId có hợp lệ không
    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    // Tìm tất cả các lớp học mà student.id khớp với userId
    const classes = await Class.find({ "students.userId": studentId })
      .populate("courseId", "title")
      .lean();

    // Kiểm tra xem có lớp học nào không
    if (!classes || classes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No classes found for this student",
        classes: [],
      });
    }

    // Trả về danh sách lớp học
    return res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      classes,
    });
  } catch (error) {
    console.error("Error retrieving classes by instructor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
    });
  }
};

export const getClassWithHaveChildren = async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" }).select("children");

    // Lấy danh sách tất cả children của parents
    const studentId = parents
      .flatMap((parent) => parent.children.map((child) => child.id.toString()))
      .filter((id) => id);

    // Tìm tất cả classes có chứa children trong mảng students
    const classes = await Class.find({ "students.userId": studentId })
      .populate("courseId", "title")
      .lean();

    // Kiểm tra lớp học có tồn tại children không
    if (classes.length === 0) {
      return res.status(404).json({
        message: "No classes found with students who are children of parent.",
      });
    }

    // Lọc kết quả chỉ chứa childrenId có trong thông tin parent thôi
    const filterClasses = classes.map((classItem) => {
      const filterStudents = classItem.students.filter((student) => {
        const userId = student.userId.toString();
        return studentId.includes(userId);
      });
      return {
        ...classItem,
        students: filterStudents,
      };
    });

    // Trả kết quả
    res.status(200).json({
      message: "List of classes with students who are children of parent",
      data: filterClasses,
    });
  } catch (error) {
    console.error(
      "Error Error retrieving classes by parent with have childrenId:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
    });
  }
};
