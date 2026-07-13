import { useState } from "react";
import type { ProfileUser, UpdateProfilePayload } from "../types/profile.types";

interface PersonalInfoFormProps {
  user: ProfileUser;
  loading: boolean;
  onSubmit: (payload: UpdateProfilePayload) => Promise<boolean>;
}

const PersonalInfoForm = ({ user, loading, onSubmit }: PersonalInfoFormProps) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, phone });
  };

  return (
    // .pf-card -> card, border, white bg, rounded-3 (12px), custom padding match
    <form className="card bg-white border border-light-subtle rounded-3 p-4 h-100 shadow-sm" onSubmit={handleSubmit}>

      {/* ── Card Header (.pf-card__head) ── */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
        {/* .pf-card__title */}
        <h5 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
          <i className="bi bi-person text-secondary" /> Personal info
        </h5>
      </div>

      {/* ── Form Inputs Grid (.pf-form-grid) ── */}
      <div className="row g-3">

        {/* Full Name Field */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column gap-1">
            {/* .pf-field label styling */}
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              Full name
            </label>
            <input
              type="text"
              className="form-control text-dark bg-white"
              style={{ height: '36px', fontSize: '0.875rem' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column gap-1">
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              Phone
            </label>
            <input
              type="text"
              className="form-control text-dark bg-white"
              style={{ height: '36px', fontSize: '0.875rem' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 digit number"
              required
            />
          </div>
        </div>

        {/* Email Address Field (.pf-field--full -> col-12) */}
        <div className="col-12">
          <div className="d-flex flex-column gap-1">
            <label className="text-uppercase text-muted fw-semibold tracking-wider small" style={{ fontSize: '0.68rem' }}>
              Email address
            </label>
            <input
              type="text"
              className="form-control bg-light text-muted"
              style={{ height: '36px', fontSize: '0.875rem', cursor: 'not-allowed' }}
              value={user.email}
              readOnly
            />
            {/* .pf-field__hint */}
            <span className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
              Email cannot be changed. Contact support if needed.
            </span>
          </div>
        </div>

      </div>

      {/* ── Card Footer (.pf-card__footer) ── */}
      <div className="d-flex align-items-center justify-content-end mt-4 pt-2">
        {/* .pf-btn .pf-btn--primary */}
        <button
          type="submit"
          className="btn btn-dark d-inline-flex align-items-center gap-2"
          disabled={loading}
          style={{ height: '36px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm mx-auto" role="status" aria-hidden="true" />
          ) : (
            <>
              <i className="bi bi-floppy" /> Save changes
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default PersonalInfoForm;