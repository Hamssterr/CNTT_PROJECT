import teacherModel from "../model/teacherFinance.model.js";
export const getTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find();
    res.json({
      success: true,
      teachers,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewTeacher = async (req, res) => {
  const { name, email, phone, specialization, experience } = req.body;
  if (!name || !email || !phone || !specialization || !experience) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.json({
        success: false,
        message: "Teacher already exists",
      });
    }
    const newTeacher = new teacherModel({
      name,
      email,
      phone,
      specialization,
      experience,
    });
    await newTeacher.save();
    res.json({
      success: true,
      message: "Teacher added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTeacher = async (req, res) => {
  const { name, email, phone, specialization, experience } = req.body;
  const { id } = req.params;
  if (!name || !email || !phone || !specialization || !experience) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const updatedTeacher = await teacherModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        specialization,
        experience,
      },
      { new: true }
    );
    res.json({
      success: true,
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};