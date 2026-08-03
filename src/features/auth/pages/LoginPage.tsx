import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const LoginPage = () => {
  const {
    identifier, setIdentifier,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-tertiary px-3 py-4">
      <div className="w-100" style={{ maxWidth: "480px" }}>

        {/* Brand */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{ width: "38px", height: "38px", backgroundColor: "#111827" }}
            >
              <Home size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <span className="fw-bold fs-5" style={{ color: "#111827" }}>
              Civic Horizon
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-4 p-sm-5 rounded-4 shadow-sm border-0">
          <h2 className="fw-bold fs-3 mb-1" style={{ color: "#111827" }}>Welcome Back</h2>
          <p className="text-body-secondary mb-4">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email or Mobile */}
            <div className="mb-3">
              <label
                htmlFor="identifier"
                className="form-label fw-bold text-uppercase mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
              >
                Email or Mobile Number
              </label>
              <div className="position-relative">
                <Mail
                  size={18}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 pe-none"
                  style={{ color: "#9ca3af" }}
                />
                <input
                  type="text"
                  id="identifier"
                  placeholder="Email or Phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isLoading}
                  className="form-control ps-5 py-3 shadow-none"
                  style={{
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
                  htmlFor="password"
                  className="fw-bold text-uppercase mb-0"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="fw-semibold text-decoration-none"
                  style={{ fontSize: "0.85rem", color: "#1f2937" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#111827"; e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#1f2937"; e.currentTarget.style.textDecoration = "none"; }}
                >
                  Forgot?
                </Link>
              </div>
              <div className="position-relative">
                <Lock
                  size={18}
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 pe-none"
                  style={{ color: "#9ca3af" }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="form-control ps-5 pe-5 py-3 shadow-none"
                  style={{
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
                  className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent p-2 pe-3 d-flex align-items-center justify-content-center"
                  style={{ color: "#9ca3af", cursor: "pointer" }}
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
              className="btn w-100 fw-bold py-3 d-flex align-items-center justify-content-center border-0"
              style={{
                backgroundColor: isLoading ? "#4b5563" : "#111827",
                color: "#ffffff",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#1f2937";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#111827";
                }
              }}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm mx-auto" role="status" aria-hidden="true" />
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
