import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { visitorApi } from '../api/visitorApi';
import { showError, showSuccess } from '../../../utils/toast';

interface PreRegisterVisitorModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().min(1, 'Visitor name is required').required('Visitor name is required'),
  phone: Yup.string().trim().length(10, 'Phone must be exactly 10 digits').matches(/^\d+$/, 'Phone must contain only numbers').required('Phone is required'),
  purpose: Yup.string().trim().min(1, 'Purpose of visit is required').required('Purpose of visit is required'),
  expectedAt: Yup.date().typeError('Expected date is required').min(new Date(new Date().setHours(0, 0, 0, 0)), 'Date cannot be in the past').required('Expected date is required'),
  vehicleNumber: Yup.string().trim().max(20, 'Must be at most 20 characters').optional(),
});

export const PreRegisterVisitorModal: React.FC<PreRegisterVisitorModalProps> = ({ show, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      purpose: '',
      expectedAt: '',
      vehicleNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        await visitorApi.preRegister({
            name: values.name.trim(),
            phone: values.phone.trim(),
            purpose: values.purpose.trim(),
            expectedAt: new Date(values.expectedAt + 'T00:00:00').toISOString(),
            vehicleNumber: values.vehicleNumber.trim() || undefined,
          });

        showSuccess('Visitor pre-registered successfully!');
        window.dispatchEvent(new CustomEvent('visitor-updated'));
        onSuccess();
        onClose();
        formik.resetForm();
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        showError(axiosError?.response?.data?.message || 'Failed to pre-register visitor');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!show) return null;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ backdropFilter: "blur(4px)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* ── Header ── */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: "1rem", color: "#1a1f36" }}>
                Pre-Register Expected Visitor
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: "0.8rem" }}>
                Fill in details for expected guest entry approval.
              </p>
            </div>

            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body px-4 py-3">

              {/* ── Visitor Details ── */}
              <p className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                Visitor Details
              </p>
              <div className="row g-3 mb-3">

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Visitor Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter visitor full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.values.name.length > 100 ? "#dc3545" : formik.touched.name && formik.errors.name ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.name}</div>
                  ) : formik.values.name.length > 100 ? (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '0.78rem' }}>Maximum 100 characters allowed.</small>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Phone Number <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}`}
                    placeholder="Enter 10-digit mobile number"
                    value={formik.values.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      formik.setFieldValue('phone', val);
                    }}
                    onBlur={formik.handleBlur}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.values.phone.length > 10 ? "#dc3545" : formik.touched.phone && formik.errors.phone ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.phone}</div>
                  ) : formik.values.phone.length > 10 ? (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '0.78rem' }}>Maximum 10 digits allowed.</small>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Purpose of Visit <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="purpose"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.touched.purpose && formik.errors.purpose ? "is-invalid" : ""}`}
                    placeholder="e.g. Guest, Delivery, Service"
                    value={formik.values.purpose}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.values.purpose.length > 150 ? "#dc3545" : formik.touched.purpose && formik.errors.purpose ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.touched.purpose && formik.errors.purpose ? (
                    <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.purpose}</div>
                  ) : formik.values.purpose.length > 150 ? (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '0.78rem' }}>Maximum 150 characters allowed.</small>
                  ) : null}
                </div>

                <div className="col-md-6">
                  <DatePicker
                    label="Expected Date"
                    name="expectedAt"
                    required
                    minDate={new Date().toISOString().slice(0, 10)}
                    value={formik.values.expectedAt}
                    onChange={(e) => {
                      const val = typeof e === 'string' ? e : e?.target?.value;
                      formik.setFieldValue('expectedAt', val);
                    }}
                    onBlur={() => formik.setFieldTouched('expectedAt', true)}
                    error={formik.errors.expectedAt as string | undefined}
                    touched={formik.touched.expectedAt as boolean | undefined}
                    style={{ height: '40px' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Vehicle Plate Number <span className="text-muted fw-normal">(Optional)</span></label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.values.vehicleNumber.length > 20 ? "is-invalid" : ""}`}
                    placeholder="e.g. MH 12 AB 1234"
                    value={formik.values.vehicleNumber}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.values.vehicleNumber.length > 20 ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.values.vehicleNumber.length > 20 && (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '0.78rem' }}>Maximum 20 characters allowed.</small>
                  )}
                </div>

              </div>

            </div>

            {/* ── Footer ── */}
            <div className="modal-footer border-top border-light-subtle px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
                onClick={onClose}
                style={{ height: "38px", fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center"
                disabled={submitting}
                style={{
                  height: "38px",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  opacity: submitting ? 0.55 : 1
                }}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm mx-auto" role="status" />
                ) : (
                  <>
                    <i className="bi bi-person-plus me-1" />
                    Register Visitor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreRegisterVisitorModal;
