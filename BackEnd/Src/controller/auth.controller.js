import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken, generateTokenForgotPassword } from "../lib/utils.js";
import nodemailer from "nodemailer";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../config/emailTemplates.js";

export const signup = async (req, res) => {
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

    // Create toke with user and role
    generateToken(newUser._id, newUser.role, res);

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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // normalize email
    const normalizedEmail = email.toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create token
    const token = generateToken(user._id, user.role, res);

    // Return response
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller: ", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.split(" ")[1] ||
      req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in /me:", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const setCredentials = async (req, res) => {
  const { token, role } = req.body;

  // Set httpOnly cookies
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.cookie("role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ success: true });
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ success: false });
    }

    // Verify token logic here
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      role: decoded.role,
      token: token, // Gửi lại token để frontend có thể khôi phục
    });
  } catch (error) {
    res.json({ success: false });
  }
};

export const getPersonalData = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // Truy vấn người dùng
    const personalData = await User.findOne({ _id: userId });

    if (!personalData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get data successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error in getPersonalData:", error.message);
    res.status(500).json({
      success: false,
      message: "Error in get data",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { data } = req.body; // JSON string from FormData
    const profileImage = req.file; // Uploaded file from Multer

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Profile data is required",
      });
    }

    const parsedData = JSON.parse(data);
    const updateData = {
      ...parsedData,
      degree: Array.isArray(parsedData.degree)
        ? parsedData.degree.map((deg, index) => ({
            ...deg,
            id: deg.id || `deg-${Date.now()}-${index}`,
          }))
        : [],
      experience: Array.isArray(parsedData.experience)
        ? parsedData.experience.map((exp, index) => ({
            ...exp,
            id: exp.id || `exp-${Date.now()}-${index}`,
          }))
        : [],
    };

    if (profileImage) {
      updateData.profileImage = profileImage.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Update password for every role
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user?.userId; // Lấy từ verifyStudent

  try {
    // Debug body
    console.log("Request body:", req.body);
    console.log("User ID from token:", userId);

    // Kiểm tra userId từ token
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing user authentication",
      });
    }

    // Kiểm tra các trường bắt buộc
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (oldPassword, newPassword, confirmNewPassword) are required",
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Kiểm tra mật khẩu mới và xác nhận khớp nhau
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    // Trả về phản hồi
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in updatePassword controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Handle forgot password request
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate token
    const token = generateTokenForgotPassword(normalizedEmail);

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465, // Gmail SMTP port for secure connection
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Define email content
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: `"Foreign-Computing Center" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optionally set cookie (if needed for your app)
    res.cookie("jwt_reset", token, {
      maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV !== "development", // HTTPS in production
      sameSite: "strict", // Mitigates CSRF attacks
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const normalizedEmail = decoded.email.toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password (assuming you hash passwords with bcrypt)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear the reset cookie if set
    res.clearCookie("jwt_reset", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Reset link has expired",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const sendResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = OTP;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      // text: `Your Reset Password OTP is ${OTP}. Please do not tell anyone about this OTP`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{OTP}}", OTP).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "OTP Reset Password Sent on Email",
    });
  } catch (error) {
    console.log(process.env.SMTP_USER);
    console.log(process.env.SMPT_PASS);
    return res.json({ success: false, message: error.message });
  }
};

export const checkOTP = async (req, res) => {
  const { OTP, email } = req.body;
  if (!OTP || !email) {
    return res.json({ success: false, message: "OTP and Email are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOTP === "" || user.resetOTP !== OTP) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Valid OTP" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword2 = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.json({
      success: false,
      message: "Email, Password are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
