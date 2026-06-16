import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../features/auth/hooks/useAuth';

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Still attempting silent refresh — don't redirect yet
  if (isLoading) return null;

  // Already logged in → redirect away from login page
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;