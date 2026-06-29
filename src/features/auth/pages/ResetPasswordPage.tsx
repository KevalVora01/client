import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Home, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '../hooks/useResetPassword';

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

  // Shared interactive states for input focus/blur handling
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = "#ffffff";
    e.target.style.borderColor = "#111827";
    e.target.style.boxShadow = "0 0 0 3px rgba(17, 24, 39, 0.1)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = "#f9fafb";
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  // Base shared styles
  const labelStyle = { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", color: "#374151" };
  const inputStyle = { paddingLeft: "42px", paddingRight: "42px", height: "46px", backgroundColor: "#f9fafb", borderColor: "#e5e7eb", fontSize: "0.95rem", borderRadius: "8px" };
  const submitStyle = { backgroundColor: isLoading ? "#4b5563" : "#111827", borderColor: isLoading ? "#4b5563" : "#111827", color: "#ffffff", height: "50px", fontSize: "0.85rem", letterSpacing: "0.08em", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer", transition: "background-color 0.15s ease" };
  const linkStyle = { fontSize: "0.875rem", color: "#374151", transition: "color 0.15s ease" };

  // ── Render Case 1: Token is Invalid or Missing ──
  if (!token) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ backgroundColor: "#f3f4f6" }}>
        <div className="w-100" style={{ maxWidth: "480px" }}>
          <div className="bg-white p-4 p-sm-5 rounded-3 border-0 text-center" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06)" }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "64px", height: "64px", backgroundColor: "#fef2f2", color: "#dc2626" }}>
              <Lock size={28} strokeWidth={1.75} />
            </div>
            <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#111827" }}>Invalid reset link</h2>
            <p className="mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>This password reset link is invalid or has expired. Please request a new one.</p>
            <Link to="/forgot-password" className="btn w-100 fw-bold border d-inline-flex align-items-center justify-content-center text-decoration-none mb-3" style={{ ...submitStyle, backgroundColor: "#111827" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1f2937"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#111827"; }}>
              REQUEST NEW LINK
            </Link>
            <div>
              <Link to="/login" className="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.color = "#111827"} onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}>
                <ArrowLeft size={16} strokeWidth={2} /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Case 2: Token Active / Change Password Form ──
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="w-100" style={{ maxWidth: "480px" }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: "38px", height: "38px", backgroundColor: "#111827" }}>
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="fw-bold" style={{ fontSize: "1.3rem", color: "#111827" }}>Civic Horizon</span>
          </div>
        </div>

        <div className="bg-white p-4 p-sm-5 rounded-3 border-0" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.06)" }}>
          <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#111827" }}>Set new password</h2>
          <p className="mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>Your new password must be at least 8 characters and contain an uppercase letter, a number, and a special character.</p>

          <form onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="mb-3">
              <label className="d-block text-uppercase mb-2" htmlFor="newPassword" style={labelStyle}>New Password</label>
              <div className="position-relative d-flex align-items-center">
                <Lock size={18} className="position-absolute pe-none" style={{ left: "14px", color: "#9ca3af" }} />
                <input type={showPassword ? 'text' : 'password'} id="newPassword" placeholder="Min 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} className="form-control shadow-none border" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center" style={{ right: "12px", color: "#9ca3af" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="d-block text-uppercase mb-2" htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <div className="position-relative d-flex align-items-center">
                <Lock size={18} className="position-absolute pe-none" style={{ left: "14px", color: "#9ca3af" }} />
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="form-control shadow-none border" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required />
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center" style={{ right: "12px", color: "#9ca3af" }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Action Submit Button */}
            <button type="submit" disabled={isLoading} className="btn w-100 fw-bold border d-flex align-items-center justify-content-center mb-3" style={submitStyle} onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#1f2937"; }} onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#111827"; }}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Resetting...
                </>
              ) : 'RESET PASSWORD'}
            </button>

            {/* Back Link */}
            <div className="text-center">
              <Link to="/login" className="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.color = "#111827"} onMouseLeave={(e) => e.currentTarget.style.color = "#374151"}>
                <ArrowLeft size={16} strokeWidth={2} /> Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;