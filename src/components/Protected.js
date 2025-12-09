import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    // send to /login and remember the original URL in state
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}