import { useState } from 'react';
import { usePendingVisitors } from '../hooks/usePendingVisitors';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import VisitorCard from '../components/VisitorCard';
import { useScrollLock } from '../../../hooks/useScrollLock';
import type { LogWalkInPayload, Visitor } from '../types/visitor.types';
import { Plus } from 'lucide-react';

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

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Visitor Check-In
          </h4>
          <p className="text-muted mb-0 small">
            Look up pre-registered visitors or log a new walk-in entry at the gate.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2 small shadow-sm"
            onClick={() => setWalkInModalOpen(true)}
            style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
          >
            <Plus size={16} strokeWidth={2} />
            Log Walk-In Visitor
          </button>
        </div>
      </div>

      <div className="row g-4">

        {/* ── Left: Lookup Search ── */}
        <div className="col-lg-7">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3">
            <VisitorLookupSearch onCheckIn={handleCheckIn} checkInLoading={mutationLoading} />
          </div>
        </div>

        {/* ── Right: Pending approvals ── */}
        <div className="col-lg-5">
          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>
                Awaiting Approval
              </h6>
              {pendingVisitors && pendingVisitors.items.length > 0 && (
                <span className="badge bg-warning-subtle text-warning-emphasis" style={{ fontSize: '0.75rem' }}>
                  {pendingVisitors.items.length}
                </span>
              )}
            </div>

            {pendingLoading ? (
              <div className="d-flex flex-column gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: '100%', height: '64px', borderRadius: '8px' }} />
                ))}
              </div>
            ) : !pendingVisitors || pendingVisitors.items.length === 0 ? (
              <p className="text-secondary text-center py-4" style={{ fontSize: '0.85rem' }}>
                No visitors currently awaiting resident approval.
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendingVisitors.items.map((visitor) => (
                  <VisitorCard key={visitor.id} visitor={visitor} />
                ))}
              </div>
            )}
          </div>
        </div>

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