import { useApartmentForm } from "../../hooks/useApartmentForm";
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload } from "../../types/apartment.types";
import { ApartmentType } from "../../types/apartment.types";
import "./ApartmentFormModal.css";

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
    <div className="modal d-block afm-backdrop" onClick={onClose}>
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content afm-content">

          {/* ── Header ── */}
          <div className="modal-header afm-header">
            <div>
              <h5 className="modal-title afm-title">
                {isEdit ? `Edit Apartment — ${apartment?.flateNumber}` : "Add New Apartment"}
              </h5>
              <p className="afm-subtitle mb-0">
                {isEdit ? "Update the apartment details below." : "Fill in the details to create a new apartment unit."}
              </p>
            </div>
            <button className="afm-close" onClick={handleClose} disabled={loading} aria-label="Close">
              <i className="bi bi-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              <div className="row g-3">

                {/* Block */}
                <div className="col-md-4">
                  <label className="form-label afm-label">
                    Block <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="block"
                    autoComplete="off"
                    className={`form-control afm-input ${formErrors.block ? "is-invalid" : ""}`}
                    placeholder="e.g. A"
                    value={isEdit ? editForm.block ?? "" : addForm.block}
                    onChange={handleChange}
                  />
                  {formErrors.block && <div className="invalid-feedback">{formErrors.block}</div>}
                </div>

                {/* Floor Number */}
                <div className="col-md-4">
                  <label className="form-label afm-label">
                    Floor Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="floorNumber"
                    autoComplete="off"
                    className={`form-control afm-input ${formErrors.floorNumber ? "is-invalid" : ""}`}
                    placeholder="e.g. 3"
                    value={isEdit ? editForm.floorNumber ?? "" : addForm.floorNumber || ""}
                    onChange={handleChange}
                    min={0}
                  />
                  {formErrors.floorNumber && <div className="invalid-feedback">{formErrors.floorNumber}</div>}
                </div>

                {/* Unit Number — add only */}
                {!isEdit && (
                  <div className="col-md-4">
                    <label className="form-label afm-label">
                      Unit Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="unitNumber"
                      autoComplete="off"
                      className={`form-control afm-input ${formErrors.unitNumber ? "is-invalid" : ""}`}
                      placeholder="e.g. 02"
                      value={addForm.unitNumber}
                      onChange={handleChange}
                    />
                    {formErrors.unitNumber && <div className="invalid-feedback">{formErrors.unitNumber}</div>}
                  </div>
                )}

                {/* Flat Number — edit only */}
                {isEdit && (
                  <div className="col-md-4">
                    <label className="form-label afm-label">Flat Number</label>
                    <input
                      type="text"
                      name="flateNumber"
                      autoComplete="off"
                      className="form-control afm-input"
                      value={editForm.flateNumber ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Area */}
                <div className="col-md-6">
                  <label className="form-label afm-label">
                    Area (sq ft) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="areaSqft"
                    autoComplete="off"
                    className={`form-control afm-input ${formErrors.areaSqft ? "is-invalid" : ""}`}
                    placeholder="e.g. 1200"
                    value={isEdit ? editForm.areaSqft ?? "" : addForm.areaSqft || ""}
                    onChange={handleChange}
                    min={1}
                  />
                  {formErrors.areaSqft && <div className="invalid-feedback">{formErrors.areaSqft}</div>}
                </div>

                {/* Type */}
                <div className="col-md-6">
                  <label className="form-label afm-label">
                    Type <span className="text-danger">*</span>
                  </label>
                  <select
                    name="type"
                    className={`form-select afm-input ${formErrors.type ? "is-invalid" : ""}`}
                    value={isEdit ? editForm.type ?? "" : addForm.type}
                    onChange={handleChange}
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
            <div className="modal-footer afm-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn afm-btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" />
                    {isEdit ? "Saving..." : "Creating..."}</>
                ) : (
                  <><i className={`bi ${isEdit ? "bi-check-lg" : "bi-building"} me-1`} />
                    {isEdit ? "Save Changes" : "Create Apartment"}</>
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