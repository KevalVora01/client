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
      showError('Expected arrival date and time is required');
      return;
    }

    try {
      setSubmitting(true);
      await visitorApi.preRegister({
        name: name.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        expectedAt: new Date(expectedAt).toISOString(),
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
              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Visitor Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Full name of expected visitor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Phone Number <span className="text-danger">*</span>
                </label>
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
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Purpose of Visit <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Tag size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. Guest, Delivery, Service"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Expected Date & Time <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Calendar size={18} className="text-secondary" />
                  </span>
                  <input
                    type="datetime-local"
                    className="form-control border-start-0"
                    value={expectedAt}
                    onChange={(e) => setExpectedAt(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Vehicle Plate Number <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Car size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. MH 12 AB 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button type="button" className="btn btn-outline-secondary rounded-2 px-3" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-2 px-4 d-flex align-items-center gap-2 fw-semibold"
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
