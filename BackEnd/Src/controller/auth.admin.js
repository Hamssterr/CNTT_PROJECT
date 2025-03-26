import User from "../model/user.model.js";

export const getDataAdmin = async (req, res) => {
  try {
    // Get userId from req.user (do middleware gán)
    const userId = req.user.userId;

    // Check role of users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only students can access this data",
      });
    }

    // Find the database to get information
    const studentData = await User.findById(userId).select('-password'); // Exception password

    // Check student have exist
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Return json data 
    res.status(200).json({
      success: true,
      message: "Welcome to the admin dashboard",
      data: studentData, 
    });
  } catch (error) {
    console.error("Error in getDataAdmin:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};