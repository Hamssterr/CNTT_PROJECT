import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
// Import assets
import logo from "../../assets/logo_2.png"; // Đảm bảo bạn có file logo
import mailIcon from "../../assets/mail_icon.svg"; // Thêm icon email
import lockIcon from "../../assets/lock_icon.svg"; // Thêm icon khóa

const LoginPage = () => {
  const navigate = useNavigate();
  const { backendUrl, login } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (data.success) {
        const token = data.token || data.data.token;
        const role = data.data.role;
        login(token, role);
        toast.success("Login successful!");

        // Navigate based on role
        if (role === "student") navigate("/student/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else if (role === "consultant") navigate("/consultant/dashboard");
        else if (role === "finance") navigate("/academic-finance/dashboard");
        else if (role === "teacher") navigate("/teacher/my-classes");
        else {
          toast.error("Unsupported role");
          navigate("/");
        }

        clearInput();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="mb-6">
          <img src={logo} alt="logo" className="w-60 h-60" />
        </div>
        <p className="text-3xl text-center text-blue-900">
          TP Education, <br />
          For all students in the world.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-gray-800 flex flex-col justify-center items-center px-12">
        <h2 className="text-3xl text-yellow-400 font-semibold mb-2">
          WELCOME!
        </h2>
        <p className="text-white mb-6">Login to your account</p>

        <form onSubmit={onSubmitHandler} className="w-full max-w-sm">
          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={mailIcon} className="w-5 h-5" alt="email" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          <div className="mb-4 rounded flex items-center gap-3 w-full px-5 py-3 border border-gray-300 transition-all duration-300 focus-within:border-yellow-500 focus-within:shadow-md">
            <img src={lockIcon} className="w-5 h-5" alt="password" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-yellow-400 hover:scale-105 hover:shadow-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <p className="text-white">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
              >
                Register
              </span>
            </p>
          </div>
        </form>

        <div className="absolute bottom-10">
          <h1 className="text-2xl text-yellow-400 font-bold">TP Education</h1>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
