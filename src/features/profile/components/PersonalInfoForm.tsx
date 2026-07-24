import { useState } from "react";
import { Mail, Phone, User } from 'lucide-react';
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
    <form className="card bg-white border border-light-subtle rounded-3 p-3 p-sm-4 h-100 shadow-sm" onSubmit={handleSubmit}>

      {/* ── Card Header (.pf-card__head) ── */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-4">
        {/* .pf-card__title */}
        <h5 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
          <i className="bi bi-person text-secondary" />
          <span className="ms-1">Personal info</span>
        </h5>
      </div>

      {/* ── Form Inputs Grid (.pf-form-grid) ── */}
      <div className="row g-3">

        {/* Full Name Field */}
        <div className="col-12 col-md-6">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="fullName"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            Full name
          </label>
          <div className="position-relative d-flex align-items-center">
            <User
              size={18}
              className="position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

        {/* Phone Field */}
        <div className="col-12 col-md-6">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="phone"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            Phone
          </label>
          <div className="position-relative d-flex align-items-center">
            <Phone
              size={18}
              className="position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type="text"
              id="phone"
              placeholder="10 digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

        {/* Email Address Field (.pf-field--full -> col-12) */}
        <div className="col-12">
          <label
            className="d-block fw-bold text-uppercase mb-2"
            htmlFor="email"
            style={{ fontSize: "0.72rem", letterSpacing: "0.06em", color: "#374151" }}
          >
            Email address
          </label>
          <div className="position-relative d-flex align-items-center">
            <Mail
              size={18}
              className="position-absolute"
              style={{ left: "14px", color: "#9ca3af" }}
            />
            <input
              type="text"
              id="email"
              placeholder="Email address"
              value={user.email}
              readOnly
              className="form-control shadow-none border bg-light text-muted"
              style={{
                paddingLeft: "42px",
                height: "46px",
                backgroundColor: "#f9fafb",
                borderColor: "#e5e7eb",
                fontSize: "0.95rem",
                borderRadius: "8px",
                cursor: "not-allowed"
              }}
            />
          </div>
          <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
            Email cannot be changed. Contact support if needed.
          </div>
        </div>

      </div>

      {/* ── Card Footer (.pf-card__footer) ── */}
      <div className="d-flex align-items-center justify-content-end mt-4 pt-2">
        {/* .pf-btn .pf-btn--primary */}
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
              <i className="bi bi-floppy" /> Save changes
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default PersonalInfoForm;