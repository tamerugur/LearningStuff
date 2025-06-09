import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  console.log("ProtectedRoute rendering...");
  const token = localStorage.getItem("authToken");
  console.log("Token from localStorage:", token);

  if (!token) {
    console.log("No token found, redirecting to /auth");
    // If no token, redirect to the login page
    return <Navigate to="/auth" replace />;
  }

  console.log("Token found, rendering child route.");
  // If token exists, render the child routes
  return <Outlet />;
}
