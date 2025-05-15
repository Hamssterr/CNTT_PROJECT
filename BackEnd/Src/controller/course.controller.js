import Course from "../model/course.model.js";
import User from "../model/user.model.js";
import RegisterCourse from "../model/registerCourse.model.js";
import Class from "../model/class.model.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      category,
      level,
      duration,
      price,
      currency,
      status,
      content,
      maxEnrollment,
      schedule,
      target,
    } = req.body;

    const thumbnailUrl = req.file?.path;

    const newCourse = new Course({
      title,
      description,
      instructor: instructor ? JSON.parse(instructor) : {},
      category,
      level,
      duration: duration ? JSON.parse(duration) : {},
      price: Number(price) || 0,
      currency,
      status,
      content: content ? JSON.parse(content) : [],
      schedule: schedule ? JSON.parse(schedule) : { daysOfWeek: [], shift: "" },
      target: target ? JSON.parse(target) : [],
      thumbnail: thumbnailUrl,
      maxEnrollment: Number(maxEnrollment) || 0,
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course created",
      success: true,
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating Course", error);
    res.status(400).json({
      message: "Failed to create Course",
      success: false,
    });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched all courses",
      courses,
    });
  } catch (error) {
    console.log("Error fetching courses", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const getAllCourseForPublicRoute = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Fetched all courses",
      courses,
    });
  } catch (error) {
    console.log("Error fetching courses", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id });

    res.status(200).json({
      message: "Get Course details",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in get Course", error.message);
    res.status(500).json({
      message: "False to get course",
      success: false,
    });
  }
};

export const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid course ID",
        success: false,
      });
    }

    const course = await Course.findByIdAndDelete({ _id: id });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Course deleted",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in delete Course", error.message);
    res.status(500).json({
      message: "False to delete course",
      success: false,
    });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    //  Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }

    const updateData = { ...req.body };

    //  Nếu có file thumbnail mới thì cập nhật
    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    updateData.updatedAt = new Date();

    //  parse JSON fields nếu cần
    if (updateData.instructor && typeof updateData.instructor === "string") {
      updateData.instructor = JSON.parse(updateData.instructor);
    }

    if (updateData.duration && typeof updateData.duration === "string") {
      updateData.duration = JSON.parse(updateData.duration);
    }

    if (updateData.content && typeof updateData.content === "string") {
      updateData.content = JSON.parse(updateData.content);
    }

    if (updateData.schedule && typeof updateData.schedule === "string") {
      updateData.schedule = JSON.parse(updateData.schedule);
    }

    if (updateData.target && typeof updateData.target === "string") {
      updateData.target = JSON.parse(updateData.target);
    }

    //  Tiến hành cập nhật
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course: updatedCourse });
  } catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const registerEnrollStudent = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const { id: courseId } = req.params;

    // Kiểm tra phoneNumber được cung cấp
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Tìm user bằng phoneNumber và kiểm tra role
    const user = await User.findOne({ phoneNumber, role: "student" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No student found with this phone number",
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

    // Kiểm tra trạng thái khóa học
    if (course.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Course is not active",
      });
    }

    // Kiểm tra xem học viên đã đăng ký khóa học chưa
    const alreadyEnrolled = course.enrolledUsers.some(
      (enrolled) => enrolled.userId.toString() === user._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }

    // Kiểm tra giới hạn maxEnrollment
    if (
      course.maxEnrollment &&
      course.enrolledUsers.length >= course.maxEnrollment
    ) {
      return res.status(400).json({
        success: false,
        message: "Course has reached maximum enrollment",
      });
    }

    // Kiểm tra xung đột lịch học
    const enrolledCourses = await Course.find({
      "enrolledUsers.userId": user._id.toString(),
    });
    const newCourseSchedule = course.schedule;
    if (
      newCourseSchedule &&
      newCourseSchedule.daysOfWeek &&
      newCourseSchedule.shift
    ) {
      for (const enrolledCourse of enrolledCourses) {
        const enrolledSchedule = enrolledCourse.schedule;
        if (
          enrolledSchedule &&
          enrolledSchedule.daysOfWeek &&
          enrolledSchedule.shift === newCourseSchedule.shift
        ) {
          const hasConflict = enrolledSchedule.daysOfWeek.some((day) =>
            newCourseSchedule.daysOfWeek.includes(day)
          );
          if (hasConflict) {
            return res.status(400).json({
              success: false,
              message: `Schedule conflict: User is already enrolled in a course with the same shift (${newCourseSchedule.shift}) on overlapping days`,
            });
          }
        }
      }
    }

    // Thêm học viên vào khóa học
    course.enrolledUsers.push({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enrolledDate: new Date(),
      progress: 0,
    });

    // Tìm lớp học liên kết (nếu có) và thêm học viên
    const classObj = await Class.findOne({ courseId: course._id });
    if (classObj) {
      // Kiểm tra xem học viên đã có trong lớp chưa
      const alreadyInClass = classObj.students.some(
        (student) => student.userId.toString() === user._id.toString()
      );
      if (alreadyInClass) {
        return res.status(400).json({
          success: false,
          message: "User already enrolled in the associated class",
        });
      }

      // Thêm học viên vào lớp học
      classObj.students.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        enrolledDate: new Date(),
        progress: 0,
      });

      await classObj.save();
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      course,
    });
  } catch (error) {
    console.error("Register enrolled student Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const changeCourseEnrollStudent = async (req, res) => {
  try {
    const { userId, newCourseId } = req.body;
    const { id: oldCourseId } = req.params;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !newCourseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and new course ID are required",
      });
    }

    // Tìm user bằng userId và kiểm tra role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No student found with this user ID",
      });
    }
    if (user.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "User is not a student",
      });
    }

    // Kiểm tra khóa học cũ tồn tại
    const oldCourse = await Course.findById(oldCourseId);
    if (!oldCourse) {
      return res.status(404).json({
        success: false,
        message: "Old course not found",
      });
    }

    // Kiểm tra khóa học mới tồn tại
    const newCourse = await Course.findById(newCourseId);
    if (!newCourse) {
      return res.status(404).json({
        success: false,
        message: "New course not found",
      });
    }

    // Kiểm tra trạng thái khóa học mới
    if (newCourse.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "New course is not active",
      });
    }

    // Kiểm tra xem học viên có trong khóa học cũ không
    const enrolledIndex = oldCourse.enrolledUsers.findIndex(
      (enrolled) => enrolled.userId === user._id.toString()
    );
    if (enrolledIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "User is not enrolled in the old course",
      });
    }

    // Kiểm tra xem học viên đã đăng ký khóa học mới chưa
    const alreadyEnrolled = newCourse.enrolledUsers.some(
      (enrolled) => enrolled.userId === user._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in the new course",
      });
    }

    // Kiểm tra giới hạn maxEnrollment của khóa học mới
    if (
      newCourse.maxEnrollment &&
      newCourse.enrolledUsers.length >= newCourse.maxEnrollment
    ) {
      return res.status(400).json({
        success: false,
        message: "New course has reached maximum enrollment",
      });
    }

    // Kiểm tra xung đột lịch học
    const enrolledCourses = await Course.find({
      "enrolledUsers.userId": user._id.toString(),
      _id: { $ne: oldCourseId }, // Loại trừ khóa học cũ
    });
    const newCourseSchedule = newCourse.schedule;
    if (
      newCourseSchedule &&
      newCourseSchedule.daysOfWeek &&
      newCourseSchedule.shift
    ) {
      for (const enrolledCourse of enrolledCourses) {
        const enrolledSchedule = enrolledCourse.schedule;
        if (
          enrolledSchedule &&
          enrolledSchedule.daysOfWeek &&
          enrolledSchedule.shift === newCourseSchedule.shift
        ) {
          const hasConflict = enrolledSchedule.daysOfWeek.some((day) =>
            newCourseSchedule.daysOfWeek.includes(day)
          );
          if (hasConflict) {
            return res.status(400).json({
              success: false,
              message: `Schedule conflict: User is already enrolled in a course with the same shift (${newCourseSchedule.shift}) on overlapping days`,
            });
          }
        }
      }
    }

    // Xóa học viên khỏi khóa học cũ
    oldCourse.enrolledUsers.splice(enrolledIndex, 1);

    // Đồng bộ với Class của khóa học cũ (nếu có)
    const oldClass = await Class.findOne({ courseId: oldCourse._id });
    if (oldClass) {
      const studentIndex = oldClass.students.findIndex(
        (student) => student.userId.toString() === user._id.toString()
      );
      if (studentIndex !== -1) {
        oldClass.students.splice(studentIndex, 1);
        await oldClass.save();
      }
    }

    // Thêm học viên vào khóa học mới
    newCourse.enrolledUsers.push({
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enrolledDate: new Date(),
      progress: 0,
    });

    // Đồng bộ với Class của khóa học mới (nếu có)
    const newClass = await Class.findOne({ courseId: newCourse._id });
    if (newClass) {
      newClass.students.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        enrolledDate: new Date(),
        progress: 0,
      });
      await newClass.save();
    }

    // Lưu thay đổi
    await oldCourse.save();
    await newCourse.save();

    return res.status(200).json({
      success: true,
      message: "Student course changed successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error changing course for enrolled student:", error);
    return res.status(500).json({
      success: false,
      message: "Error changing course for enrolled student. Try again.",
    });
  }
};

