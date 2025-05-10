import Course from "../model/course.model.js";
import RegisterCourse from "../model/registerCourse.model.js";
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
      price: Number(price),
      currency,
      status,
      content: content ? JSON.parse(content) : [],
      schedule: schedule ? JSON.parse(schedule) : { daysOfWeek: [], shift: "" },
      target: target ? JSON.parse(target) : [],
      thumbnail: thumbnailUrl,
      maxEnrollment: Number(maxEnrollment),
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
    const courses = await Course.find().sort({createdAt: -1});

    res.status(200).json({
      success: true,
      message: "Fetched all courses",
      courses
    })
  } catch (error) {
    console.log("Error fetching courses", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses"
    })    
  }
}

export const getAllCourseForPublicRoute = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Active" }).sort({createdAt: -1});

    res.status(200).json({
      success: true,
      message: "Fetched all courses",
      courses
    })
  } catch (error) {
    console.log("Error fetching courses", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses"
    })    
  }
}

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
      return res.status(400).json({ success: false, message: "Invalid course ID" });
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
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course: updatedCourse });
  } catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const registerCourse = async (req, res) => {
  const { courseId, name, email, phoneNumber } = req.body;

  try {
    const newRegistration = new RegisterCourse({ courseId, name, email, phoneNumber });
    await newRegistration.save();

    res.status(200).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Error registering:", err);
    res.status(500).json({ success: false, message: "Server error. Try again." });
  }
}

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
}

export const getRegistration = async (req, res) => {
  try {
    const registration = await RegisterCourse.findById(req.params.id).populate("courseId");

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    res.json({ success: true, data: registration });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}