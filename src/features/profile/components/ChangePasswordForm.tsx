import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from 'lucide-react';
import type { ChangePasswordPayload } from "../types/profile.types";

interface ChangePasswordFormProps {
  loading: boolean;
  onSubmit: (payload: ChangePasswordPayload) => Promise<boolean>;
}

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .min(1, "Current password is required")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "must contain at least one uppercase letter")
    .matches(/[0-9]/, "must contain at least one number")
    .matches(/[\W_]/, "must contain at least one special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], "Passwords do not match")
    .required("Please confirm your password"),
});

const ChangePasswordForm = ({ loading, onSubmit }: ChangePasswordFormProps) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const success = await onSubmit({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (success) {
        resetForm();
      }
    },
  });

  return (
    <form className="card bg-white border border-light-subtle rounded-3 p-3 p-sm-4 h-100 shadow-sm" onSubmit={formik.handleSubmit}>

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
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-control shadow-none border ${formik.touched.currentPassword && formik.errors.currentPassword ? "border-danger" : ""}`}
              style={{
                paddingLeft: "42px",
                height: "46px",
                backgroundColor: "#f9fafb",
                borderColor: formik.touched.currentPassword && formik.errors.currentPassword ? "#dc2626" : "#e5e7eb",
                fontSize: "0.95rem",
                borderRadius: "8px"
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = formik.touched.currentPassword && formik.errors.currentPassword ? "#dc2626" : "#111827";
                e.target.style.boxShadow = formik.touched.currentPassword && formik.errors.currentPassword ? "0 0 0 3px rgba(220, 38, 38, 0.1)" : "0 0 0 3px rgba(17, 24, 39, 0.1)";
              }}
              onBlurCapture={(e) => {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = formik.touched.currentPassword && formik.errors.currentPassword ? "#dc2626" : "#e5e7eb";
                e.target.style.boxShadow = "none";
                formik.handleBlur(e);
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
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <span className="text-danger mt-1 small d-block" style={{ fontSize: '0.75rem' }}>
              {formik.errors.currentPassword}
            </span>
          )}
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
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-control shadow-none border ${formik.touched.newPassword && formik.errors.newPassword ? "border-danger" : ""}`}
              style={{
                paddingLeft: "42px",
                height: "46px",
                backgroundColor: "#f9fafb",
                borderColor: formik.touched.newPassword && formik.errors.newPassword ? "#dc2626" : "#e5e7eb",
                fontSize: "0.95rem",
                borderRadius: "8px"
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = formik.touched.newPassword && formik.errors.newPassword ? "#dc2626" : "#111827";
                e.target.style.boxShadow = formik.touched.newPassword && formik.errors.newPassword ? "0 0 0 3px rgba(220, 38, 38, 0.1)" : "0 0 0 3px rgba(17, 24, 39, 0.1)";
              }}
              onBlurCapture={(e) => {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = formik.touched.newPassword && formik.errors.newPassword ? "#dc2626" : "#e5e7eb";
                e.target.style.boxShadow = "none";
                formik.handleBlur(e);
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
          {formik.touched.newPassword && formik.errors.newPassword && (
            <span className="text-danger mt-1 small d-block" style={{ fontSize: '0.75rem' }}>
              {formik.errors.newPassword}
            </span>
          )}
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
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-control shadow-none border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-danger" : ""}`}
              style={{
                paddingLeft: "42px",
                paddingRight: "42px",
                height: "46px",
                backgroundColor: "#f9fafb",
                borderColor: formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc2626" : "#e5e7eb",
                fontSize: "0.95rem",
                borderRadius: "8px"
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc2626" : "#111827";
                e.target.style.boxShadow = formik.touched.confirmPassword && formik.errors.confirmPassword ? "0 0 0 3px rgba(220, 38, 38, 0.1)" : "0 0 0 3px rgba(17, 24, 39, 0.1)";
              }}
              onBlurCapture={(e) => {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc2626" : "#e5e7eb";
                e.target.style.boxShadow = "none";
                formik.handleBlur(e);
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="position-absolute border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
              style={{ right: "12px", color: formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc2626" : "#9ca3af", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={(e) => e.currentTarget.style.color = formik.touched.confirmPassword && formik.errors.confirmPassword ? "#dc2626" : "#9ca3af"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span className="text-danger mt-1 small d-block" style={{ fontSize: '0.75rem' }}>
              {formik.errors.confirmPassword}
            </span>
          )}
        </div>

      </div>

      {/* ── Card Footer ── */}
      <div className="d-flex align-items-center justify-content-end mt-4 pt-2">
        <button
          type="submit"
          className="btn btn-dark d-inline-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
          disabled={loading || formik.isSubmitting}
          style={{ height: '36px', fontSize: '0.875rem', fontWeight: '500', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
        >
          {loading || formik.isSubmitting ? (
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
