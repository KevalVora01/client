import { useState } from 'react';
import { Home, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import type { LoginPayload } from '../types/auth.types';
import './LoginPage.css';
import LoginForm from '../components/LoginForm';
import { showError, showSuccess } from '../../../utils/toast';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (payload: LoginPayload) => {

    setIsLoading(true);
    try {
      await login(payload);
      navigate('/', { replace: true });
      showSuccess('Login successful!');
    } catch {
      showError('Invalid Credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="login-page__container w-100">

        {/* Brand header */}
        <div className="login-brand text-center mb-4">
          <div className="login-brand__icon mb-2">
            <Home size={28} strokeWidth={2} />
          </div>
          <h1 className="login-brand__title mb-1">Civic Horizon</h1>
          <p className="login-brand__subtitle mb-0">Secure Society Management Solutions</p>
        </div>

        {/* Login card */}
        <div className="login-card">
          <h2 className="login-card__heading mb-1">Welcome Back</h2>
          <p className="login-card__subtext mb-4">
            Enter your credentials to access your dashboard.
          </p>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading} />
        </div>

        {/* Footer */}
        <div className="login-footer text-center mt-4">
          <p className="login-footer__support mb-2">
            Need technical assistance? <a href="#">Contact Support</a>
          </p>
          <div className="login-footer__badges d-flex justify-content-center gap-4">
            <span className="d-inline-flex align-items-center">
              <ShieldCheck size={14} className="me-1" /> 256-bit SSL
            </span>
            <span className="d-inline-flex align-items-center">
              <ShieldCheck size={14} className="me-1" /> GDPR Compliant
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;