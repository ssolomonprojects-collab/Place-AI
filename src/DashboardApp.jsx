import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";

export default function DashboardApp() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL path to Dashboard's internal activeNav
  // We pass the path info via state so Dashboard can initialize correctly
  return <Dashboard user={user} initialPath={location.pathname} />;
}