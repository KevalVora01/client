import { useState } from "react";
import type { ResidentDetail, UpdateResidentPayload } from "../../types/resident.types";

interface EditResidentModalProps {
  show: boolean;
  loading: boolean;
  error: string | null;
  resident: ResidentDetail | null;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateResidentPayload) => Promise<boolean>;
}

const getInitialForm = (resident: ResidentDetail | null): UpdateResidentPayload => ({
  name: resident?.user.name ?? "",
  phone: resident?.user.phone ?? "",
  apartmentId: resident?.apartmentId ?? undefined,
  isOwner: resident?.isOwner ?? false,
  moveOutDate: resident?.moveOutDate ?? undefined,
});

const EditResidentModal = ({
  show,
  loading,
  error,
  resident,
  onClose,
  onSubmit,
}: EditResidentModalProps) => {
  const [form, setForm] = useState<UpdateResidentPayload>(() => getInitialForm(resident));
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UpdateResidentPayload, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "apartmentId"
        ? Number(value)
        : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof UpdateResidentPayload, string>> = {};
    if (form.name !== undefined && !form.name.trim()) errors.name = "Name cannot be empty";
    if (form.phone !== undefined && !/^\d{10}$/.test(form.phone)) errors.phone = "Phone must be 10 digits";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resident || !validate()) return;
    const success = await onSubmit(resident.id, form);
    if (success) onClose();
  };

  if (!show || !resident) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil me-2"></i>
              Edit resident — {resident.user.name}
            </h5>
            <button className="btn-close" onClick={onClose} disabled={loading} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {error}
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">Full name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                    value={form.name ?? ""}
                    onChange={handleChange}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                    value={form.phone ?? ""}
                    onChange={handleChange}
                  />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">Apartment</label>
                  <select
                    name="apartmentId"
                    className="form-select"
                    value={form.apartmentId ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select apartment</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small">Move out date</label>
                  <input
                    type="date"
                    name="moveOutDate"
                    className="form-control"
                    value={form.moveOutDate ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isOwner"
                      id="isOwnerEdit"
                      className="form-check-input"
                      checked={form.isOwner ?? false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small" htmlFor="isOwnerEdit">
                      This resident is an owner
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                ) : (
                  <><i className="bi bi-check-lg me-1"></i>Save changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditResidentModal;