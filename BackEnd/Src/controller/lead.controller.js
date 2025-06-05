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
    isDiscount,
    discountEmail,
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
    let lead = await LeadUserModel.findOne({ $or: [{ email }, { phone }] });
    if (lead) {
      // Nếu đã có, cập nhật mảng course (không thêm trùng)
      const newCourses = Array.isArray(course) ? course : [course];
      const updatedCourses = Array.from(
        new Set([...(lead.course || []), ...newCourses])
      );
      // Nếu có thêm course mới thì reset status về "Pending"
      const isCourseUpdated =
        updatedCourses.length > (lead.course?.length || 0);
      lead.course = updatedCourses;
      if (isCourseUpdated) {
        lead.status = "Pending";
      }
      await lead.save();
      return res.status(200).json({
        success: true,
        message: "Lead updated with new course(s)",
        lead,
      });
    } else {
      // Nếu chưa có, tạo mới
      const newLead = new LeadUserModel({
        name,
        studentName,
        email,
        phone,
        course: Array.isArray(course) ? course : [course],
        registrationDate,
        status,
        paymentStatus,
        isDiscount,
        discountEmail,
      });
      await newLead.save();
      return res.status(201).json({
        success: true,
        message: "Lead created successfully",
        lead: newLead,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    isDiscount,
    discountEmail,
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
    const oldLead = await LeadUserModel.findById(id);
    if (!oldLead) {
      return res.json({ success: false, message: "Lead not found" });
    }

    // Convert course arrays to sets and compare
    const oldCourses = new Set(oldLead.course);
    const newCourses = new Set(Array.isArray(course) ? course : [course]);
    const hasCoursesChanged =
      oldCourses.size !== newCourses.size ||
      ![...oldCourses].every((course) => newCourses.has(course));

    const updatedLeadUser = await LeadUserModel.findByIdAndUpdate(
      id,
      {
        name,
        studentName,
        email,
        phone,
        course: Array.isArray(course) ? course : [course],
        registrationDate,
        // Nếu courses thay đổi, set status về Pending
        status: hasCoursesChanged ? "Pending" : status,
        paymentStatus,
        isDiscount,
        discountEmail,
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
