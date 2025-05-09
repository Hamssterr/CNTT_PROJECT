import ConsultationScheduleModel from "../model/consultantSchedule.model.js";

export const getSchedules = async (req, res) => {
  try {
    const schedules = await ConsultationScheduleModel.find();
    res.json({
      success: true,
      schedules,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addSchedule = async (req, res) => {
  const { title, start, end, desc } = req.body;
  if (!title || !start || !end) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newSchedule = new ConsultationScheduleModel({
      title,
      start: new Date(start),
      end: new Date(end),
      desc,
    });
    await newSchedule.save();
    res.json({
      success: true,
      schedules: newSchedule,
      message: "Schedule added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { title, start, end, desc } = req.body;
  if (!title || !start || !end) {
    return res.status(400).json({
      success: false,
      message: "Title, start time and end time are required",
    });
  }
  try {
    const updatedSchedule = await ConsultationScheduleModel.findByIdAndUpdate(
      id,
      { title, start: new Date(start), end: new Date(end), desc },
      { new: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }
    res.json({
      success: true,
      schedules: updatedSchedule,
      message: "Schedule updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Schedule ID is required",
    });
  }
  try {
    const deletedSchedule = await ConsultationScheduleModel.findByIdAndDelete(
      id
    );
    if (!deletedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }
    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
