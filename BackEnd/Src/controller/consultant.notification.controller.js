import NotificationModel from "../model/notification.consultant.model.js";

export const createNotification = async (req, res) => {
  try {
    const notification = new NotificationModel(req.body);
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      recipientRole: "consultant",
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { recipientRole: "consultant", read: false },
      { read: true }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};