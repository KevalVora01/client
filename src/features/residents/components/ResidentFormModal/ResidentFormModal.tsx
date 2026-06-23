import type { ResidentDetail, CreateResidentPayload, UpdateResidentPayload } from "../../types/resident.types";
import { useResidentForm } from "../../hooks/useResidentForm";
import ApartmentSelect from "../ApartmentSelect/ApartmentSelect";
import "./ResidentFormModal.css";

interface ResidentFormModalProps {
  show: boolean;
  mode: "add" | "edit";
  resident?: ResidentDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateResidentPayload | UpdateResidentPayload, id?: number) => Promise<boolean>;
}

const ResidentFormModal = ({ show, mode, resident, loading, error, onClose, onSubmit }: ResidentFormModalProps) => {
  const { isEdit, form, formErrors, handleChange, setAddField, setEditField, handleSubmit, handleClose } =
    useResidentForm({ show, mode, resident, onSubmit, onClose });

  if (!show) return null;

  const addForm = form as CreateResidentPayload;
  const editForm = form as UpdateResidentPayload;

  return (
    <div className="modal d-block rfm-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content rfm-content">

          {/* ── Header ── */}
          <div className="modal-header rfm-header">
            <div>
              <h5 className="modal-title rfm-title">
                {isEdit ? `Edit Resident — ${resident?.user.name}` : "Add New Resident"}
              </h5>
              <p className="rfm-subtitle mb-0">
                {isEdit ? "Update the resident's details below." : "Fill in the details to create a resident account."}
              </p>
            </div>
            <button className="rfm-close" onClick={handleClose} disabled={loading} aria-label="Close">
              <i className="bi bi-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* ── API error ── */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small">
                  <i className="bi bi-exclamation-circle-fill" /> {error}
                </div>
              )}

              {/* ── User Account ── */}
              <p className="rfm-section-label">User Account</p>
              <div className="row g-3 mb-3">

                <div className="col-md-6">
                  <label className="form-label rfm-label">Full name <span className="text-danger">*</span></label>
                  <input type="text" name="name"
                    className={`form-control rfm-input ${formErrors.name ? "is-invalid" : ""}`}
                    placeholder="Enter full name"
                    value={isEdit ? editForm.name ?? "" : addForm.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                {/* Email — add only */}
                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label rfm-label">Email <span className="text-danger">*</span></label>
                    <input type="email" name="email"
                      className={`form-control rfm-input ${formErrors.email ? "is-invalid" : ""}`}
                      placeholder="Enter email address"
                      value={addForm.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label rfm-label">Phone <span className="text-danger">*</span></label>
                  <input type="text" name="phone"
                    className={`form-control rfm-input ${formErrors.phone ? "is-invalid" : ""}`}
                    placeholder="Enter 10-digit phone number"
                    value={isEdit ? editForm.phone ?? "" : addForm.phone}
                    onChange={handleChange}
                  />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>

                {/* Password — add only */}
                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label rfm-label">Password <span className="text-danger">*</span></label>
                    <input type="password" name="password"
                      className={`form-control rfm-input ${formErrors.password ? "is-invalid" : ""}`}
                      placeholder="Min 8 characters"
                      value={addForm.password}
                      onChange={handleChange}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                  </div>
                )}

              </div>

              <hr className="rfm-divider" />

              {/* ── Resident Details ── */}
              <p className="rfm-section-label">Resident Details</p>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label rfm-label">Apartment</label>
                  <ApartmentSelect
                    value={isEdit ? editForm.apartmentId ?? 0 : addForm.apartmentId}
                    onChange={(val) => isEdit
                      ? setEditField("apartmentId", val)
                      : setAddField("apartmentId", val)
                    }
                    options={[
                      { value: 1, label: "A-101", floor: "Floor 1", block: "Block A" },
                      { value: 2, label: "A-102", floor: "Floor 1", block: "Block A" },
                      { value: 3, label: "C-201", floor: "Floor 2", block: "Block B" },
                    ]}
                    error={formErrors.apartmentId}
                  />
                </div>

                {/* Move-in date — add only */}
                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label rfm-label">Move-in date <span className="text-danger">*</span></label>
                    <input type="date" name="moveInDate"
                      className={`form-control rfm-input ${formErrors.moveInDate ? "is-invalid" : ""}`}
                      value={addForm.moveInDate}
                      onChange={handleChange}
                    />
                    {formErrors.moveInDate && <div className="invalid-feedback">{formErrors.moveInDate}</div>}
                  </div>
                )}

                {/* Move-out date — edit only */}
                {isEdit && (
                  <div className="col-md-6">
                    <label className="form-label rfm-label">Move-out date</label>
                    <input type="date" name="moveOutDate"
                      className="form-control rfm-input"
                      value={editForm.moveOutDate ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Owner checkbox */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox" name="isOwner"
                      id={isEdit ? "isOwnerEdit" : "isOwner"}
                      className="form-check-input rfm-checkbox"
                      checked={isEdit ? editForm.isOwner ?? false : addForm.isOwner}
                      onChange={handleChange}
                      style={{ width: "1.25em", height: "1.25em" }}
                    />
                    <label className="form-check-label small" htmlFor={isEdit ? "isOwnerEdit" : "isOwner"}>
                      This resident is an owner
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Footer ── */}
            <div className="modal-footer rfm-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={handleClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn rfm-btn-submit" disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" />
                    {isEdit ? "Saving..." : "Creating..."}</>
                ) : (
                  <><i className={`bi ${isEdit ? "bi-check-lg" : "bi-person-plus"} me-1`} />
                    {isEdit ? "Save Changes" : "Create Resident"}</>
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