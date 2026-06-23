import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import type { UserRole } from '../../types/auth.types';

const LoginPage = () => {
  const {
    role, setRole,
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="login-page__container w-100">

        {/* ── Brand ── */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div className="login-brand__box d-flex align-items-center justify-content-center">
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="login-brand__name">Civic Horizon</span>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="login-card">
          <h2 className="login-card__heading mb-1">Welcome Back</h2>
          <p className="login-card__subtext mb-4">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Access Role */}
            <div className="mb-3">
              <label className="field-label d-block">Access Role</label>
              <div className="role-toggle">
                {(['admin', 'resident', 'security'] as UserRole[]).map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`role-toggle__btn ${role === r ? 'role-toggle__btn--active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="field-label d-block" htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-with-icon__icon" />
                <input
                  type="email"
                  id="email"
                  className="form-control input-with-icon__control"
                  placeholder="name@society.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="field-label mb-0" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot?</Link>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-with-icon__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control input-with-icon__control input-with-icon__control--with-trailing"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-with-icon__trailing"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="signin-btn w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Signing in...
                </>
              ) : (
                'SIGN IN TO PORTAL'
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;