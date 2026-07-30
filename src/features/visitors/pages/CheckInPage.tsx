import { useState } from 'react';
import { usePendingVisitors } from '../hooks/usePendingVisitors';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import { useScrollLock } from '../../../hooks/useScrollLock';
import type { LogWalkInPayload, Visitor } from '../types/visitor.types';
import { Plus, Search, UserPlus, Clock } from 'lucide-react';

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

const CheckInPage = () => {
  const { visitors: pendingVisitors, loading: pendingLoading, refetch: refetchPending } = usePendingVisitors();
  const { logWalkIn, checkIn, loading: mutationLoading } = useVisitorMutations(refetchPending);
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);

  useScrollLock(walkInModalOpen);

  const handleLogWalkIn = async (payload: LogWalkInPayload, photo?: File): Promise<boolean> => {
    return logWalkIn(payload, photo);
  };

  const handleCheckIn = async (visitor: Visitor) => {
    await checkIn(visitor.id);
  };

  const pendingCount = pendingVisitors?.items.length ?? 0;

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
          Check-In
        </h4>
        <p className="text-muted mb-0 small">
          Check in an expected visitor, or log a new walk-in.
        </p>
      </div>

      {/* ── Two equal-weight entry paths ── */}
      <div className="row g-3 mb-4">

        {/* Expected visitor */}
        <div className="col-md-6">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#dbeafe' }}
              >
                <Search size={18} color="#1e40af" strokeWidth={2} />
              </div>
              <div>
                <p className="fw-medium mb-0" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
                  Expected visitor
                </p>
                <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>
                  Pre-registered by a resident
                </p>
              </div>
            </div>

            <VisitorLookupSearch onCheckIn={handleCheckIn} checkInLoading={mutationLoading} />
          </div>
        </div>

        {/* Walk-in visitor */}
        <div className="col-md-6">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3 h-100 d-flex flex-column">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                style={{ width: '36px', height: '36px', backgroundColor: '#fef3c7' }}
              >
                <UserPlus size={18} color="#92400e" strokeWidth={2} />
              </div>
              <div>
                <p className="fw-medium mb-0" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
                  Walk-in visitor
                </p>
                <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>
                  Not expected, needs approval
                </p>
              </div>
            </div>

            <p className="text-secondary flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Log a new visitor's details. The resident will get a request to approve entry before they can come in.
            </p>

            <button
              type="button"
              className="btn btn-dark fw-medium d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2"
              onClick={() => setWalkInModalOpen(true)}
              style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
            >
              <Plus size={16} strokeWidth={2} />
              Log Walk-In Visitor
            </button>
          </div>
        </div>

      </div>

      {/* ── Awaiting approval (read-only reference) ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>
            Awaiting Approval
          </h6>
          {pendingCount > 0 && (
            <span className="badge bg-warning-subtle text-warning-emphasis" style={{ fontSize: '0.75rem' }}>
              {pendingCount} pending
            </span>
          )}
        </div>

        {pendingLoading ? (
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : pendingCount === 0 ? (
          <p className="text-secondary text-center py-3 mb-0" style={{ fontSize: '0.85rem' }}>
            No visitors currently awaiting resident approval.
          </p>
        ) : (
          <div className="d-flex flex-column">
            {pendingVisitors!.items.map((visitor, idx) => (
              <div
                key={visitor.id}
                className={`d-flex align-items-center gap-3 py-2 ${idx < pendingVisitors!.items.length - 1 ? 'border-bottom' : ''}`}
                style={{ borderColor: '#f0f0f0' }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  style={{ width: '32px', height: '32px', backgroundColor: '#f3f4f6' }}
                >
                  <i className="bi bi-person" style={{ fontSize: '0.9rem', color: '#9ca3af' }} />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="fw-medium mb-0 text-truncate" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
                    {visitor.name}
                  </p>
                  <p className="mb-0 text-secondary text-truncate" style={{ fontSize: '0.75rem' }}>
                    {visitor.resident ? `Apartment ${visitor.resident.apartmentId}` : ''} &middot; {visitor.purpose}
                    {visitor.approvalRequestedAt && (
                      <>
                        {' '}&middot; <Clock size={11} style={{ marginBottom: '2px' }} /> {timeAgo(visitor.approvalRequestedAt)}
                      </>
                    )}
                  </p>
                </div>
                <span
                  className="badge fw-medium flex-shrink-0"
                  style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e' }}
                >
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Log Walk-In Visitor Modal ── */}
      {walkInModalOpen && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg" style={{ overflow: 'visible' }}>
              <div className="modal-header border-light-subtle px-4 py-3">
                <h5 className="modal-title fw-bold text-dark fs-5">Log a Walk-In Visitor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setWalkInModalOpen(false)}
                />
              </div>
              <div className="modal-body p-4" style={{ overflow: 'visible' }}>
                <WalkInVisitorForm
                  loading={mutationLoading}
                  onSubmit={async (payload, photo) => {
                    const success = await handleLogWalkIn(payload, photo);
                    if (success) {
                      setWalkInModalOpen(false);
                    }
                    return success;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckInPage;