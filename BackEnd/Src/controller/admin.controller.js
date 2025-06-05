import User from "../model/user.model.js";
import Course from "../model/course.model.js";
import Class from "../model/class.model.js"
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

export const validateStudentEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Kiểm tra email có tồn tại và là student không
    const student = await User.findOne({
      email: email,
      role: "student",
    });

    return res.json({
      success: !!student, // true nếu tìm thấy student, false nếu không
      message: student ? "Valid student email" : "Invalid student email",
    });
  } catch (error) {
    console.error("Error validating student email:", error);
    return res.status(500).json({
      success: false,
      message: "Error validating student email",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      address,
      degree,
      experience,
      parentPhoneNumber,
      isAdultStudent,
    } = req.body;

    // Tìm user cần cập nhật
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validation: Kiểm tra email không trùng (nếu email thay đổi)
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      user.email = email;
    }

    // Validation phone number (nếu có thay đổi)
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be 10 digits",
        });
      }
      user.phoneNumber = phoneNumber;
    }

    // Cập nhật các trường cơ bản
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.role = role || user.role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Xử lý cho employee (admin, finance, teacher, consultant)
    const employeeRoles = ["admin", "finance", "teacher", "consultant"];
    if (employeeRoles.includes(user.role)) {
      user.degree = degree || user.degree;
      user.experience = experience || user.experience;

      // Giữ địa chỉ nếu được cung cấp hợp lệ
      if (!address || !address.ward || !address.city) {
        return res.status(400).json({
          success: false,
          message: "Ward/Commune and City are required for employees",
        });
      }
      user.address = address;

      user.parents = []; // Employee không cần parents
      user.isAdultStudent = undefined; // Employee không cần isAdultStudent
    }

    // Xử lý cho parent
    if (user.role === "parent") {
      if (!address || !address.ward || !address.city) {
        return res.status(400).json({
          success: false,
          message: "Ward/Commune and City are required for parents",
        });
      }
      user.address = address;
      user.degree = undefined; // Parent không cần degree
      user.experience = undefined; // Parent không cần experience
      user.parents = []; // Parent không cần parents
      user.isAdultStudent = undefined; // Parent không cần isAdultStudent
    }

    // Xử lý cho student
    if (user.role === "student") {
      const newIsAdultStudent =
        isAdultStudent !== undefined ? isAdultStudent : user.isAdultStudent;
      user.isAdultStudent = newIsAdultStudent;
      user.degree = undefined; // Student không cần degree
      user.experience = undefined; // Student không cần experience
      user.children = []; // Student không có children

      if (!newIsAdultStudent) {
        // Kiểm tra parentPhoneNumber nếu không phải adult student
        if (!parentPhoneNumber) {
          return res.status(400).json({
            success: false,
            message: "Parent phone number is required for non-adult students",
          });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(parentPhoneNumber)) {
          return res.status(400).json({
            success: false,
            message: "Parent phone number must be 10 digits",
          });
        }

        // Tìm parent mới
        const parent = await User.findOne({
          phoneNumber: parentPhoneNumber,
          role: "parent",
        });
        if (!parent) {
          return res.status(400).json({
            success: false,
            message: "Parent with this phone number does not exist",
          });
        }

        // Xóa student khỏi danh sách children của parent cũ (nếu có)
        if (user.parents && user.parents.length > 0) {
          const oldParentId = user.parents[0].id;
          await User.updateOne(
            { _id: oldParentId },
            {
              $pull: {
                children: { id: user._id },
              },
            }
          );
        }

        // Cập nhật thông tin parent mới cho student
        user.parents = [
          {
            id: parent._id,
            firstName: parent.firstName,
            lastName: parent.lastName,
          },
        ];

        // Thêm student vào danh sách children của parent mới
        await User.updateOne(
          { _id: parent._id },
          {
            $addToSet: {
              children: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            },
          }
        );

        user.address = undefined; // Non-adult student không cần address
      } else {
        // Adult student
        if (!address || !address.ward || !address.city) {
          return res.status(400).json({
            success: false,
            message: "Ward/Commune and City are required for adult students",
          });
        }

        // Nếu chuyển từ non-adult sang adult, xóa liên kết parent
        if (!user.isAdultStudent && newIsAdultStudent) {
          if (user.parents && user.parents.length > 0) {
            const oldParentId = user.parents[0].id;
            await User.updateOne(
              { _id: oldParentId },
              {
                $pull: {
                  children: { id: user._id },
                },
              }
            );
          }
          user.parents = [];
        }

        user.address = address;
      }
    }
    // Lưu user
    await user.save();

    // Log để kiểm tra dữ liệu sau khi cập nhật
    console.log("Updated user:", user);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        parents: user.parents,
        isAdultStudent: user.isAdultStudent,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle student role: Remove from enrolledUsers in Courses and students in Classes
    if (user.role === "student") {
      // Remove from Course.enrolledUsers
      await Course.updateMany(
        { "enrolledUsers.userId": userId },
        { $pull: { enrolledUsers: { userId: userId } } }
      );
      // Remove from Class.students
      await Class.updateMany(
        { "students.userId": userId },
        { $pull: { students: { userId: userId } } }
      );
    }

    // Handle student role: Remove student from parent's children list
    if (user.role === "student" && user.parents && user.parents.length > 0) {
      const parentId = user.parents[0].id;
      await User.updateOne(
        { _id: parentId },
        {
          $pull: {
            children: { id: user._id },
          },
        }
      );
    }

    // Handle parent role: Remove parent from children's parents list
    if (user.role === "parent" && user.children && user.children.length > 0) {
      const childrenIds = user.children.map(child => child.id);
      await User.updateMany(
        { _id: { $in: childrenIds } },
        {
          $pull: {
            parents: { id: user._id },
          },
        }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "teacher" }).select(
      "_id firstName lastName email phoneNumber degree experience"
    );

    const formattedInstructors = instructors.map((instructor) => {
      const totalExperienceYears = instructor.experience.reduce(
        (total, exp) => {
          const startDate = new Date(exp.startDate);
          const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
          const experienceYears =
            endDate.getFullYear() - startDate.getFullYear();
          return total + experienceYears;
        },
        0
      );
      const degreeNames = instructor.degree.map((deg) => deg.name);

      return {
        _id: instructor._id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        phoneNumber: instructor.phoneNumber,
        degrees: degreeNames, // Danh sách tên bằng cấp
        experienceYears: Math.floor(totalExperienceYears), // Tổng số năm kinh nghiệm (làm tròn 1 chữ số thập phân)
      };
    });

    res.status(200).json({
      // success: true,
      // instructors: instructors.map((instructor) => ({
      //   _id: instructor._id,
      //   name: `${instructor.firstName} ${instructor.lastName}`,
      // })),
      success: true,
      instructors: formattedInstructors,
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
    const { firstName, lastName, email, password, phoneNumber, address, role } =
      req.body;

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
        message: "This function is for parent role",
      });
    }

    // Check Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validation phone number (bắt buộc)
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    // Validation address (bắt buộc)
    if (!address || !address.ward || !address.city) {
      return res.status(400).json({
        success: false,
        message: "Address with Ward/Commune and City is required",
      });
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Parent
    const newParent = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      address,
      children: [], // Mặc định là mảng rỗng
    });

    await newParent.save();

    res.status(201).json({
      success: true,
      message: "Parent account created successfully",
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
      message: "Error creating parent account",
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
      role,
      parentPhoneNumber,
      isAdultStudent,
      address,
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
        message: "This function is for student role",
      });
    }

    // Check Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validation phone number (bắt buộc cho mọi student)
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    // Validation address nếu isAdultStudent là true
    if (isAdultStudent) {
      if (!address || !address.ward || !address.city) {
        return res.status(400).json({
          success: false,
          message: "Ward/Commune and City are required for adult students",
        });
      }
    }

    // Validation parentPhoneNumber (nếu có và không phải adult student)
    let parentData = null;
    if (!isAdultStudent && parentPhoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(parentPhoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Parent phone number must be 10 digits",
        });
      }

      const parent = await User.findOne({
        phoneNumber: parentPhoneNumber,
        role: "parent",
      });

      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent not found with the provided phone number",
        });
      }

      parentData = {
        id: parent._id,
        firstName: parent.firstName,
        lastName: parent.lastName,
      };
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Student
    const newStudent = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      address: isAdultStudent ? address : undefined, // Chỉ lưu address nếu là adult student
      parents: parentData ? [parentData] : [],
      degree: [],
      experience: [],
      children: [],
      isAdultStudent: isAdultStudent || false,
    });

    await newStudent.save();

    // Cập nhật danh sách children của phụ huynh (nếu có)
    if (parentData) {
      await User.updateOne(
        { _id: parentData.id },
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

    // Log để kiểm tra dữ liệu lưu vào database
    console.log("New student created:", newStudent);

    res.status(201).json({
      success: true,
      message: "Student account created successfully",
      user: {
        _id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        role: newStudent.role,
        phoneNumber: newStudent.phoneNumber,
        address: newStudent.address, // Đảm bảo address được trả về
        parents: newStudent.parents,
        isAdultStudent: newStudent.isAdultStudent,
        createdAt: newStudent.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating student account",
      error: error.message,
    });
  }
};

// Api get student and parent data
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("parents.id", "firstName lastName phoneNumber email") // Populate thông tin parent
      .populate("children.id", "firstName lastName phoneNumber"); // Populate thông tin children

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Api get phone number of parent
export const checkParent = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Kiểm tra parent tồn tại
    const parent = await User.findOne({ phoneNumber, role: "parent" });

    res.status(200).json({
      success: true,
      exists: !!parent, // true nếu parent tồn tại, false nếu không
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking parent",
      error: error.message,
    });
  }
};

// Api get student list
export const getStudents = async (req, res) => {
  try {
    // Fetch users with role "student"
    const students = await User.find(
      { role: "student" },
      "firstName lastName email phoneNumber"
    );

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};