import Course from "../model/course.model.js";
import Banner from "../model/banner.model.js";
import RegisterCourse from "../model/registerCourse.model.js";
import mongoose from "mongoose";

export const getBanner = async (req, res) => {
  try {
    console.log('[getBanner] Gọi endpoint /api/admin/getBanner'); // Log để debug
    const banners = await Banner.find().populate('courseId', 'title').lean();
    if (!banners || banners.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }
    res.status(200).json({
      success: true,
      message: "Lấy danh sách banner thành công",
      banners,
    });
  } catch (error) {
    console.error("Lỗi khi lấy banner:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[getBannerById] Gọi endpoint /api/admin/getBanner/${id}`);

    const banner = await Banner.findById(id).populate('courseId', 'title').lean();

    if (!banner) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner với ID này" });
    }

    res.status(200).json({
      success: true,
      message: "Lấy banner thành công",
      banner,
    });
  } catch (error) {
    console.error("Lỗi khi lấy banner theo ID:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


// Các hàm khác (createBanner, updateBanner, deleteBanner) giữ nguyên
export const createBanner = async (req, res) => {
  try {
    const {
      title,
      description,
      buttonText,
      buttonColor,
      gradient,
      courseId,
      number,
      numberColor,
    } = req.body;

    const thumbnailUrl = req.file?.path;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khóa học" });
    }

    const existingBanner = await Banner.findOne({ courseId });
    if (existingBanner) {
      return res.status(400).json({ success: false, message: "Khóa học này đã được liên kết với một banner" });
    }

    const newBanner = new Banner({
      title,
      description,
      buttonText,
      buttonColor,
      gradient,
      courseId,
      number,
      backgroundImage: thumbnailUrl,
      numberColor,
    });

    await newBanner.save();

    res.status(201).json({
      success: true,
      message: "Tạo banner thành công",
      banner: newBanner,
    });
  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      buttonText,
      buttonColor,
      gradient,
      courseId,
      number,
      numberColor,
    } = req.body;

    const thumbnailUrl = req.file?.path;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }

    if (courseId && courseId !== banner.courseId?.toString()) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Không tìm thấy khóa học" });
      }

      const existingBanner = await Banner.findOne({
        courseId: courseId,
        _id: { $ne: id },
      });
      if (existingBanner) {
        return res.status(400).json({ success: false, message: "Khóa học này đã được liên kết với một banner khác" });
      }

      banner.courseId = courseId;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.buttonText = buttonText || banner.buttonText;
    banner.buttonColor = buttonColor || banner.buttonColor;
    banner.gradient = gradient || banner.gradient;
    banner.number = number || banner.number;
    banner.numberColor = numberColor || banner.numberColor;
    if (thumbnailUrl) banner.backgroundImage = thumbnailUrl;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật banner thành công",
      banner,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật banner:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }

    res.status(200).json({
      success: true,
      message: "Xóa banner thành công",
      banner: deletedBanner,
    });
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};


