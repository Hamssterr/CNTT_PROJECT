// Router.jsx (hoặc file định tuyến của bạn)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "../src/Lib/ProtectedRoute";

import Loading from "./Components/Loading";

import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import ConsultantRoutes from "./routes/ConsultantRoutes";
import AcademicFinanceRoutes from "./routes/AcademicFinanceRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {AdminRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute role={route.role}>{route.element}</ProtectedRoute>
            }
          />
        ))}

        {TeacherRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute role={route.role}>{route.element}</ProtectedRoute>
            }
          />
        ))}

        {AcademicFinanceRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute role={route.role}>{route.element}</ProtectedRoute>
            }
          />
        ))}

        {ConsultantRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute role={route.role}>{route.element}</ProtectedRoute>
            }
          />
        ))}

        {StudentRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute role={route.role}>{route.element}</ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
