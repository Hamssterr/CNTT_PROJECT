import React, { useContext, useState } from "react";
import image from "../../assets/1.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, login } = useContext(AppContext); // Thay setIsLoggedIn, setRole bằng login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", data);

      if (data.success) {
        // Giả sử backend trả về token trong data.token
        const token = data.token || data.data.token;
        const role = data.data.role;

        // Sử dụng hàm login từ context
        login(token, role);

        toast.success("Login successful!");

        // Check role and navigate to pages
        if (role === "student") {
          navigate("/student/dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "consultant") {
          navigate("/consultant/dashboard");
        } else if (role === "finance") {
          navigate("/academic-finance/dashboard");
        } else {
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
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100%">
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-none xl:rounded-br-none">
          <h1 className="text-5xl font-bold text-center">Welcome</h1>
          <h2 className="text-center text-2xl mb-6">Login</h2>

          <form
            onSubmit={onSubmitHandler}
            className="gap-2 p-3 w-full flex flex-col"
          >
            <div className="flex flex-col text-2xl text-left gap-1 pb-6">
              <span>Email</span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your Email"
                type="email"
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50 text-lg placeholder:text-sm"
                required
              />
            </div>
            <div className="flex flex-col text-2xl text-left gap-1 pb-6">
              <span>Password</span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your Password"
                type="password"
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50 text-lg placeholder:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="px-10 py-2 text-2xl rounded-md bg-gradient-to-tr from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
            >
              Login
            </button>
          </form>

          <p className="font-semibold">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
        <img
          src={image}
          className="w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden"
          alt="Login illustration"
        />
      </div>
    </section>
  );
};

export default Login;
