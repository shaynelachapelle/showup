// Author: Shayne Lachapelle
// Logged-out visitors are sent to /login
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProtectedRoute() {
  return <Outlet />;
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return null; // still checking the login cookie
  if (user === null) {
    // Remember where they were going, so the login page can send them back afterwards.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
