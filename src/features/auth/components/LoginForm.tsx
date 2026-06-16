import { useState, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import type { LoginPayload, UserRole } from '../types/auth.types';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => Promise<void>;
  isLoading: boolean;
}

type Role = UserRole;

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password, role });
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Access Role */}
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

      {/* Keep me logged in */}
      <div className="form-check mb-4">
        <input
          type="checkbox"
          className="form-check-input keep-logged-in"
          id="keepLoggedIn"
        />
        <label className="form-check-label keep-logged-in__label" htmlFor="keepLoggedIn">
          Keep me logged in
        </label>
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
  );
};

export default LoginForm;