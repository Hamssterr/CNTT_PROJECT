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
        return res.status(400).json({
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

export const createEmployeeAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      degree,
      experience,
      role,
    } = req.body;

    // Validate basic
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First Name, Last Name, Email and Password are required",
      });
    }

    // Check Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists ",
      });
    }

    // Check Address
    if (
      address &&
      (address.ward || address.city) &&
      (!address.ward || !address.city)
    ) {
      return res.status(400).json({
        success: false,
        message: "Ward/Commune and City are required if you enter an address",
      });
    }

    // Validate 1 degree and 1 year experience
    if (!degree || degree.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Employee must have at least one degree.",
      });
    }
    if (!experience || experience.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Employee must have at least one working experience.",
      });
    }

    // validate for degree
    for (const deg of degree) {
      if (!deg.name || !deg.institution || !deg.year) {
        return res.status(400).json({
          success: false,
          message:
            "Each degree must have the name, school of award, and year of graduation.",
        });
      }
      // Check valid graduation year (not older than current year)
      const currentYear = new Date().getFullYear();
      if (deg.year > currentYear) {
        return res.status(400).json({
          success: false,
          message: "Graduation year cannot be older than current year",
        });
      }
    }

    // Validation for experience
    for (const exp of experience) {
      if (!exp.position || !exp.company || !exp.startDate) {
        return res.status(400).json({
          success: false,
          message:
            "Each experience must have location, company, and start date.",
        });
      }
      // Check for valid start and end dates
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : null;
      const currentDate = new Date();

      if (startDate > currentDate) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be greater than current date",
        });
      }
      if (endDate && endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: "NEnd date cannot be less than start date",
        });
      }
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email not acept",
      });
    }

    // Validation phone number
    if (phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be 10 number",
        });
      }
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Employee
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      degree,
      experience,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Create successfully",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        degree: newUser.degree,
        experience: newUser.experience,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error with create employee",
      error: error.message,
    });
  }
};

export const createParentAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      children, 
      role,
    } = req.body;

    // Validate basic
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First Name, Last Name, Email and Password are required",
      });
    }

    // Check role
    if (role !== "parent") {
      return res.status(400).json({
        success: false,
        message: "This function use for parent role",
      });
    }

    // Check Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists ",
      });
    }

    // Check Address
    if (
      address &&
      (address.ward || address.city) &&
      (!address.ward || !address.city)
    ) {
      return res.status(400).json({
        success: false,
        message: "Ward/Commune and City are required if you enter an address",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email not acept",
      });
    }

    // Validation phone number
    if (phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be 10 number",
        });
      }
    }

    // Validation cho children (danh sách học sinh)
    let childrenData = [];
    if (children && children.length > 0) {
      // Kiểm tra xem các ID học sinh có tồn tại và có role là "student" không
      const students = await User.find({
        _id: { $in: children },
        role: "student",
      });

      if (students.length !== children.length) {
        return res.status(400).json({
          success: false,
          message: "Một số ID học sinh không tồn tại hoặc không phải học sinh",
        });
      }

      // Kiểm tra xem phụ huynh có đang liên kết với chính mình không
      if (children.includes(email)) {
        return res.status(400).json({
          success: false,
          message: "Phụ huynh không thể liên kết với chính mình",
        });
      }

      // Chuẩn bị dữ liệu cho trường children (bao gồm id, firstName, lastName)
      childrenData = students.map((student) => ({
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
      }));
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Employee
    const newParent = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      children: childrenData || [],
    });

    await newParent.save();

    // Cập nhật danh sách parents của các học sinh (nếu có)
    if (children && children.length > 0) {
      await User.updateMany(
        { _id: { $in: children } },
        {
          $addToSet: {
            parents: {
              id: newParent._id,
              firstName: newParent.firstName,
              lastName: newParent.lastName,
            },
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Create parent account successfully",
      user: {
        _id: newParent._id,
        firstName: newParent.firstName,
        lastName: newParent.lastName,
        email: newParent.email,
        role: newParent.role,
        phoneNumber: newParent.phoneNumber,
        address: newParent.address,
        children: newParent.children,
        createdAt: newParent.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error with create parent account",
      error: error.message,
    });
  }
};

export const createStudentAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      parents, 
      role,
    } = req.body;

    // Validate basic
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First Name, Last Name, Email and Password are required",
      });
    }

    // Check role
    if (role !== "student") {
      return res.status(400).json({
        success: false,
        message: "This function use for student role",
      });
    }

    // Check Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists ",
      });
    }

    // Check Address
    if (
      address &&
      (address.ward || address.city) &&
      (!address.ward || !address.city)
    ) {
      return res.status(400).json({
        success: false,
        message: "Ward/Commune and City are required if you enter an address",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email not acept",
      });
    }

    // Validation phone number
    if (phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be 10 number",
        });
      }
    }

    // Validation cho parents (danh sách phụ huynh)
    let parentsData = [];
    if (parents && parents.length > 0) {
      // Kiểm tra xem các ID phụ huynh có tồn tại và có role là "parent" không
      const parentUsers = await User.find({
        _id: { $in: parents },
        role: "parent",
      });

      if (parentUsers.length !== parents.length) {
        return res.status(400).json({
          success: false,
          message: "Một số ID phụ huynh không tồn tại hoặc không phải phụ huynh",
        });
      }

      // Kiểm tra xem học sinh có đang liên kết với chính mình không
      if (parents.includes(email)) {
        return res.status(400).json({
          success: false,
          message: "Học sinh không thể liên kết với chính mình",
        });
      }

      // Chuẩn bị dữ liệu cho trường parents (bao gồm id, firstName, lastName)
      parentsData = parentUsers.map((parent) => ({
        id: parent._id,
        firstName: parent.firstName,
        lastName: parent.lastName,
      }));
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Employee
    const newStudent = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      parents: parentsData || [], // Nếu không có parents thì để mảng rỗng
      degree: [], // Đặt mặc định là mảng rỗng vì học sinh không cần degree
      experience: [], // Đặt mặc định là mảng rỗng vì học sinh không cần experience
      children: []
    });

    await newStudent.save();

    if (parents && parents.length > 0) {
      await User.updateMany(
        { _id: { $in: parents } },
        {
          $addToSet: {
            children: {
              id: newStudent._id,
              firstName: newStudent.firstName,
              lastName: newStudent.lastName,
            },
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Create student account successfully",
      user: {
        _id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        role: newStudent.role,
        phoneNumber: newStudent.phoneNumber,
        address: newStudent.address,
        parents: newStudent.parents,
        createdAt: newStudent.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error with create student account",
      error: error.message,
    });
  }
}
