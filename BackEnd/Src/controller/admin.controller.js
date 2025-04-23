import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";

export const getDataAdmin = async (req, res) => {
  try {
    // Get userId from req.user (do middleware gán)
    const userId = req.user.userId;

    // Check role of users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only students can access this data",
      });
    }

    // Find the database to get information
    const studentData = await User.findById(userId).select("-password"); // Exception password

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

export const getDataUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "All users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users: ", error.message);
    res.status(500).json({
      message: "Failed to fetch users data",
      success: false,
    });
  }
};

export const createNewUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character" });
    }

    // all email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check exist email
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check role
    const validRoles = [
      "parent",
      "student",
      "teacher",
      "consultant",
      "admin",
      "finance",
    ];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, role, password } = req.body;

  try {
    // Tìm user hiện tại
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Nếu có email mới
    if (email && email !== existingUser.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const normalizedEmail = email.toLowerCase();
      const emailInUse = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });
      if (emailInUse) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      existingUser.email = normalizedEmail;
    }

    // Nếu có role mới
    if (role) {
      const validRoles = [
        "parent",
        "student",
        "teacher",
        "consultant",
        "admin",
        "finance",
      ];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      existingUser.role = role;
    }

    // Cập nhật các trường khác nếu có
    if (firstName) existingUser.firstName = firstName;
    if (lastName) existingUser.lastName = lastName;

    // Nếu có mật khẩu mới, mã hóa và cập nhật
    if (password) {
      // Kiểm tra mật khẩu mới có giống với mật khẩu cũ không
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        return res
          .status(400)
          .json({
            message: "New password cannot be the same as the old password",
          });
      }

      // Kiểm tra độ dài mật khẩu
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      // Mã hóa mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Error in updateUser controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteUser controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getInstructors = async (req, res) => {
  try {

    const instructors = await User.find({ role: "teacher" }).select(
      "_id firstName lastName"
    );

    res.status(200).json({
      success: true,
      instructors: instructors.map((instructor) => ({
        _id: instructor._id,
        name: `${instructor.firstName} ${instructor.lastName}`, 
      })),
    });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructors",
    });
  }
};
