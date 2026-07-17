import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import type { UserRole } from '../features/auth/types/auth.types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Still attempting silent refresh — show spinner
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but must reset password → force to the email-link notice screen
  if (user?.mustResetPassword) {
    return <Navigate to="/set-password-required" replace />;
  }

  // Logged in but wrong role → redirect to unauthorized
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;