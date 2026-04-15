import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import CompanySelect from "./pages/CompanySelect";
import PrepDashboard from "./pages/PrepDashboard";
import MockInterview from "./pages/MockInterview";
import ChatBot from "./pages/ChatBot";
import DashboardApp from "./DashboardApp";
import AdminDashboard from "./pages/AdminDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — light theme */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/companies" element={<CompanySelect />} />
          <Route path="/prep/:company" element={<PrepDashboard />} />
          <Route path="/interview/:company" element={<MockInterview />} />
          <Route path="/chat" element={<ChatBot />} />

          {/* Protected dashboard */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);