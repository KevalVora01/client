import { Link } from 'react-router-dom';
import { Mail, Home, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '../../hooks/useForgotPassword';

const ForgotPasswordPage = () => {
  const {
    email,
    setEmail,
    isLoading,
    isSubmitted,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="w-100" style={{ maxWidth: "480px" }}>

        {/* ── Brand ── */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{ width: "38px", height: "38px", backgroundColor: "#111827" }}
            >
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="fw-bold" style={{ fontSize: "1.3rem", color: "#111827" }}>
              Civic Horizon
            </span>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white p-4 p-sm-5 rounded-3 border-0" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06)" }}>
          {isSubmitted ? (

            /* ── Success state ── */
            <div className="d-flex flex-column align-items-center text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "64px", height: "64px", backgroundColor: "#eff6ff", color: "#2563eb" }}
              >
                <Mail size={28} strokeWidth={1.75} />
              </div>
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#111827" }}>Check your email</h2>
              <p className="mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                If an account exists for <strong>{email}</strong>, we've sent
                a password reset link. Check your inbox and spam folder.
              </p>
              <p
                className="m-0 border rounded-2 px-3 py-2 text-secondary"
                style={{ fontSize: "0.85rem", backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
              >
                The link expires in <strong>10 minutes</strong>.
              </p>
              <Link
                to="/login"
                className="d-inline-flex align-items-center gap-2 mt-4 fw-semibold text-decoration-none"
                style={{ fontSize: "0.875rem", color: "#374151", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#111827"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back to login
              </Link>
            </div>

          ) : (

            /* ── Form state ── */
            <>
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#111827" }}>Forgot password?</h2>
              <p className="mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-4">
                  <label
                    className="d-block fw-bold text-uppercase mb-2"
                    htmlFor="email"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
                  >
                    Email Address
                  </label>
                  <div className="position-relative d-flex align-items-center">
                    <Mail
                      size={18}
                      className="position-absolute pe-none"
                      style={{ left: "14px", color: "#9ca3af" }}
                    />
                    <input
                      type="email"
                      id="email"
                      placeholder="name@society.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoading}
                      required
                      className="form-control shadow-none border"
                      style={{
                        paddingLeft: "42px",
                        height: "46px",
                        backgroundColor: "#f9fafb",
                        borderColor: "#e5e7eb",
                        fontSize: "0.95rem",
                        borderRadius: "8px"
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.borderColor = "#111827";
                        e.target.style.boxShadow = "0 0 0 3px rgba(17, 24, 39, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = "#f9fafb";
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn w-100 fw-bold border d-flex align-items-center justify-content-center mb-3"
                  style={{
                    backgroundColor: isLoading ? "#4b5563" : "#111827",
                    borderColor: isLoading ? "#4b5563" : "#111827",
                    color: "#ffffff",
                    height: "50px",
                    fontSize: "0.85rem",
                    letterSpacing: "0.08em",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#1f2937";
                      e.currentTarget.style.borderColor = "#1f2937";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#111827";
                      e.currentTarget.style.borderColor = "#111827";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    'SEND RESET LINK'
                  )}
                </button>

                {/* Back to login Link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none"
                    style={{ fontSize: "0.875rem", color: "#374151", transition: "color 0.15s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#111827"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}
                  >
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