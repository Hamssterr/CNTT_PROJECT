import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["parent", "student", "consultant", "admin", "finance", "teacher"],
      required: true,
    },
    isAdultStudent: { type: Boolean, default: false },
    phoneNumber: {
      type: String,
      required: false, 
    },
    address: {
      type: {
        houseNumber: {
          type: String,
          required: false, // Số nhà
        },
        street: {
          type: String,
          required: false, // Tên đường (nếu cần)
        },
        ward: {
          type: String,
          required: false, // Phường/Xã
        },
        district: {
          type: String,
          required: false, // Quận/Huyện
        },
        city: {
          type: String,
          required: false, // Thành phố
        },
        province: {
          type: String,
          required: false, // Tỉnh (nếu cần phân biệt với thành phố)
        },
        country: {
          type: String,
          required: false, // Quốc gia (nếu cần)
          default: "Vietnam", // Mặc định là Việt Nam
        },
      },
      required: false, // Toàn bộ object address không bắt buộc
    },
    degree: [
      {
        name: {
          type: String,
          required: true, // Tên bằng cấp (ví dụ: Cử nhân Tiếng Anh)
        },
        institution: {
          type: String,
          required: true, // Trường cấp bằng (ví dụ: Đại học Sư phạm TP.HCM)
        },
        year: {
          type: Number,
          required: true, // Năm tốt nghiệp (ví dụ: 2020)
        },
        major: {
          type: String,
          required: false, // Chuyên ngành (ví dụ: Giảng dạy Tiếng Anh)
        },
      },
    ],
    experience: [
      {
        position: {
          type: String,
          required: true, // Vị trí (ví dụ: Giáo viên Tiếng Anh)
        },
        company: {
          type: String,
          required: true, // Nơi làm việc (ví dụ: Trung tâm Anh ngữ ABC)
        },
        startDate: {
          type: Date,
          required: true, // Ngày bắt đầu
        },
        endDate: {
          type: Date,
          required: false, // Ngày kết thúc (có thể để null nếu đang làm)
        },
        description: {
          type: String,
          required: false, // Mô tả công việc
        },
      },
    ],
    children: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User", // Tham chiếu đến học sinh
          required: false,
        },
        firstName: {
          type: String,
          required: false, // Tên của học sinh
        },
        lastName: {
          type: String,
          required: false, // Họ của học sinh
        },
      },
    ],
    parents: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User", // Tham chiếu đến phụ huynh
          required: false,
        },
        firstName: {
          type: String,
          required: false, // Tên của phụ huynh
        },
        lastName: {
          type: String,
          required: false, // Họ của phụ huynh
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
