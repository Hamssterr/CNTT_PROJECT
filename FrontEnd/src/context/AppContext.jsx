// AppContext.jsx
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [leads, setLeads] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null); // Thêm dòng này

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const [authLoading, setAuthLoading] = useState(true);

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = await run(input);
    setResultData(response);
    setLoading(false);
    setInput("");
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedRole = localStorage.getItem("role");
        const storedToken = localStorage.getItem("token");

        if (storedRole && storedToken) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          axios.defaults.withCredentials = true;

          const { data } = await axios.get(`${backendUrl}/api/auth/verify`);
          if (data.success) {
            setIsLoggedIn(true);
            setRole(storedRole);
            setUser(data.data); // Lưu user vào context
          } else {
            setIsLoggedIn(false);
            setRole(null);
            setUser(null); // Reset user nếu fail
            localStorage.removeItem("role");
            localStorage.removeItem("token");
          }
        } else {
          setIsLoggedIn(false);
          setRole(null);
          setUser(null); // Reset user nếu không có token
        }
      } catch (error) {
        console.error("Auth check failed: ", error);
        setIsLoggedIn(false);
        setRole(null);
        setUser(null); // Reset user nếu lỗi
        localStorage.removeItem("role");
        localStorage.removeItem("token");
      } finally {
        setIsCheckingAuth(false); // Đánh dấu kiểm tra hoàn tất
      }
    };
    checkAuthStatus();
  }, [backendUrl]);

  useEffect(() => {
    if (isLoggedIn && role === "consultant") {
      fetchAllData();
    }
  }, [isLoggedIn, role]);

  const fetchAllData = async () => {
    try {
      // Fetch leads
      const leadsResponse = await axios.get(
        `${backendUrl}/api/consultant/getLeadUsers`
      );
      if (leadsResponse.data.success) {
        setLeads(leadsResponse.data.leadUsers);
      }

      // Fetch schedules
      const schedulesResponse = await axios.get(
        `${backendUrl}/api/consultant/getSchedules`
      );
      if (schedulesResponse.data.success) {
        setSchedules(schedulesResponse.data.schedules);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const login = (token, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsLoggedIn(true);
    setRole(userRole);

    axios
      .get(`${backendUrl}/api/auth/verify`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUser(response.data.data); // Cập nhật user
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user after login:", error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setRole(null);
    setUser(null); // Reset user khi logout
  };

  const updateLeads = (newLeads) => {
    setLeads(newLeads);
  };

  const updateSchedules = (newSchedules) => {
    setSchedules(newSchedules);
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        role,
        setRole,
        login,
        logout,
        isCheckingAuth,
        leads,
        setLeads,
        schedules,
        setSchedules,
        fetchAllData,
        updateLeads,
        updateSchedules,
        user, // Thêm dòng này
        setUser, // Nếu cần cập nhật user ở nơi khác,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        prevPrompts,
        setPrevPrompts,
        authLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
