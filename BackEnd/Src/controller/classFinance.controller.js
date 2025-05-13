import ClassModel from "../model/classFinance.model.js";
export const getClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json({
      success: true,
      classes,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewClass = async (req, res) => {
  const {
    className,
    teacher,
    students,
    startDate,
    classTime,
    startTime,
    endTime,
  } = req.body;
  if (
    !className ||
    !teacher ||
    !students ||
    !startDate ||
    !classTime ||
    !startTime ||
    !endTime
  ) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const existingClass = await ClassModel.findOne({ className });
    if (existingClass) {
      return res.json({
        success: false,
        message: "Class already exists",
      });
    }
    const newClass = new ClassModel({
      className,
      teacher,
      students,
      startDate,
      classTime,
      startTime,
      endTime,
    });
    await newClass.save();
    res.json({
      success: true,
      message: "Class added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({
      success: false,
      message: "Class ID is required",
    });
  }
  try {
    const deletedClass = await ClassModel.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.json({
        success: false,
        message: "Class not found",
      });
    }
    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateClass = async (req, res) => {
  const { id } = req.params;
  const {
    className,
    teacher,
    students,
    startDate,
    classTime,
    startTime,
    endTime,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      message: "Class ID is required",
    });
  }

  try {
    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      {
        className,
        teacher,
        students,
        startDate,
        classTime,
        startTime,
        endTime,
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      message: "Class updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const checkTeacherAvailability = async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;

    // Tìm các lớp có giáo viên trùng khung giờ
    const conflictingClasses = await Class.find({
      classTime: { $in: days }, // Trùng ngày
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, // Trùng giờ bắt đầu
        { endTime: { $gt: startTime, $lte: endTime } }, // Trùng giờ kết thúc
      ],
    });

    // Lấy danh sách giáo viên đang bận
    const busyTeachers = conflictingClasses.map((cls) => cls.teacher);

    // Trả về danh sách giáo viên trống
    const availableTeachers = await Teacher.find({
      _id: { $nin: busyTeachers },
    });

    res.status(200).json({
      success: true,
      teachers: availableTeachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check teacher availability.",
      error: error.message,
    });
  }
};