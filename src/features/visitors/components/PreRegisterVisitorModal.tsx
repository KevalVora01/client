import React, { useState } from 'react';
import { visitorApi } from '../api/visitorApi';
import { User, Phone, Tag, Calendar, Car, Plus, RefreshCw } from 'lucide-react';
import { showError, showSuccess } from '../../../utils/toast';

interface PreRegisterVisitorModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PreRegisterVisitorModal: React.FC<PreRegisterVisitorModalProps> = ({ show, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedAt, setExpectedAt] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Visitor name is required');
      return;
    }
    if (!phone.trim() || phone.length !== 10 || !/^\d+$/.test(phone)) {
      showError('Phone number must be exactly 10 digits');
      return;
    }
    if (!purpose.trim()) {
      showError('Purpose of visit is required');
      return;
    }
    if (!expectedAt) {
      showError('Expected arrival date is required');
      return;
    }
    const selectedDate = new Date(expectedAt + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showError('Expected arrival date cannot be in the past');
      return;
    }

    try {
      setSubmitting(true);
      await visitorApi.preRegister({
        name: name.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        expectedAt: new Date(expectedAt + 'T00:00:00').toISOString(),
        vehicleNumber: vehicleNumber.trim() || undefined,
      });

      showSuccess('Visitor pre-registered successfully!');
      onSuccess();
      onClose();
      // Reset
      setName('');
      setPhone('');
      setPurpose('');
      setExpectedAt('');
      setVehicleNumber('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      showError(axiosError?.response?.data?.message || 'Failed to pre-register visitor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ color: '#111827' }}>
              <Plus className="text-primary" size={20} />
              Pre-Register Expected Visitor
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Visitor Name */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-dark mb-0">
                    Visitor Name <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${name.length === 100 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {name.length}/100
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Full name of expected visitor"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                {name.length === 100 && (
                  <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle text-primary me-1" />
                    Maximum limit of 100 characters reached.
                  </small>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-dark mb-0">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${phone.length === 10 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {phone.length}/10
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Phone size={18} className="text-secondary" />
                  </span>
                  <input
                    type="tel"
                    className="form-control border-start-0"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                {phone.length === 10 && (
                  <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle text-primary me-1" />
                    Maximum limit of 10 digits reached.
                  </small>
                )}
              </div>

              {/* Purpose of Visit */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-dark mb-0">
                    Purpose of Visit <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${purpose.length === 150 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {purpose.length}/150
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Tag size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. Guest, Delivery, Service"
                    maxLength={150}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>
                {purpose.length === 150 && (
                  <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle text-primary me-1" />
                    Maximum limit of 150 characters reached.
                  </small>
                )}
              </div>

              {/* Expected Date */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Expected Date <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Calendar size={18} className="text-secondary" />
                  </span>
                  <input
                    type="date"
                    className="form-control border-start-0"
                    value={expectedAt}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setExpectedAt(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Vehicle Plate Number */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-dark mb-0">
                    Vehicle Plate Number <span className="text-muted fw-normal">(Optional)</span>
                  </label>
                  <span className={`small fw-medium ${vehicleNumber.length === 20 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {vehicleNumber.length}/20
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Car size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. MH 12 AB 1234"
                    maxLength={20}
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
                {vehicleNumber.length === 20 && (
                  <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle text-primary me-1" />
                    Maximum limit of 20 characters reached.
                  </small>
                )}
              </div>
            </div>

            <div className="modal-footer bg-light-subtle border-top border-light-subtle px-4 py-3 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light border px-4 py-2 small fw-medium"
                style={{ borderRadius: "8px", fontSize: "0.875rem" }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 small fw-semibold d-inline-flex align-items-center gap-2"
                style={{ borderRadius: "8px", fontSize: "0.875rem" }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Registering...
                  </>
                ) : (
                  'Register Visitor'
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
