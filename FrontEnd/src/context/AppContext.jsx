// AppContext.jsx
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const backendUrl = "http://localhost:8080";

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedRole = localStorage.getItem("role");
        const storedToken = localStorage.getItem("token");

        if (storedRole && storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          axios.defaults.withCredentials = true;

          const { data } = await axios.get(`${backendUrl}/api/auth/verify`);
          if (data.success) {
            setIsLoggedIn(true);
            setRole(storedRole);
          } else {
            setIsLoggedIn(false);
            setRole(null);
            localStorage.removeItem("role");
            localStorage.removeItem("token");
          }
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Auth check failed: ", error);
        setIsLoggedIn(false);
        setRole(null);
        localStorage.removeItem("role");
        localStorage.removeItem("token");
      } finally {
        setIsCheckingAuth(false); // Đánh dấu kiểm tra hoàn tất
      }
    };
    checkAuthStatus();
  }, [backendUrl]);

  const login = (token, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setRole(null);
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
        isCheckingAuth 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};