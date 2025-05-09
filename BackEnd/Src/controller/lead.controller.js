import LeadUserModel from "../model/lead.model.js";

export const getLeadUsers = async (req, res) => {
  try {
    const leadUsers = await LeadUserModel.find();
    res.json({
      success: true,
      leadUsers,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewLeadUser = async (req, res) => {
  const {
    name,
    studentName,
    email,
    phone,
    course,
    registrationDate,
    status,
    paymentStatus,
  } = req.body;
  if (
    !name ||
    !studentName ||
    !email ||
    !phone ||
    !status ||
    !course ||
    !registrationDate ||
    !paymentStatus
  ) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newLeadUser = new LeadUserModel({
      name,
      studentName,
      email,
      phone,
      course,
      registrationDate,
      status,
      paymentStatus,
    });
    await newLeadUser.save();
    res.json({
      success: true,
      message: "Lead User added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeadUser = async (req, res) => {
  const {
    name,
    studentName,
    email,
    phone,
    course,
    registrationDate,
    status,
    paymentStatus,
  } = req.body;
  const { id } = req.params;
  if (
    !id ||
    !name ||
    !studentName ||
    !email ||
    !phone ||
    !status ||
    !course ||
    !registrationDate ||
    !paymentStatus
  ) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const updatedLeadUser = await LeadUserModel.findByIdAndUpdate(
      id,
      {
        name,
        studentName,
        email,
        phone,
        course,
        registrationDate,
        status,
        paymentStatus,
      },
      { new: true }
    );
    res.json({
      success: true,
      message: "Lead User updated successfully",
      leadUser: updatedLeadUser,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeadUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({
      success: false,
      message: "Lead User ID is required",
    });
  }
  try {
    await LeadUserModel.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Lead User deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
