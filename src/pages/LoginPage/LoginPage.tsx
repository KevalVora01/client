import { useState } from 'react';
import { Home, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './LoginPage.css';

type Role = 'admin' | 'resident' | 'security';

const LoginPage = () => {
  const [role, setRole] = useState<Role>('admin');
  const [showPassword, setShowPassword] = useState(false);

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
          <p className="login-card__subtext mb-4">Enter your credentials to access your dashboard.</p>

          <form>
            {/* Access Role segmented control */}
            <div className="mb-3">
              <label className="field-label d-block">Access Role</label>
              <div className="role-toggle">
                {(['admin', 'resident', 'security'] as Role[]).map((r) => (
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
              <label className="field-label d-block" htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-with-icon__icon" />
                <input
                  type="email"
                  id="email"
                  className="form-control input-with-icon__control"
                  placeholder="name@society.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="field-label mb-0" htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot?</a>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-with-icon__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control input-with-icon__control input-with-icon__control--with-trailing"
                  placeholder="••••••••"
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
            <button type="submit" className="signin-btn w-100">
              SIGN IN TO PORTAL
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;