import Course from "../model/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
    body.courseImage = req.file ? req.file?.path : null;
    const course = new Course(body);
    await course.save();

    res.status(200).json({
      message: "Course is created",
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error in create Course: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    const skip = (page - 1) * limit;

    let searchCriteria = {};
    if (search) {
      searchCriteria = {
        title: {
          $regex: search,
          $options: "i",
        },
      };
    }

    const totalCourse = await Course.countDocuments(searchCriteria);

    const course = await Course.find(searchCriteria)
      .skip(skip)
      .limit(limit)
      .sort({ updateAt: -1 });

    const totalPages = Math.ceil(totalCourse / limit);
    res.status(200).json({
      message: "All Course",
      success: true,
      data: {
        Course: course,
        pagination: {
            totalCourse,
            currentPage: page,
            totalPages,
            pageSize: limit
        }
      }
    });
  } catch (error) {
    console.error("Error in get all Course", error.message);
    res.status(500).json({
      message: "False to get course",
      success: false,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id });

    res.status(200).json({
      message: "Get Course details",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in get Course", error.message);
    res.status(500).json({
      message: "False to get course",
      success: false,
    });
  }
};

export const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: "Course deleted",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in delete Course", error.message);
    res.status(500).json({
      message: "False to delete course",
      success: false,
    });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { courseImage, title, description, instructor } = req.body;
    const { id } = req.params;

    let updateData = {
      courseImage,
      title,
      description,
      instructor,
    };

    if (req.file) {
      updateData.courseImage = req.file.path;
    }

    const updateCourse = await Course.findByIdAndUpdate(id, updateData);

    if (!updateCourse) {
      res.status(500).json({
        message: "Course is not found",
      });
    }

    res.status(200).json({
      message: "Course is updated",
      success: true,
      data: updateCourse,
    });
  } catch (error) {
    console.error("Error in update Course", error.message);
    res.status(500).json({
      message: "Error in update Course",
      success: false,
    });
  }
};
