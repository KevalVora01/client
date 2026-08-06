import React, { useCallback, useEffect } from 'react';
import type { Visitor } from '../types/visitor.types';
import { CheckCircle2, User, Phone, MapPin, Car } from 'lucide-react';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface CheckInPhotoModalProps {
  show: boolean;
  visitor: Visitor | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (visitorId: number) => Promise<boolean | void>;
}

export const CheckInPhotoModal: React.FC<CheckInPhotoModalProps> = ({
  show,
  visitor,
  loading = false,
  onClose,
  onConfirm,
}) => {
  useScrollLock(show && Boolean(visitor));

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, loading, handleClose]);

  const handleCheckIn = async () => {
    if (!visitor) return;
    const success = await onConfirm(visitor.id);
    if (success !== false) {
      handleClose();
    }
  };

  if (!show || !visitor) return null;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ backdropFilter: 'blur(4px)', zIndex: 1055 }}
      onClick={() => {
        if (!loading) handleClose();
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* Modal Header */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: '1rem', color: '#1a1f36' }}>
                Visitor Gate Check-In
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: '0.8rem' }}>
                Verify identity and confirm entry.
              </p>
            </div>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="modal-body p-4">
            {/* Visitor Summary Info */}
            <div className="card border-0 bg-light p-3 rounded-3 mb-3">
              <div className="d-flex align-items-center gap-3">
                {visitor.photoUrl ? (
                  <img
                    src={visitor.photoUrl}
                    alt={visitor.name}
                    className="rounded-3 flex-shrink-0 object-fit-cover border"
                    style={{ width: '54px', height: '54px', borderColor: '#cbd5e1' }}
                  />
                ) : (
                  <div
                    className="rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center border"
                    style={{ width: '54px', height: '54px', backgroundColor: '#e2e8f0', color: '#64748b' }}
                  >
                    <User size={24} />
                  </div>
                )}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.95rem' }}>
                      {visitor.name}
                    </h6>
                    {visitor.isPreRegistered && (
                      <span className="badge bg-indigo-subtle text-indigo px-2 py-0.5 rounded-pill" style={{ fontSize: '0.68rem', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        Pre-Registered
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted flex-wrap" style={{ fontSize: '0.78rem' }}>
                    <span className="d-inline-flex align-items-center gap-1">
                      <Phone size={12} /> {visitor.phone}
                    </span>
                    <span>&middot;</span>
                    <span className="d-inline-flex align-items-center gap-1">
                      <MapPin size={12} /> {visitor.purpose}
                    </span>
                    {visitor.vehicleNumber && (
                      <>
                        <span>&middot;</span>
                        <span className="font-monospace d-inline-flex align-items-center gap-1">
                          <Car size={12} /> {visitor.vehicleNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top border-light-subtle px-4 py-3">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
              onClick={handleClose}
              disabled={loading}
              style={{ height: '38px', fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center gap-2 text-white"
              onClick={handleCheckIn}
              disabled={loading}
              style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" />
                  Checking In...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Check-In
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckInPhotoModal;