export const removeEnrollStudent = async (req, res) => {
  try {
    const { idCourse, userId } = req.params;

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(idCourse);
    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Kiểm tra học viên tồn tại
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Kiểm tra xem học viên có trong khóa học không
    const enrolledIndex = course.enrolledUsers.findIndex(
      (enrolled) => enrolled.userId === userId
    );
    if (enrolledIndex === -1) {
      res.status(400).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    // Xóa học viên khỏi khóa học
    course.enrolledUsers.splice(enrolledIndex, 1);

    // Đồng bộ với Class (nếu có)
    const classObj = await Class.findOne({ courseId: idCourse });
    if (classObj) {
      const studentIndex = classObj.students.findIndex(
        (student) => student.userId.toString() === userId
      );
      if (studentIndex !== -1) {
        classObj.students.splice(studentIndex, 1);
        await classObj.save();
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Student unenrolled successfully",
      course,
    });
  } catch (error) {
    console.error("Error remove enrolled student:", err);
    res.status(500).json({
      success: false,
      message: "Error remove enrolled student. Try again.",
    });
  }
};

export const registerCourse = async (req, res) => {
  const { courseId, name, email, phoneNumber } = req.body;

  try {
    const newRegistration = new RegisterCourse({
      courseId,
      name,
      email,
      phoneNumber,
    });
    await newRegistration.save();

    res
      .status(200)
      .json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Error registering:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Try again." });
  }
};

export const registrations = async (req, res) => {
  try {
    const registrations = await RegisterCourse.find()
      .populate("courseId", "title") // Lấy tên khóa học
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getRegistration = async (req, res) => {
  try {
    const registration = await RegisterCourse.findById(req.params.id).populate(
      "courseId"
    );

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    res.json({ success: true, data: registration });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
