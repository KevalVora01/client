import { useState } from "react";
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
    <form className="card bg-white border border-light-subtle rounded-3 p-4 h-100 shadow-sm" onSubmit={handleSubmit}>
      
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
          <div className="d-flex flex-column gap-1">
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              Current password
            </label>
            <div className="input-group">
              <input
                type={showCurrent ? "text" : "password"}
                className="form-control text-dark bg-white shadow-none border-end-0"
                style={{ height: '36px', fontSize: '0.875rem', borderColor: '#e9ecef', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                className="btn btn-outline-secondary d-flex align-items-center bg-white shadow-none border-start-0"
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ borderColor: '#e9ecef', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              >
                <i className={`bi ${showCurrent ? "bi-eye-slash-fill" : "bi-eye-fill"} text-muted`} />
              </button>
            </div>
          </div>
        </div>

        {/* New Password Field */}
        <div className="col-12">
          <div className="d-flex flex-column gap-1">
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              New password
            </label>
            <div className="input-group">
              <input
                type={showNew ? "text" : "password"}
                className="form-control text-dark bg-white shadow-none border-end-0"
                style={{ height: '36px', fontSize: '0.875rem', borderColor: '#e9ecef', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
              />
              <button
                className="btn btn-outline-secondary d-flex align-items-center bg-white shadow-none border-start-0"
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ borderColor: '#e9ecef', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              >
                <i className={`bi ${showNew ? "bi-eye-slash-fill" : "bi-eye-fill"} text-muted`} />
              </button>
            </div>
          </div>
        </div>

        {/* Confirm New Password Field */}
        <div className="col-12">
          <div className="d-flex flex-column gap-1">
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              Confirm new password
            </label>
            <div className="input-group">
              <input
                type={showConfirm ? "text" : "password"}
                className={`form-control text-dark bg-white shadow-none border-end-0 ${matchError ? "is-invalid border-end-0" : ""}`}
                style={{ height: '36px', fontSize: '0.875rem', borderColor: matchError ? '#dc2626' : '#e9ecef', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
              <button
                className={`btn d-flex align-items-center bg-white shadow-none border-start-0 ${matchError ? "btn-outline-danger" : "btn-outline-secondary"}`}
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ borderColor: matchError ? '#dc2626' : '#e9ecef', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              >
                <i className={`bi ${showConfirm ? "bi-eye-slash-fill" : "bi-eye-fill"} ${matchError ? "text-danger" : "text-muted"}`} />
              </button>
            </div>
            {matchError && (
              <span className="text-danger mt-1 small" style={{ fontSize: '0.75rem' }}>
                {matchError}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ── Card Footer ── */}
      <div className="d-flex align-items-center justify-content-end mt-4 pt-2">
        <button 
          type="submit" 
          className="btn btn-dark d-inline-flex align-items-center gap-2" 
          disabled={loading}
          style={{ height: '36px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Updating...
            </>
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