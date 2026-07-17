import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, LogOut } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const PasswordResetRequiredPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.mustResetPassword) {
    const role = user?.role?.toLowerCase();
    if (role === 'resident') return <Navigate to="/resident" replace />;
    if (role === 'security') return <Navigate to="/security" replace />;
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="w-100" style={{ maxWidth: '520px' }}>
        <div className="bg-white p-4 p-sm-5 rounded-3 border-0 text-center" style={{ boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#eef2ff' }}
          >
            <Mail size={28} strokeWidth={2} color="#4f46e5" />
          </div>

          <h2 className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#111827' }}>
            Set your password
          </h2>
          <p className="mb-1" style={{ fontSize: '0.95rem', color: '#374151' }}>
            Your account was created and a password setup link has been sent to
          </p>
          <p className="fw-semibold mb-4" style={{ fontSize: '0.95rem', color: '#111827' }}>
            {user.email}
          </p>

          <div
            className="text-start mb-4 p-3 rounded-2"
            style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', color: '#4b5563' }}
          >
            Please open that email and click the link to choose your password. Once set,
            you'll be able to sign in here. If you don't see the email, check your spam folder
            or contact your society administrator.
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: '#111827',
              color: '#ffffff',
              height: '48px',
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              borderRadius: '8px',
            }}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequiredPage;
