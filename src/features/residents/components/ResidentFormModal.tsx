import type { ResidentFormModalProps } from "../../types/resident.types";
import { useResidentForm } from "../../hooks/useResidentForm";
import ApartmentSelect from "../../../apartments/components/ApartmentSelect";

const ResidentFormModal = ({ show, mode, resident, loading, onClose, onSubmit }: ResidentFormModalProps) => {
  const { isEdit, formik, handleClose, setApartmentId } =
    useResidentForm({ show, mode, resident, onSubmit, onClose });

  if (!show) return null;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* ── Header ── */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: "1rem", color: "#1a1f36" }}>
                {isEdit ? `Edit Resident — ${resident?.user.name}` : "Add New Resident"}
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: "0.8rem" }}>
                {isEdit ? "Update the resident's details below." : "Fill in the details to create a resident account."}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-white border border-light-subtle rounded-2 d-flex align-items-center justify-content-center p-0 text-muted"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
              style={{ width: "30px", height: "30px", fontSize: "1.1rem" }}
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body px-4 py-3">

              {/* ── User Account ── */}
              <p className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                User Account
              </p>
              <div className="row g-3 mb-3">

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Full name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.touched.name && formik.errors.name ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.name}</div>
                  )}
                </div>

                {/* Email — add only */}
                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small mb-1">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={`form-control shadow-none rounded-2 text-dark ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter email address"
                      value={formik.values.email ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        fontSize: "0.875rem",
                        borderColor: formik.touched.email && formik.errors.email ? "#dc3545" : "#e5e7eb"
                      }}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.email}</div>
                    )}
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1">Phone <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    autoComplete="phone"
                    className={`form-control shadow-none rounded-2 text-dark ${formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}`}
                    placeholder="Enter 10-digit phone number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{
                      fontSize: "0.875rem",
                      borderColor: formik.touched.phone && formik.errors.phone ? "#dc3545" : "#e5e7eb"
                    }}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.phone}</div>
                  )}
                </div>

                {/* Password — add only */}
                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small mb-1">Password <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      className={`form-control shadow-none rounded-2 text-dark ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                      placeholder="Min 8 characters"
                      value={formik.values.password ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        fontSize: "0.875rem",
                        borderColor: formik.touched.password && formik.errors.password ? "#dc3545" : "#e5e7eb"
                      }}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>{formik.errors.password}</div>
                    )}
                  </div>
                )}

              </div>

              <hr className="border-light-subtle my-3" />

              {/* ── Resident Details ── */}
              <p className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                Resident Details
              </p>
              <div className="row g-3">

                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small mb-1">Apartment</label>
                    <ApartmentSelect
                      value={formik.values.apartmentId ?? 0}
                      onChange={async (id) => {
                        setApartmentId(id);
                        await formik.setFieldValue('apartmentId', id, true);
                        formik.setFieldTouched('apartmentId', true, true);
                      }}
                      error={formik.touched.apartmentId && formik.errors.apartmentId
                        ? String(formik.errors.apartmentId)
                        : undefined}
                    />
                  </div>
                )}

                {isEdit && resident?.apartment && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small mb-1">Apartment</label>
                    <input
                      type="text"
                      className="form-control rfm-input"
                      value={`${resident.apartment.block}-${resident.apartment.floorNumber}${resident.apartment.unitNumber}`}
                      readOnly
                      disabled
                    />
                  </div>
                )}

                {/* Move-out date — edit only */}
                {isEdit && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-secondary small mb-1">Move-out date</label>
                    <input
                      type="date"
                      name="moveOutDate"
                      className="form-control shadow-none rounded-2 text-dark"
                      value={formik.values.moveOutDate ?? ""}
                      onChange={formik.handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      style={{
                        fontSize: "0.875rem",
                        borderColor: formik.touched.moveOutDate && formik.errors.moveOutDate ? "#dc3545" : "#e5e7eb"
                      }}
                    />
                    {formik.touched.moveOutDate && formik.errors.moveOutDate && (
                      <div className="text-danger small mt-1">{formik.errors.moveOutDate}</div>
                    )}
                    {formik.values.moveOutDate && (
                      <div className="d-flex align-items-center gap-1 mt-2 small" style={{ color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '6px 10px' }}>
                        <i className="bi bi-exclamation-triangle" />
                        Setting a move-out date will deactivate this resident and free their apartment.
                      </div>
                    )}
                  </div>
                )}

                {/* Owner checkbox */}
                <div className="col-12 mt-4">
                  <div className="form-check d-flex align-items-center gap-2 m-0 p-0">
                    <input
                      type="checkbox"
                      name="isOwner"
                      id={isEdit ? "isOwnerEdit" : "isOwner"}
                      className="form-check-input rounded border-light-subtle m-0 shadow-none position-static"
                      checked={formik.values.isOwner ?? false}
                      onChange={formik.handleChange}
                      style={{
                        width: "1.25em",
                        height: "1.25em",
                        backgroundColor: formik.values.isOwner ? "#1a1f36" : "",
                        borderColor: formik.values.isOwner ? "#1a1f36" : ""
                      }}
                    />
                    <label className="form-check-label small text-secondary" htmlFor={isEdit ? "isOwnerEdit" : "isOwner"} style={{ cursor: "pointer" }}>
                      This resident is an owner
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Footer ── */}
            <div className="modal-footer border-top border-light-subtle px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
                onClick={handleClose}
                disabled={loading}
                style={{ height: "38px", fontSize: "0.875rem" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn text-white fw-medium px-3 d-inline-flex align-items-center"
                disabled={loading}
                style={{
                  height: "38px",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  backgroundColor: "#1a1f36",
                  borderColor: "#1a1f36",
                  opacity: loading ? 0.55 : 1
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEdit ? "bi-check-lg" : "bi-person-plus"} me-1`} />
                    {isEdit ? "Save Changes" : "Create Resident"}
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

export default ResidentFormModal;