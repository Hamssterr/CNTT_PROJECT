// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { AppProvider } from "./context/AppContext.jsx";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
// <React.StrictMode>
//     <AppProvider>
//       <App />
//     </AppProvider>
//   </React.StrictMode>
// );


// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client"; // Sửa import
import App from "./App";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <ToastContainer />
    </AppProvider>
  </React.StrictMode>
);