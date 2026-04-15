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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — light theme */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/companies" element={<CompanySelect />} />

          {/* Changed from /dashboard/:company to /prep/:company */}
          <Route path="/prep/:company" element={<PrepDashboard />} />
          <Route path="/interview/:company" element={<MockInterview />} />
          <Route path="/chat" element={<ChatBot />} />

          {/* Protected dashboard — /dashboard/* handles all sub-routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);