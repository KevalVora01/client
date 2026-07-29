import { usePendingVisitors } from '../hooks/usePendingVisitors';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import VisitorCard from '../components/VisitorCard';
import type { LogWalkInPayload, Visitor } from '../types/visitor.types';

const CheckInPage = () => {
  const { visitors: pendingVisitors, loading: pendingLoading, refetch: refetchPending } = usePendingVisitors();
  const { logWalkIn, checkIn, loading: mutationLoading } = useVisitorMutations(refetchPending);

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
      </div>

      <div className="row g-4">

        {/* ── Left: Lookup + Walk-in form ── */}
        <div className="col-lg-7">

          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3 mb-4">
            <VisitorLookupSearch onCheckIn={handleCheckIn} checkInLoading={mutationLoading} />
          </div>

          <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3">
            <h6 className="fw-semibold mb-3" style={{ fontSize: '0.9rem', color: '#1a1f36' }}>
              Log a Walk-In Visitor
            </h6>
            <WalkInVisitorForm loading={mutationLoading} onSubmit={handleLogWalkIn} />
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

    </div>
  );
};

export default CheckInPage;