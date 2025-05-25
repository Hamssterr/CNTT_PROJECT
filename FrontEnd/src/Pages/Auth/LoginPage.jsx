import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
// Import assets
import logo from "../../assets/logo_2.png"; // Đảm bảo bạn có file logo
import mailIcon from "../../assets/mail_icon.svg"; // Thêm icon email
import lockIcon from "../../assets/lock_icon.svg"; // Thêm icon khóa
import chat from "../../assets/chat.png"; // Thêm icon chat
import chatbox from "../../assets/chatbox.png"; // Thêm icon chatbox
import profile_picture from "../../assets/profile_picture.png"; // Thêm ảnh đại diện người dùng
import run from "../../config/gemini"; // Import hàm run từ config
import { ArrowLeft } from "lucide-react";
const LoginPage = () => {
  const navigate = useNavigate();
  const { backendUrl, login } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatboxAnimation = `
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        setShowChatbox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tự động cuộn xuống khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = inputMessage;
    setInputMessage("");

    // Thêm tin nhắn của người dùng
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Hiển thị trạng thái đang nhập
    setIsTyping(true);

    try {
      // Gọi API Gemini
      const aiResponse = await run(userMessage);

      // Thêm phản hồi từ AI
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        const token = data.token || data.data.token;
        const role = data.data.role;
        login(token, role);
        toast.success("Login successful!");

        // Navigate based on role
        if (role === "student") navigate("/student/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else if (role === "parent") navigate("/parent/dashboard");
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
      <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center bg-white">
        <div className="mb-6">
          <img src={logo} alt="logo" className="w-60 h-60" />
        </div>
        <p className="text-3xl text-center text-blue-900">
          TP Education, <br />
          For all students in the world.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 bg-gray-800 flex flex-col justify-center items-center px-6 sm:px-12 py-10">
        <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-900 hover:text-blue-500 transition-colors duration-300"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </button>
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

        <button
            onClick={() => setShowChatbox(!showChatbox)}
            className="absolute bottom-6 right-6 bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-all duration-300 cursor-pointer z-10"
          >
            <img src={chat} alt="Chat with AI" className="w-6 h-6" />
        </button>

        {showChatbox && (
            <div
              ref={chatboxRef}
              className="absolute bottom-24 right-6 w-90 bg-white rounded-xl shadow-2xl overflow-hidden z-20"
              style={{ animation: "fadeInUp 0.3s forwards" }}
            >
              {/* Chatbox Header */}
              <div className="bg-yellow-400 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <img src={chatbox} alt="AI" className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Assistant</h3>
                </div>
                <button
                  onClick={() => setShowChatbox(false)}
                  className="text-blue-900 hover:text-blue-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Messages Area */}
              <div className="h-80 overflow-y-auto p-4 bg-gray-50 scroll-smooth">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2 flex-shrink-0">
                        <img
                          src={chatbox}
                          alt="AI"
                          className="w-5 h-5"
                        />
                      </div>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 max-w-[70%] break-words ${
                        message.sender === "user"
                          ? "bg-yellow-400 text-black rounded-br-none"
                          : "bg-white border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>

                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0">
                        <img
                          src={profile_picture}
                          alt="User"
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex mb-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2 flex-shrink-0">
                      <img src={chatbox} alt="AI" className="w-5 h-5" />
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-white border border-gray-200 rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập tin nhắn của bạn..."
                    className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-yellow-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-blue-900 transform rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default LoginPage;
