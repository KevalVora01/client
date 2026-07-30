import { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { Visitor } from '../types/visitor.types';
import { X, Phone, MapPin, Car, Clock, Check, User, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../utils/getErrorMessage';

interface VisitorApprovalDialogProps {
  visitorId: number;
  onClose: () => void;
  onDecision: (decision: 'Approve' | 'Reject') => void;
}

function timeAgo(dateStr: string, nowMs: number): string {
  const then = new Date(dateStr).getTime();
  const diff = nowMs - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

const VisitorApprovalDialog = ({ visitorId, onClose, onDecision }: VisitorApprovalDialogProps) => {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [decision, setDecision] = useState<'Approved' | 'Rejected' | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await visitorApi.getById(visitorId);
        if (!cancelled) {
          setVisitor(data);
          // If already decided, reflect that immediately
          if (data.status === 'Approved' || data.status === 'Rejected') {
            setDecision(data.status);
          }
        }
      } catch {
        toast.error('Failed to load visitor details');
        onClose();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visitorId, onClose]);

  const elapsedMs = visitor?.approvalRequestedAt ? now - new Date(visitor.approvalRequestedAt).getTime() : 0;
  const remainingMs = Math.max(0, 10 * 60 * 1000 - elapsedMs);
  const remainingMins = Math.floor(remainingMs / 60000);
  const remainingSecs = Math.floor((remainingMs % 60000) / 1000);
  const isExpired = remainingMs <= 0;
  const progressPct = Math.min((elapsedMs / (10 * 60 * 1000)) * 100, 100);

  const handleDecision = useCallback(async (d: 'Approve' | 'Reject') => {
    setDeciding(true);
    setDecision(d === 'Approve' ? 'Approved' : 'Rejected');
    try {
      await visitorApi.respond(visitorId, d);
      toast.success(d === 'Approve' ? 'Visitor entry approved!' : 'Visitor entry rejected.');
      onDecision(d);
      setTimeout(onClose, 1500);
    } catch (err: unknown) {
      setDecision(null);
      toast.error(getErrorMessage(err, `Failed to ${d.toLowerCase()} visitor`));
    } finally {
      setDeciding(false);
    }
  }, [visitorId, onDecision, onClose]);

  return (
    <>
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 rounded-3 shadow-lg overflow-hidden">

          {/* Header */}
          <div className="modal-header border-0 px-4 py-3" style={{ backgroundColor: '#1a1f36' }}>
            <div className="d-flex align-items-center gap-2">
              <ShieldAlert size={20} className="text-white" />
              <h5 className="modal-title fw-bold text-white fs-6 mb-0">Visitor at the Gate</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-secondary mb-2" role="status" style={{ width: '2rem', height: '2rem' }} />
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Loading visitor details...</p>
              </div>
            ) : !visitor ? null : decision ? (
              <div className="text-center py-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', backgroundColor: decision === 'Approved' ? '#dcfce7' : '#fee2e2' }}
                >
                  {decision === 'Approved' ? (
                    <Check size={32} className="text-success" />
                  ) : (
                    <X size={32} className="text-danger" />
                  )}
                </div>
                <p className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: decision === 'Approved' ? '#16a34a' : '#dc2626' }}>
                  {decision === 'Approved' ? 'Entry Approved!' : 'Entry Rejected'}
                </p>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                  {decision === 'Approved' ? 'Visitor has been granted access' : 'Visitor has been denied access'}
                </p>
              </div>
            ) : (
              <>
                {/* Photo + Name */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  {visitor.photoUrl ? (
                    <img
                      src={visitor.photoUrl}
                      alt={visitor.name}
                      className="rounded-2 flex-shrink-0 object-fit-cover border"
                      style={{ width: '80px', height: '80px', borderColor: '#e5e7eb', cursor: 'pointer' }}
                      onClick={() => setSelectedImage(visitor.photoUrl)}
                      title="Click to view larger image"
                    />
                  ) : (
                    <div
                      className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9' }}
                    >
                      <User size={36} className="text-muted" />
                    </div>
                  )}
                  <div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: '#1a1f36' }}>{visitor.name}</h5>
                    {visitor.apartment && (
                      <span className="badge bg-light text-dark font-monospace" style={{ fontSize: '0.75rem', border: '1px solid #e5e7eb' }}>
                        {visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="rounded-2 p-3 mb-3" style={{ backgroundColor: '#f9fafb' }}>
                  <div className="row g-3" style={{ fontSize: '0.85rem' }}>
                    <div className="col-6">
                      <span className="text-muted d-block mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</span>
                      <div className="fw-medium text-dark d-flex align-items-center gap-1.5">
                        <Phone size={14} className="text-muted" /> {visitor.phone}
                      </div>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Purpose</span>
                      <div className="fw-medium text-dark d-flex align-items-center gap-1.5">
                        <MapPin size={14} className="text-muted" /> {visitor.purpose}
                      </div>
                    </div>
                    {visitor.vehicleNumber && (
                      <div className="col-6">
                        <span className="text-muted d-block mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vehicle</span>
                        <div className="fw-medium text-dark d-flex align-items-center gap-1.5 font-monospace">
                          <Car size={14} className="text-muted" /> {visitor.vehicleNumber}
                        </div>
                      </div>
                    )}
                    {visitor.approvalRequestedAt && (
                      <div className="col-6">
                        <span className="text-muted d-block mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requested</span>
                        <div className="fw-medium text-dark d-flex align-items-center gap-1.5">
                          <Clock size={14} className="text-muted" /> {timeAgo(visitor.approvalRequestedAt, now)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Countdown Timer */}
                {!isExpired && visitor.approvalRequestedAt && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Time remaining</span>
                      <span className="fw-bold" style={{ fontSize: '0.85rem', color: remainingMs < 2 * 60 * 1000 ? '#dc2626' : '#1a1f36' }}>
                        {remainingMins}:{remainingSecs.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px' }}>
                      <div
                        style={{
                          width: `${100 - progressPct}%`,
                          height: '100%',
                          backgroundColor: remainingMs < 2 * 60 * 1000 ? '#dc2626' : remainingMs < 5 * 60 * 1000 ? '#f59e0b' : '#16a34a',
                          borderRadius: '2px',
                          transition: 'width 1s linear',
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!loading && visitor && !decision && (
            <div className="modal-footer border-0 px-4 pb-4 pt-0 d-flex gap-2">
              {isExpired ? (
                <div className="text-center w-100">
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2" style={{ fontSize: '0.8rem' }}>
                    Request Expired (10m limit passed)
                  </span>
                </div>
              ) : (
                <div className="d-flex gap-2 w-100">
                  <button
                    type="button"
                    className="btn btn-outline-danger fw-semibold py-2 d-inline-flex align-items-center justify-content-center gap-1.5 flex-grow-1"
                    style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                    onClick={() => handleDecision('Reject')}
                    disabled={deciding}
                  >
                    <X size={16} /> Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-success fw-semibold py-2 d-inline-flex align-items-center justify-content-center gap-1.5 flex-grow-1"
                    style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                    onClick={() => handleDecision('Approve')}
                    disabled={deciding}
                  >
                    {deciding ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <Check size={16} />
                    )}
                    Approve Entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── Image Lightbox Modal ── */}
    {selectedImage && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
        style={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(4px)',
          zIndex: 1080,
        }}
        onClick={() => setSelectedImage(null)}
      >
        <div
          className="position-relative bg-dark rounded-4 overflow-hidden d-flex align-items-center justify-content-center shadow-2xl"
          style={{
            maxWidth: '90vw',
            maxHeight: '85vh',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-none p-2"
            onClick={() => setSelectedImage(null)}
            style={{ zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}
            aria-label="Close"
          />
          <img
            src={selectedImage}
            alt="Visitor photo preview"
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    )}
    </>
  );
};

export default VisitorApprovalDialog;
