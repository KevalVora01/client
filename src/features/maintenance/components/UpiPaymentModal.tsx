import { useState } from 'react';
import { maintenanceApi } from '../api/maintenanceApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError, showSuccess } from '../../../utils/toast';

interface UpiPaymentModalProps {
  invoiceId: number;
  amount: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const UpiPaymentModal = ({
  invoiceId,
  amount,
  onClose,
  onPaymentSuccess,
}: UpiPaymentModalProps) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, customUtr?: string) => {
    if (e) e.preventDefault();
    const utr = customUtr || utrNumber.trim();

    if (!utr) {
      showError('Please enter a 12-digit UPI transaction UTR / Reference number.');
      return;
    }

    if (!/^\d{12}$/.test(utr)) {
      showError('UPI UTR number must be exactly 12 digits.');
      return;
    }

    setSubmitting(true);
    try {
      await maintenanceApi.markInvoiceSettled(invoiceId, `UPI - ${utr}`);
      showSuccess('UPI Payment submitted and verified successfully!');
      onPaymentSuccess();
      onClose();
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to process UPI payment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulatePayment = () => {
    // Generate a random 12-digit mock UTR number
    const mockUtr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    setUtrNumber(mockUtr);
    handleSubmit(undefined, mockUtr);
  };

  // Generate dynamic QR image using Google Chart API or public SVG QR service
  const upiUrl = `upi://pay?pa=society@icici&pn=Society%20Management&am=${amount.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                UPI Payment
              </h5>
              <p className="text-muted mb-0 small">Scan QR or enter UTR number to pay</p>
            </div>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onClose}
              aria-label="Close"
              disabled={submitting}
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="modal-body p-3 p-sm-4">
            <div className="text-center mb-3">
              <span className="badge bg-light text-dark border px-3 py-2 fs-6 fw-bold rounded-pill">
                Amount Due: ₹{amount.toFixed(2)}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="text-center p-3 bg-light rounded-3 border mb-3">
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                width={170}
                height={170}
                className="img-fluid rounded shadow-sm bg-white p-2"
                onError={(e) => {
                  // Fallback if network blocks QR image
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="mt-2">
                <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.8rem' }}>
                  Scan with GPay / PhonePe / Paytm / BHIM
                </small>
                <code className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>society@icici</code>
              </div>
            </div>

            {/* Open UPI App directly on Smartphones */}
            <div className="mb-3">
              <a
                href={upiUrl}
                className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: '8px', fontSize: '0.9rem' }}
              >
                <i className="bi bi-phone-vibrate" />
                Open UPI App on Mobile (GPay / PhonePe / Paytm)
              </a>
            </div>

            {/* In-App Quick Simulation Button */}
            <div className="mb-3 text-center">
              <button
                type="button"
                className="btn btn-sm btn-outline-success fw-medium w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleSimulatePayment}
                disabled={submitting}
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-check-circle-fill" />
                Simulate Instant UPI Payment (In-App)
              </button>
            </div>

            <div className="text-center my-2 text-muted small position-relative">
              <hr className="my-2" />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
                or enter UTR manually
              </span>
            </div>

            {/* Manual UTR Input */}
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">
                  12-Digit UPI Transaction / UTR Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 987654321098"
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={submitting}
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={submitting}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-1"
                  disabled={submitting || utrNumber.length !== 12}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    'Submit UTR'
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
