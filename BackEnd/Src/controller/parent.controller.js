import User from "../model/user.model.js";

export const getDataParent = async (req, res) => {
  try {
    // Get userId from req.user (do middleware gán)
    const userId = req.user.userId;

    // Check role of users
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only parents can access this data",
      });
    }

    // Find the database to get information
    const parentData = await User.findById(userId).select('-password'); // Exception password

    // Check parent have exist
    if (!parentData) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    // Return json data 
    res.status(200).json({
      success: true,
      message: "Welcome to the parent dashboard",
      data: parentData, 
    });
  } catch (error) {
    console.error("Error in getDataParent:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};