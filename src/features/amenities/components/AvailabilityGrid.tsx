import type { AvailabilityResult } from '../types/amenity.types';
import { SLOT_CONFIG } from '../constants/amenityConstants';

interface AvailabilityGridProps {
  availability: AvailabilityResult | null;
  loading: boolean;
  onSelectSlot?: (start: string, end: string) => void;
}

const AvailabilityGrid = ({ availability, loading, onSelectSlot }: AvailabilityGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border spinner-border-sm text-primary" role="status" />
      </div>
    );
  }

  if (!availability) return null;

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        {(Object.keys(SLOT_CONFIG) as Array<keyof typeof SLOT_CONFIG>).map((key) => (
          <span key={key} className="d-inline-flex align-items-center gap-1 small text-secondary">
            <span
              className="rounded"
              style={{ width: 14, height: 14, backgroundColor: SLOT_CONFIG[key].bg, display: 'inline-block' }}
            />
            {SLOT_CONFIG[key].label}
          </span>
        ))}
      </div>

      <div
        className="d-grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}
      >
        {(availability?.slots ?? []).map((slot, index) => {
          const cfg = SLOT_CONFIG[slot.status];
          const clickable = slot.status === 'free' && !!onSelectSlot;
          return (
            <button
              key={index}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelectSlot?.(slot.start, slot.end)}
              className="btn text-start fw-medium"
              style={{
                backgroundColor: cfg.bg,
                color: cfg.color,
                borderRadius: '8px',
                fontSize: '0.8rem',
                opacity: clickable ? 1 : 0.7,
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              {slot.start}
              <br />
              <span className="opacity-75">– {slot.end}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityGrid;
