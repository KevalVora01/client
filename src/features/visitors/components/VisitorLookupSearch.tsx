import React, { useState } from 'react';
import { useVisitorSearch } from '../hooks/useVisitorSearch';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import VisitorCard from './VisitorCard';
import type { Visitor } from '../types/visitor.types';
import { Search, UserCheck } from 'lucide-react';

interface VisitorLookupSearchProps {
  onCheckIn?: (visitor: Visitor) => void;
  onCheckInSuccess?: () => void;
  checkInLoading?: boolean;
}

export const VisitorLookupSearch: React.FC<VisitorLookupSearchProps> = ({
  onCheckIn,
  onCheckInSuccess,
  checkInLoading,
}) => {
  const { setQuery, results, loading, search } = useVisitorSearch();
  const { checkIn, actionId } = useVisitorMutations();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(localQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    setQuery(val);
  };

  const handleVisitorCheckIn = async (visitor: Visitor) => {
    if (onCheckIn) {
      onCheckIn(visitor);
      return;
    }

    const success = await checkIn(visitor.id);
    if (success) {
      search(localQuery);
      onCheckInSuccess?.();
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 bg-white p-3 p-md-4 mb-4">
      <h5 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
        <UserCheck size={20} className="text-primary" />
        Lookup Expected / Approved Visitors
      </h5>
      <p className="text-muted small mb-3">
        Enter visitor name or 10-digit phone number to verify pre-registration and grant gate entry.
      </p>

      <form onSubmit={handleSearchSubmit} className="mb-3">
        <div className="input-group input-group-lg shadow-xs">
          <span className="input-group-text bg-white border-end-0">
            <Search size={20} className="text-secondary" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0 fs-6"
            placeholder="Search by Visitor Name or Phone..."
            value={localQuery}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary px-4 fs-6 fw-semibold" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Search results list */}
      {loading && (
        <div className="d-flex flex-column gap-2 mt-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: '72px', borderRadius: '12px' }} />
          ))}
        </div>
      )}

      {!loading && localQuery.trim().length >= 2 && results.length === 0 && (
        <p className="text-secondary text-center py-3 mb-0" style={{ fontSize: '0.88rem' }}>
          No pre-registered or approved visitors found matching "{localQuery}"
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-3">
          <h6 className="fw-bold text-secondary mb-2 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
            Matching Approved Visitors ({results.length})
          </h6>
          <div className="d-flex flex-column gap-2">
            {results.map((visitor) => (
              <VisitorCard
                key={visitor.id}
                visitor={visitor}
                actionLabel="Check In Visitor"
                onAction={() => handleVisitorCheckIn(visitor)}
                actionLoading={checkInLoading || actionId === visitor.id}
                actionVariant="success"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorLookupSearch;