import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
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
          <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#111827" }}>Welcome Back</h2>
          <p className="mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Access Role */}
            <div className="mb-3">
              <label 
                className="d-block fw-bold text-uppercase mb-2" 
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
              >
                Access Role
              </label>
              <div className="d-flex p-1 gap-1 border rounded-3" style={{ backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" }}>
                {(['admin', 'resident', 'security'] as UserRole[]).map((r) => {
                  const isActive = role === r;
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className="flex-grow-1 border-0 py-2 rounded-2 transition-all"
                      style={{
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? "#ffffff" : "transparent",
                        color: isActive ? "#111827" : "#6b7280",
                        boxShadow: isActive ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                      }}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
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
                  required
                  disabled={isLoading}
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

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label 
                  className="fw-bold text-uppercase m-0" 
                  htmlFor="password"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
                >
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="fw-semibold text-decoration-none"
                  style={{ fontSize: "0.85rem", color: "#1f2937" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#111827";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#1f2937";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <div className="position-relative d-flex align-items-center">
                <Lock 
                  size={18} 
                  className="position-absolute pe-none" 
                  style={{ left: "14px", color: "#9ca3af" }} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="form-control shadow-none border"
                  style={{
                    paddingLeft: "42px",
                    paddingRight: "42px",
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
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
                  style={{ right: "12px", color: "#9ca3af", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn w-100 fw-bold border d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: isLoading ? "#4b5563" : "#111827",
                borderColor: isLoading ? "#4b5563" : "#111827",
                color: "#ffffff",
                height: "50px",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer"
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