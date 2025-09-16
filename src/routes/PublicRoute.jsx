// src/routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";


export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // Si hay usuario logueado, redirige al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
