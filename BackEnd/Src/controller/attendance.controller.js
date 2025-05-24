import Attendance from "../model/attendance.model.js";

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

export const getAttendanceReports = async (req, res) => {
  try {
    const reports = await Attendance.aggregate([
      {
        $lookup: {
          from: "classadmins",
          localField: "classId",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      { $unwind: "$classInfo" },
      // Tách studentId từ key attendanceData (classId-studentId)
      {
        $addFields: {
          absentStudentIds: {
            $map: {
              input: {
                $filter: {
                  input: { $objectToArray: "$attendanceData" },
                  as: "item",
                  cond: { $eq: ["$$item.v", "absent"] },
                },
              },
              as: "absent",
              in: {
                $arrayElemAt: [
                  { $split: ["$$absent.k", "-"] },
                  {
                    $subtract: [{ $size: { $split: ["$$absent.k", "-"] } }, 1],
                  },
                ],
              },
            },
          },
          presentStudentIds: {
            $map: {
              input: {
                $filter: {
                  input: { $objectToArray: "$attendanceData" },
                  as: "item",
                  cond: { $eq: ["$$item.v", "present"] },
                },
              },
              as: "present",
              in: {
                $arrayElemAt: [
                  { $split: ["$$present.k", "-"] },
                  {
                    $subtract: [{ $size: { $split: ["$$present.k", "-"] } }, 1],
                  },
                ],
              },
            },
          },
        },
      },
      // Convert userId của học sinh sang string để so sánh
      {
        $addFields: {
          studentsWithStringId: {
            $map: {
              input: "$classInfo.students",
              as: "stu",
              in: {
                _id: { $toString: "$$stu._id" },
                firstName: "$$stu.firstName",
                lastName: "$$stu.lastName",
                email: "$$stu.email",
              },
            },
          },
        },
      },
      // Lọc học sinh có mặt/vắng mặt dựa trên _id dạng string
      {
        $addFields: {
          presentStudents: {
            $filter: {
              input: "$studentsWithStringId",
              as: "stu",
              cond: { $in: ["$$stu._id", "$presentStudentIds"] },
            },
          },
          absentStudents: {
            $filter: {
              input: "$studentsWithStringId",
              as: "stu",
              cond: { $in: ["$$stu._id", "$absentStudentIds"] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          className: "$classInfo.className",
          date: 1,
          attendanceData: 1,
          instructor: {
            id: "$classInfo.instructor.id",
            name: "$classInfo.instructor.name",
          },
          totalStudents: { $size: { $objectToArray: "$attendanceData" } },
          present: {
            $size: {
              $filter: {
                input: { $objectToArray: "$attendanceData" },
                as: "item",
                cond: { $eq: ["$$item.v", "present"] },
              },
            },
          },
          absent: {
            $size: {
              $filter: {
                input: { $objectToArray: "$attendanceData" },
                as: "item",
                cond: { $eq: ["$$item.v", "absent"] },
              },
            },
          },
          absentStudents: {
            $map: {
              input: "$absentStudents",
              as: "stu",
              in: {
                name: { $concat: ["$$stu.lastName", " ", "$$stu.firstName"] },
                email: "$$stu.email",
              },
            },
          },
          presentStudents: {
            $map: {
              input: "$presentStudents",
              as: "stu",
              in: {
                name: { $concat: ["$$stu.lastName", " ", "$$stu.firstName"] },
                email: "$$stu.email",
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching attendance reports:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
