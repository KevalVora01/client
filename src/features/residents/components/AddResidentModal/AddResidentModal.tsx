import { useEffect, useState } from "react";
import type { CreateResidentPayload } from "../../types/resident.types";
import './AddResidentModal.css';
import ApartmentSelect from "../ApartmentSelect/ApartmentSelect";

interface AddResidentModalProps {
  show: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateResidentPayload) => Promise<boolean>;
}

const initialForm: CreateResidentPayload = {
  name: "",
  email: "",
  phone: "",
  password: "",
  apartmentId: 0,
  isOwner: false,
  moveInDate: "",
};

const AddResidentModal = ({
  show,
  loading,
  error,
  onClose,
  onSubmit,
}: AddResidentModalProps) => {
  const [form, setForm] = useState<CreateResidentPayload>(initialForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateResidentPayload, string>>>({});

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
    const errors: Partial<Record<keyof CreateResidentPayload, string>> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) errors.phone = "Phone must be 10 digits";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
    // if (!form.apartmentId) errors.apartmentId = "Apartment is required";
    if (!form.moveInDate) errors.moveInDate = "Move in date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await onSubmit(form);
    if (success) {
      setForm(initialForm);
      setFormErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setFormErrors({});
    onClose();
  };

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              Add new resident
            </h5>
            <button
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {error}
                </div>
              )}

              <p className="text-muted small fw-semibold text-uppercase mb-2">
                User account
              </p>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small">
                    Full name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                    placeholder="rahul@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div>
              </div>

              <hr />

              <p className="text-muted small fw-semibold text-uppercase mb-2">
                Resident details
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">
                    Apartment <span className="text-danger">*</span>
                  </label>
                  <ApartmentSelect
                    value={form.apartmentId}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, apartmentId: val }));
                      setFormErrors((prev) => ({ ...prev, apartmentId: undefined }));
                    }}
                    options={[
                      { value: 1, label: "A-101", floor: "Floor 1", block: "Block A" },
                      { value: 2, label: "A-102", floor: "Floor 1", block: "Block A" },
                      { value: 3, label: "C-201", floor: "Floor 2", block: "Block B" },
                      // populate from API
                    ]}
                    error={formErrors.apartmentId}
                  />
                  {formErrors.apartmentId && <div className="invalid-feedback">{formErrors.apartmentId}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small">
                    Move in date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="moveInDate"
                    className={`form-control ${formErrors.moveInDate ? "is-invalid" : ""}`}
                    value={form.moveInDate}
                    onChange={handleChange}
                  />
                  {formErrors.moveInDate && <div className="invalid-feedback">{formErrors.moveInDate}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isOwner"
                      id="isOwner"
                      className="form-check-input"
                      checked={form.isOwner}
                      onChange={handleChange}
                      style={{ width: "1.25em", height: "1.25em" }}
                    />
                    <label className="form-check-label small" htmlFor="isOwner">
                      This resident is an owner
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
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
                className="btn"
                disabled={loading}
                style={{ background: "#1a1f36", color: "#fff" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-1"></i>
                    Create resident
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

export default AddResidentModal;