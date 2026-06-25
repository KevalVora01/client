import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Home, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '../../hooks/useResetPassword';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const {
    token,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    handleSubmit,
  } = useResetPassword();

  // no token in url — show invalid state
  if (!token) {
    return (
      <div className="rp-page d-flex align-items-center justify-content-center min-vh-100 px-3">
        <div className="rp-container w-100">
          <div className="rp-card text-center">
            <div className="rp-invalid__icon-box mx-auto mb-3">
              <Lock size={28} strokeWidth={1.75} />
            </div>
            <h2 className="rp-card__heading mb-1">Invalid reset link</h2>
            <p className="rp-card__subtext mb-4">
              This password reset link is invalid or has expired.
              Please request a new one.
            </p>
            <Link to="/forgot-password" className="rp-submit-btn text-decoration-none text-center w-100 mb-3">
              REQUEST NEW LINK
            </Link>
            <div className="text-center">
              <Link to="/login" className="rp-back-link">
                <ArrowLeft size={16} strokeWidth={2} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-page d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="rp-container w-100">

        {/* ── Brand ── */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div className="rp-brand__box d-flex align-items-center justify-content-center">
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="rp-brand__name">Civic Horizon</span>
          </div>
        </div>

        <div className="rp-card">
          <h2 className="rp-card__heading mb-1">Set new password</h2>
          <p className="rp-card__subtext mb-4">
            Your new password must be at least 8 characters and contain
            an uppercase letter, a number, and a special character.
          </p>

          <form onSubmit={handleSubmit}>

            {/* New password */}
            <div className="mb-3">
              <label className="field-label d-block" htmlFor="newPassword">
                New Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-with-icon__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="form-control input-with-icon__control input-with-icon__control--with-trailing"
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
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

            {/* Confirm password */}
            <div className="mb-4">
              <label className="field-label d-block" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-with-icon__icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-control input-with-icon__control input-with-icon__control--with-trailing"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-with-icon__trailing"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="rp-submit-btn w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Resetting...
                </>
              ) : (
                'RESET PASSWORD'
              )}
            </button>

            {/* Back to login */}
            <div className="text-center">
              <Link to="/login" className="rp-back-link">
                <ArrowLeft size={16} strokeWidth={2} />
                Back to login
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;