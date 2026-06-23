import { Link } from 'react-router-dom';
import { Mail, Home, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const {
    email,
    setEmail,
    isLoading,
    isSubmitted,
    error,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="fp-page d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="fp-container w-100">

        {/* ── Brand ── */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div className="fp-brand__box d-flex align-items-center justify-content-center">
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="fp-brand__name">Civic Horizon</span>
          </div>
        </div>

        <div className="fp-card">
          {isSubmitted ? (

            /* ── Success state ── */
            <div className="fp-success">
              <div className="fp-success__icon-box">
                <Mail size={28} strokeWidth={1.75} />
              </div>
              <h2 className="fp-card__heading mb-1">Check your email</h2>
              <p className="fp-card__subtext mb-4">
                If an account exists for <strong>{email}</strong>, we've sent
                a password reset link. Check your inbox and spam folder.
              </p>
              <p className="fp-success__note">
                The link expires in <strong>30 minutes</strong>.
              </p>
              <Link to="/login" className="fp-back-link mt-4">
                <ArrowLeft size={16} strokeWidth={2} />
                Back to login
              </Link>
            </div>

          ) : (

            /* ── Form state ── */
            <>
              <h2 className="fp-card__heading mb-1">Forgot password?</h2>
              <p className="fp-card__subtext mb-4">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>

                {/* Error */}
                {error && (
                  <div className="fp-error mb-3">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
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
                      autoComplete="email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="fp-submit-btn w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Sending...
                    </>
                  ) : (
                    'SEND RESET LINK'
                  )}
                </button>

                {/* Back to login */}
                <div className="text-center">
                  <Link to="/login" className="fp-back-link">
                    <ArrowLeft size={16} strokeWidth={2} />
                    Back to login
                  </Link>
                </div>

              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;