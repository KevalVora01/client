import { useCurrentlyInside } from '../hooks/useCurrentlyInside';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import VisitorCard from '../components/VisitorCard';

const CheckOutPage = () => {
  const { visitors, loading, refetch } = useCurrentlyInside();
  const { checkOut, loading: mutationLoading } = useVisitorMutations(refetch);
  const { metrics } = useDashboardMetrics();

  const handleCheckOut = async (visitorId: number) => {
    await checkOut(visitorId);
  };

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            Visitor Check-Out
          </h4>
          <p className="text-muted mb-0 small">
            Manage active entries and record visitor departures from the society.
          </p>
        </div>

        {metrics && (
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 rounded-pill">
              <i className="bi bi-people me-1.5" />
              {metrics.currentlyInside} inside now
            </span>
          </div>
        )}
      </div>

      {/* ── Content Card ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3">
        {loading ? (
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ width: '100%', height: '72px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : visitors.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
            >
              <i className="bi bi-door-open" style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
            </div>
            <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>
              No visitors currently inside
            </p>
            <p className="text-secondary small" style={{ fontSize: '0.8rem' }}>
              Everyone who checked in has already checked out.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {visitors.map((visitor) => (
              <VisitorCard
                key={visitor.id}
                visitor={visitor}
                actionLabel="Check Out"
                actionVariant="outline-secondary"
                onAction={() => handleCheckOut(visitor.id)}
                actionLoading={mutationLoading}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CheckOutPage;