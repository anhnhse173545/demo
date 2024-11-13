import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";

import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <App />
      </AuthProvider>
      
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>
);
