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