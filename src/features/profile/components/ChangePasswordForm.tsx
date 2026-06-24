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
    <form className="pf-card" onSubmit={handleSubmit}>
      <div className="pf-card__head">
        <div className="pf-card__title">
          <i className="bi bi-lock" /> Change password
        </div>
      </div>

      <div className="pf-form-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="pf-field">
          <label>Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>
        <div className="pf-field">
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
        </div>
        <div className="pf-field">
          <label>Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />
          {matchError && <span className="pf-field__error">{matchError}</span>}
        </div>
      </div>

      <div className="pf-card__footer" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" className="pf-btn pf-btn--primary" disabled={loading}>
          {loading
            ? <><span className="pf-spinner" /> Updating...</>
            : <><i className="bi bi-lock-fill" /> Update password</>
          }
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;