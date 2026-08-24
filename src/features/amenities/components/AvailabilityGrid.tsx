import type { AvailabilityResult, BusyInterval } from '../types/amenity.types';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AvailabilityGridProps {
  availability: AvailabilityResult | null;
  loading: boolean;
  onOpenBooking?: () => void;
}

const toMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const AvailabilityGrid = ({ availability, loading, onOpenBooking }: AvailabilityGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
        <span className="text-muted small">Checking schedule availability...</span>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="text-center py-4 text-muted small">
        Select a date to view amenity schedule.
      </div>
    );
  }

  const { operatingStart, operatingEnd, busyIntervals = [], date } = availability;
  const startMin = toMinutes(operatingStart);
  const endMin = toMinutes(operatingEnd);
  const totalMin = Math.max(1, endMin - startMin);

  return (
    <div>
      {/* ── Operating Hours Info Bar ── */}
      <div
        className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3 flex-wrap gap-2"
        style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
      >
        <div className="d-flex align-items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span className="small text-dark fw-medium">
            Operating Hours: <span className="fw-bold">{operatingStart} – {operatingEnd}</span>
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="d-inline-flex align-items-center gap-1 small text-secondary" style={{ fontSize: '0.78rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            Available
          </span>
          <span className="d-inline-flex align-items-center gap-1 small text-secondary" style={{ fontSize: '0.78rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
            Booked
          </span>
          <span className="d-inline-flex align-items-center gap-1 small text-secondary" style={{ fontSize: '0.78rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' }} />
            Blackout
          </span>
        </div>
      </div>

      {/* ── Visual Day Timeline Bar ── */}
      <div className="mb-4">
        <div className="d-flex justify-content-between small text-muted mb-1 px-1" style={{ fontSize: '0.75rem' }}>
          <span>{operatingStart}</span>
          <span>Timeline for {date}</span>
          <span>{operatingEnd}</span>
        </div>
        <div
          className="position-relative rounded-pill overflow-hidden shadow-inner"
          style={{ height: '16px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}
        >
          {busyIntervals.map((interval: BusyInterval, index: number) => {
            const intStart = Math.max(startMin, toMinutes(interval.startTime));
            const intEnd = Math.min(endMin, toMinutes(interval.endTime));
            if (intStart >= intEnd) return null;

            const leftPct = ((intStart - startMin) / totalMin) * 100;
            const widthPct = ((intEnd - intStart) / totalMin) * 100;
            const bg = interval.type === 'blackout' ? '#64748b' : '#ef4444';

            return (
              <div
                key={index}
                className="position-absolute top-0 bottom-0"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: bg,
                }}
                title={`${interval.startTime} – ${interval.endTime}: ${interval.label || interval.type}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── Status and Reserved Slots Breakdown ── */}
      {busyIntervals.length === 0 ? (
        <div
          className="p-3 rounded-3 text-center d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <CheckCircle2 size={24} className="text-success mb-2" />
          <h6 className="fw-bold mb-1 text-success fs-6">Fully Available All Day!</h6>
          <p className="text-secondary small mb-0" style={{ maxWidth: '420px' }}>
            There are no bookings or blackouts for this date. You can request any duration between{' '}
            <strong className="text-dark">{operatingStart}</strong> and <strong className="text-dark">{operatingEnd}</strong>.
          </p>
        </div>
      ) : (
        <div>
          <h6 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1">
            <AlertTriangle size={15} className="text-warning" /> Reserved / Unavailable Times Today
          </h6>
          <div className="d-flex flex-column gap-2 mb-3">
            {busyIntervals.map((interval: BusyInterval, index: number) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between p-2 px-3 rounded-2 border"
                style={{
                  backgroundColor: interval.type === 'blackout' ? '#f8fafc' : '#fef2f2',
                  borderColor: interval.type === 'blackout' ? '#e2e8f0' : '#fecaca',
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  {interval.type === 'blackout' ? (
                    <ShieldAlert size={16} className="text-secondary flex-shrink-0" />
                  ) : (
                    <Calendar size={16} className="text-danger flex-shrink-0" />
                  )}
                  <div>
                    <span className="fw-bold text-dark small">
                      {interval.startTime} – {interval.endTime}
                    </span>
                    <span className="text-muted small ms-2" style={{ fontSize: '0.78rem' }}>
                      {interval.label || (interval.type === 'blackout' ? 'Maintenance Blackout' : 'Booked')}
                    </span>
                  </div>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: interval.type === 'blackout' ? '#e2e8f0' : '#fee2e2',
                    color: interval.type === 'blackout' ? '#475569' : '#991b1b',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  {interval.type === 'blackout' ? 'Blackout' : 'Reserved'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-info-circle me-1" />
            You can book any custom duration during operating hours as long as it does not overlap with the reserved times above.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityGrid;
