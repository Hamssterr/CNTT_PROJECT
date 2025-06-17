import Course from "../model/course.model.js";
import Attendance from "../model/attendance.model.js";
import Notification from "../model/notification.model.js";
export const getMyCourses = async (req, res) => {
  try {
    const instructorId = req.user.userId; // ID giáo viên đang đăng nhập

    // Tìm các khóa học có instructor.id trùng với instructorId
    const courses = await Course.find({ "instructor.id": instructorId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses for instructor", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const saveAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceData } = req.body;

    // Kiểm tra nếu đã lưu điểm danh cho ngày hôm nay
    const existingAttendance = await Attendance.findOne({ classId, date });
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already saved for today.",
      });
    }

    // Lưu điểm danh mới
    const newAttendance = new Attendance({
      classId,
      date,
      attendanceData,
    });
    await newAttendance.save();

    res
      .status(200)
      .json({ success: true, message: "Attendance saved successfully." });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ middleware auth
    const notifications = await Notification.find({ userId }).sort({
      timestamp: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ middleware auth

    // Cập nhật tất cả notifications chưa đọc của user thành đã đọc
    const result = await Notification.updateMany(
      {
        userId: userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(), // Thêm timestamp khi đánh dấu đã đọc
      }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
