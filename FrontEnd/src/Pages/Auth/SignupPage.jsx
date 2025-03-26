import React, { useContext, useState } from "react";
import image from "../../assets/1.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Signup = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        role: "student",
      });
      console.log("Signup response:", data);
      if (data.success) {
        setIsLoggedIn(true);
        toast.success("Sign up successful! Please log in.");
        clearInput();
        navigate("/login"); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data);
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
          <h1 className="text-5xl font-bold text-center">Create Account</h1>
          <h2 className="text-center text-2xl mb-6">Create Your Account</h2>

          <form
            onSubmit={onSubmitHandler}
            className="gap-2 p-3 w-full flex flex-col"
          >
            <div className="flex flex-col text-2xl text-left gap-1 pb-6">
              <span>First Name</span>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="Enter your First Name"
                type="text"
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50 text-lg placeholder:text-sm"
                required
              />
            </div>
            <div className="flex flex-col text-2xl text-left gap-1 pb-6">
              <span>Last Name</span>
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="Enter your Last Name"
                type="text"
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50 text-lg placeholder:text-sm"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>

          <p className="font-semibold">
            Have an Account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
        <img
          src={image}
          className="w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden"
          alt="Signup illustration"
        />
      </div>
    </section>
  );
};

export default Signup;
