import { Link } from 'react-router-dom';
import type { Amenity } from '../types/amenity.types';

interface AmenityCardProps {
  amenity: Amenity;
  isAdmin: boolean;
  onEdit: (amenity: Amenity) => void;
  onDeactivate: (amenity: Amenity) => void;
}

const AmenityCard = ({ amenity, isAdmin, onEdit, onDeactivate }: AmenityCardProps) => (
  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
    <div className="card-body d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
        <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>{amenity.name}</h6>
        <span
          className="badge flex-shrink-0"
          style={{
            backgroundColor: amenity.isActive ? '#d1fae5' : '#f3f4f6',
            color: amenity.isActive ? '#065f46' : '#6b7280',
            fontSize: '0.72rem',
          }}
        >
          {amenity.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {amenity.description && <p className="text-muted small mb-2">{amenity.description}</p>}

      <div className="text-secondary small mb-3">
        <div><i className="bi bi-clock me-1" /> {amenity.operatingStart} – {amenity.operatingEnd}</div>
        {amenity.capacity != null && (
          <div><i className="bi bi-people me-1" /> Capacity: {amenity.capacity}</div>
        )}
      </div>

      <div className="mt-auto d-flex gap-2">
        <Link
          to={`/amenities/${amenity.id}`}
          className="btn btn-sm btn-dark flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-eye" /> View
        </Link>
        {isAdmin && (
          <>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: '8px' }}
              onClick={() => onEdit(amenity)}
              aria-label="Edit"
            >
              <i className="bi bi-pencil" />
            </button>
            {amenity.isActive && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                style={{ borderRadius: '8px' }}
                onClick={() => onDeactivate(amenity)}
                aria-label="Deactivate"
              >
                <i className="bi bi-eye-slash" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

export default AmenityCard;
