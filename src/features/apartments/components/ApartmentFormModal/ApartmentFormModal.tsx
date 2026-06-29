import { useApartmentForm } from "../../hooks/useApartmentForm";
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload } from "../../types/apartment.types";
import { ApartmentType } from "../../types/apartment.types";

interface ApartmentFormModalProps {
  show: boolean;
  mode: "add" | "edit";
  apartment?: Apartment | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateApartmentPayload | UpdateApartmentPayload, id?: number) => Promise<boolean>;
}

const apartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.STUDIO]: "Studio",
  [ApartmentType.ONE_BHK]: "1 BHK",
  [ApartmentType.TWO_BHK]: "2 BHK",
  [ApartmentType.THREE_BHK]: "3 BHK",
  [ApartmentType.FOUR_BHK]: "4 BHK",
};

const ApartmentFormModal = ({
  show,
  mode,
  apartment,
  loading,
  onClose,
  onSubmit,
}: ApartmentFormModalProps) => {
  const { isEdit, addForm, editForm, formErrors, handleChange, handleSubmit, handleClose } =
    useApartmentForm({ mode, apartment, onSubmit, onClose });

  if (!show) return null;

  return (
    /* Custom background color transparency handled cleanly via standard Bootstrap bg-opacity style overrides */
    <div 
      className="modal d-block bg-dark bg-opacity-50" 
      onClick={onClose}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* ── Header ── */}
          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: "#1a1f36" }}>
                {isEdit ? `Edit Apartment — ${apartment?.flateNumber}` : "Add New Apartment"}
              </h5>
              <p className="text-muted mb-0 small" style={{ fontSize: "0.8rem" }}>
                {isEdit ? "Update the apartment details below." : "Fill in the details to create a new apartment unit."}
              </p>
            </div>
            <button 
              className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute" 
              onClick={handleClose} 
              disabled={loading} 
              aria-label="Close"
              style={{ width: "30px", height: "30px", top: "1.2rem", right: "1.2rem" }}
            >
              <i className="bi bi-x fs-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── Body ── */}
            <div className="modal-body p-4授">
              <div className="row g-3">

                {/* Block */}
                <div className="col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>
                    Block <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="block"
                    autoComplete="off"
                    className={`form-control rounded-2 shadow-none small ${formErrors.block ? "is-invalid" : "border-light-subtle"}`}
                    placeholder="e.g. A"
                    value={isEdit ? editForm.block ?? "" : addForm.block}
                    onChange={handleChange}
                    style={{ fontSize: "0.875rem" }}
                  />
                  {formErrors.block && <div className="invalid-feedback">{formErrors.block}</div>}
                </div>

                {/* Floor Number */}
                <div className="col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>
                    Floor Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="floorNumber"
                    autoComplete="off"
                    className={`form-control rounded-2 shadow-none small ${formErrors.floorNumber ? "is-invalid" : "border-light-subtle"}`}
                    placeholder="e.g. 3"
                    value={isEdit ? editForm.floorNumber ?? "" : addForm.floorNumber || ""}
                    onChange={handleChange}
                    min={0}
                    style={{ fontSize: "0.875rem" }}
                  />
                  {formErrors.floorNumber && <div className="invalid-feedback">{formErrors.floorNumber}</div>}
                </div>

                {/* Unit Number — add only */}
                {!isEdit && (
                  <div className="col-md-4">
                    <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>
                      Unit Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="unitNumber"
                      autoComplete="off"
                      className={`form-control rounded-2 shadow-none small ${formErrors.unitNumber ? "is-invalid" : "border-light-subtle"}`}
                      placeholder="e.g. 02"
                      value={addForm.unitNumber}
                      onChange={handleChange}
                      style={{ fontSize: "0.875rem" }}
                    />
                    {formErrors.unitNumber && <div className="invalid-feedback">{formErrors.unitNumber}</div>}
                  </div>
                )}

                {/* Flat Number — edit only */}
                {isEdit && (
                  <div className="col-md-4">
                    <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>Flat Number</label>
                    <input
                      type="text"
                      name="flateNumber"
                      autoComplete="off"
                      className="form-control rounded-2 shadow-none border-light-subtle small"
                      value={editForm.flateNumber ?? ""}
                      onChange={handleChange}
                      style={{ fontSize: "0.875rem" }}
                    />
                  </div>
                )}

                {/* Area */}
                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>
                    Area (sq ft) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="areaSqft"
                    autoComplete="off"
                    className={`form-control rounded-2 shadow-none small ${formErrors.areaSqft ? "is-invalid" : "border-light-subtle"}`}
                    placeholder="e.g. 1200"
                    value={isEdit ? editForm.areaSqft ?? "" : addForm.areaSqft || ""}
                    onChange={handleChange}
                    min={1}
                    style={{ fontSize: "0.875rem" }}
                  />
                  {formErrors.areaSqft && <div className="invalid-feedback">{formErrors.areaSqft}</div>}
                </div>

                {/* Type */}
                <div className="col-md-6">
                  <label className="form-label fw-medium text-secondary small mb-1" style={{ fontSize: "0.8rem" }}>
                    Type <span className="text-danger">*</span>
                  </label>
                  <select
                    name="type"
                    className={`form-select rounded-2 shadow-none small ${formErrors.type ? "is-invalid" : "border-light-subtle"}`}
                    value={isEdit ? editForm.type ?? "" : addForm.type}
                    onChange={handleChange}
                    style={{ fontSize: "0.875rem" }}
                  >
                    <option value="">Select type</option>
                    {Object.entries(apartmentTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {formErrors.type && <div className="invalid-feedback">{formErrors.type}</div>}
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
                className="btn text-white rounded-2 px-3 fw-medium small d-inline-flex align-items-center"
                disabled={loading}
                style={{ 
                  height: "38px", 
                  fontSize: "0.875rem",
                  backgroundColor: "#1a1f36"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEdit ? "bi-check-lg" : "bi-building"} me-1`} />
                    {isEdit ? "Save Changes" : "Create Apartment"}
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

export default ApartmentFormModal;