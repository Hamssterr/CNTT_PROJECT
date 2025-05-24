import User from "../model/user.model.js";

export const getDataParent = async (req, res) => {
  try {
    // Get userId from req.user (do middleware gán)
    const userId = req.user.userId;

    // Check role of users
    if (req.user.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only parents can access this data",
      });
    }

    // Find the database to get information
    const parentData = await User.findById(userId).select("-password"); // Exception password

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

export const getDataChildrenForParent = async (req, res) => {
 try {
    // Lấy ID của parent từ req.user (do middleware verifyParent cung cấp)
    const parentId = req.user.userId;

    // Tìm document của parent trong collection User
    const parent = await User.findById(parentId).select("children");

    // Kiểm tra xem parent có tồn tại không
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    // Lấy danh sách children từ document của parent
    const children = parent.children || [];

    // Trả về danh sách children
    res.status(200).json({
      success: true,
      message: "Children data retrieved successfully",
      data: children.map((child) => ({
        id: child.id,
        firstName: child.firstName,
        lastName: child.lastName,
      })),
    });
  } catch (error) {
    console.error("Error in getDataChildrenForParent:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving children data",
      error: error.message,
    });
  }
};
