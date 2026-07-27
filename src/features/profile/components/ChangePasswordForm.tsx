import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import type { ChangePasswordPayload } from "../types/profile.types";

interface ChangePasswordFormProps {
  loading: boolean;
  onSubmit: (payload: ChangePasswordPayload) => Promise<boolean>;
}

const ChangePasswordForm = ({ loading, onSubmit }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMatchError("Passwords do not match");
      return;
    }
    setMatchError(null);
    const success = await onSubmit({ currentPassword, newPassword });
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <form className="card bg-white border border-light-subtle rounded-3 p-3 p-sm-4 h-100 shadow-sm" onSubmit={handleSubmit}>

      {/* ── Card Header ── */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
        <h5 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
          <i className="bi bi-lock text-secondary" /> Change password
        </h5>
      </div>

      {/* ── Form Inputs Grid ── */}
      <div className="row g-3">

        {/* Current Password Field */}
        <div className="col-12">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="currentPassword"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            Current Password
          </label>
          <div className="position-relative d-flex align-items-center">
            <i
              className="bi bi-lock position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type={showCurrent ? "text" : "password"}
              id="currentPassword"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
              className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
              style={{ right: "12px", color: "#9ca3af", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div className="col-12">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="newPassword"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            New Password
          </label>
          <div className="position-relative d-flex align-items-center">
            <i
              className="bi bi-lock position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type={showNew ? "text" : "password"}
              id="newPassword"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? 'Hide password' : 'Show password'}
              className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
              style={{ right: "12px", color: "#9ca3af", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#4b5563"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Field */}
        <div className="col-12">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="confirmPassword"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            Confirm New Password
          </label>
          <div className="position-relative d-flex align-items-center">
            <i
              className="bi bi-lock position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`form-control shadow-none border ${matchError ? "border-danger" : ""}`}
              style={{
                paddingLeft: "42px",
                paddingRight: "42px",
                height: "46px",
                backgroundColor: "#f9fafb",
                borderColor: matchError ? "#dc2626" : "#e5e7eb",
                fontSize: "0.95rem",
                borderRadius: "8px"
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = matchError ? "#dc2626" : "#111827";
                e.target.style.boxShadow = matchError ? "0 0 0 3px rgba(220, 38, 38, 0.1)" : "0 0 0 3px rgba(17, 24, 39, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = matchError ? "#dc2626" : "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
              style={{ right: "12px", color: matchError ? "#dc2626" : "#9ca3af", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={(e) => e.currentTarget.style.color = matchError ? "#dc2626" : "#9ca3af"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {matchError && (
            <span className="text-danger mt-1 small" style={{ fontSize: '0.75rem' }}>
              {matchError}
            </span>
          )}
        </div>

      </div>

      {/* ── Card Footer ── */}
      <div className="d-flex align-items-center justify-content-end mt-4 pt-2">
        <button
          type="submit"
          className="btn btn-dark d-inline-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
          disabled={loading}
          style={{ height: '36px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm mx-auto" role="status" aria-hidden="true" />
          ) : (
            <>
              <i className="bi bi-lock-fill" /> Update password
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default ChangePasswordForm;