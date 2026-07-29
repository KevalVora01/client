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
  const [copied, setCopied] = useState(false);

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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('society@icici');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [qrError, setQrError] = useState(false);

  // Generate dynamic QR image using public SVG QR service
  const upiUrl = `upi://pay?pa=society@icici&pn=Society%20Management&am=${amount.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      style={{ backdropFilter: 'blur(4px)', zIndex: 1050, overflowY: 'auto' }}
      onClick={onClose}
      tabIndex={-1}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '440px', width: '92%', margin: '1.75rem auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg bg-white overflow-hidden">

          {/* Modal Header */}
          <div className="modal-header border-bottom border-light-subtle px-4 py-3 align-items-center justify-content-between text-start">
            <div className="d-flex align-items-center gap-3 text-start">
              <div
                className="p-2 rounded-3 d-flex align-items-center justify-content-center text-dark"
                style={{ backgroundColor: '#f3f4f6', color: '#1a1f36', width: 42, height: 42, flexShrink: 0 }}
              >
                <i className="bi bi-qr-code-scan fs-5 text-dark" />
              </div>
              <div className="text-start">
                <h5 className="modal-title fw-bold fs-6 mb-0 text-dark text-start">UPI Payment</h5>
                <p className="text-muted mb-0 small text-start" style={{ fontSize: '0.78rem' }}>
                  Scan QR or enter UTR number to pay
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close ms-2"
              onClick={onClose}
              aria-label="Close"
              disabled={submitting}
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            
            {/* Amount Banner */}
            <div className="rounded-3 p-3 text-center border mb-3" style={{ backgroundColor: '#f8fafc' }}>
              <span className="text-secondary small fw-medium d-block mb-1" style={{ fontSize: '0.78rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Amount Payable
              </span>
              <span className="fs-3 fw-bold text-dark">₹{amount.toFixed(2)}</span>
            </div>

            {/* QR Code Block */}
            <div className="text-center p-3 rounded-3 border mb-3 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#f8fafc' }}>
              <div className="bg-white p-2 rounded-3 shadow-sm border mb-2 d-inline-block position-relative" style={{ width: 176, height: 176 }}>
                {!qrError ? (
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    width={160}
                    height={160}
                    className="d-block mx-auto"
                    style={{ objectFit: 'contain' }}
                    onError={() => setQrError(true)}
                  />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 p-2">
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Corner Position Boxes */}
                      <rect x="5" y="5" width="28" height="28" rx="4" fill="#1a1f36" />
                      <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="13" y="13" width="12" height="12" rx="1" fill="#1a1f36" />

                      <rect x="67" y="5" width="28" height="28" rx="4" fill="#1a1f36" />
                      <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="75" y="13" width="12" height="12" rx="1" fill="#1a1f36" />

                      <rect x="5" y="67" width="28" height="28" rx="4" fill="#1a1f36" />
                      <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="13" y="75" width="12" height="12" rx="1" fill="#1a1f36" />

                      {/* Dynamic Dot Grid Pattern */}
                      <rect x="40" y="8" width="6" height="6" fill="#1a1f36" />
                      <rect x="50" y="8" width="6" height="6" fill="#1a1f36" />
                      <rect x="40" y="18" width="6" height="6" fill="#1a1f36" />
                      <rect x="54" y="18" width="6" height="6" fill="#1a1f36" />
                      <rect x="40" y="28" width="6" height="6" fill="#1a1f36" />
                      <rect x="48" y="28" width="6" height="6" fill="#1a1f36" />

                      <rect x="8" y="40" width="6" height="6" fill="#1a1f36" />
                      <rect x="18" y="40" width="6" height="6" fill="#1a1f36" />
                      <rect x="28" y="40" width="6" height="6" fill="#1a1f36" />
                      <rect x="40" y="40" width="18" height="18" rx="2" fill="#0d6efd" />
                      <rect x="64" y="40" width="6" height="6" fill="#1a1f36" />
                      <rect x="74" y="40" width="6" height="6" fill="#1a1f36" />
                      <rect x="84" y="40" width="6" height="6" fill="#1a1f36" />

                      <rect x="8" y="50" width="6" height="6" fill="#1a1f36" />
                      <rect x="22" y="50" width="6" height="6" fill="#1a1f36" />
                      <rect x="64" y="50" width="6" height="6" fill="#1a1f36" />
                      <rect x="80" y="50" width="6" height="6" fill="#1a1f36" />

                      <rect x="40" y="64" width="6" height="6" fill="#1a1f36" />
                      <rect x="52" y="64" width="6" height="6" fill="#1a1f36" />
                      <rect x="64" y="64" width="6" height="6" fill="#1a1f36" />
                      <rect x="78" y="64" width="6" height="6" fill="#1a1f36" />
                      <rect x="86" y="64" width="6" height="6" fill="#1a1f36" />

                      <rect x="40" y="74" width="6" height="6" fill="#1a1f36" />
                      <rect x="48" y="74" width="6" height="6" fill="#1a1f36" />
                      <rect x="68" y="74" width="6" height="6" fill="#1a1f36" />
                      <rect x="82" y="74" width="6" height="6" fill="#1a1f36" />

                      <rect x="40" y="84" width="6" height="6" fill="#1a1f36" />
                      <rect x="54" y="84" width="6" height="6" fill="#1a1f36" />
                      <rect x="64" y="84" width="6" height="6" fill="#1a1f36" />
                      <rect x="74" y="84" width="6" height="6" fill="#1a1f36" />
                      <rect x="84" y="84" width="6" height="6" fill="#1a1f36" />
                    </svg>
                  </div>
                )}
              </div>
              
              <small className="text-secondary fw-semibold d-block mb-2" style={{ fontSize: '0.8rem' }}>
                Scan using GPay / PhonePe / Paytm / BHIM
              </small>

              <div className="d-inline-flex align-items-center gap-2 bg-white px-3 py-1.5 rounded-pill border">
                <span className="text-muted small">UPI ID:</span>
                <code className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>society@icici</code>
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary border-0 ms-1 d-inline-flex align-items-center"
                  onClick={handleCopyUpi}
                  title="Copy UPI ID"
                  style={{ textDecoration: 'none' }}
                >
                  <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`} />
                </button>
              </div>
            </div>

            {/* Mobile UPI Direct App Link */}
            <div className="mb-2">
              <a
                href={upiUrl}
                className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ borderRadius: '10px', fontSize: '0.9rem' }}
              >
                <i className="bi bi-phone-vibrate fs-6" />
                Open UPI App on Mobile
              </a>
            </div>

            {/* Quick Test / Instant Payment Simulation Button */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-success w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                onClick={handleSimulatePayment}
                disabled={submitting}
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
              >
                <i className="bi bi-lightning-charge-fill" />
                Simulate Instant UPI Payment (In-App)
              </button>
            </div>

            {/* Divider */}
            <div className="d-flex align-items-center my-3">
              <div className="flex-grow-1 border-top" style={{ borderColor: '#e2e8f0' }} />
              <span
                className="px-2 text-uppercase text-secondary fw-semibold"
                style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
              >
                Or Enter UTR Manually
              </span>
              <div className="flex-grow-1 border-top" style={{ borderColor: '#e2e8f0' }} />
            </div>

            {/* Manual UTR Input Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-secondary mb-0">
                    12-Digit UTR / Transaction Reference
                  </label>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {utrNumber.length}/12
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                    <i className="bi bi-hash" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="e.g. 987654321098"
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={submitting}
                    style={{ borderRadius: '0 10px 10px 0', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4 pt-1">
                <button
                  type="button"
                  className="btn btn-light border fw-medium px-3"
                  onClick={onClose}
                  disabled={submitting}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fw-medium px-4 d-flex align-items-center gap-2"
                  disabled={submitting || utrNumber.length !== 12}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg" />
                      <span>Submit UTR</span>
                    </>
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
