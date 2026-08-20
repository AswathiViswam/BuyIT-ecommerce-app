import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
