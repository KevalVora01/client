import React, { useState } from 'react';
import { useVisitorSearch } from '../hooks/useVisitorSearch';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import type { Visitor } from '../types/visitor.types';
import { Search, UserCheck, X, Clock, Car, Phone, MapPin, CheckCircle2, User } from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

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

  const handleClearQuery = () => {
    setLocalQuery('');
    setQuery('');
  };

  const handleVisitorCheckIn = async (visitor: Visitor) => {
    if (onCheckIn) {
      await onCheckIn(visitor);
      search(localQuery);
      return;
    }

    const success = await checkIn(visitor.id);
    if (success) {
      search(localQuery);
      onCheckInSuccess?.();
    }
  };

  const filteredResults = results.filter(r => r.isPreRegistered === true && r.status === 'Approved');

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      {/* ── Header ── */}
      <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: '40px', height: '40px', backgroundColor: '#1a1f36' }}
            >
              <UserCheck size={20} className="text-white" />
            </div>
            <div>
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
                Pre-Registered Visitors
              </h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                Search by name or phone to find expected guests
              </p>
            </div>
          </div>
          {filteredResults.length > 0 && (
            <span className="badge bg-dark text-white rounded-pill px-2.5 py-1" style={{ fontSize: '0.7rem' }}>
              {filteredResults.length} found
            </span>
          )}
        </div>
      </div>

      <div className="card-body p-4">

        {/* ── Search Bar ── */}
        <form onSubmit={handleSearchSubmit} className="mb-3">
          <div className="input-group shadow-sm rounded-3 overflow-hidden" style={{ border: '1.5px solid #e2e8f0' }}>
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 ps-1 shadow-none bg-white"
              placeholder="Search guest name or phone number..."
              value={localQuery}
              onChange={handleInputChange}
              style={{ fontSize: '0.875rem', height: '44px' }}
            />
            {localQuery && (
              <button
                type="button"
                className="btn btn-link text-muted text-decoration-none border-0 px-2"
                onClick={handleClearQuery}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="btn px-4 fw-semibold border-0 d-inline-flex align-items-center gap-1.5"
              disabled={loading}
              style={{ backgroundColor: '#1a1f36', color: '#fff', fontSize: '0.85rem' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* ── Results ── */}
        {loading ? (
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#f9fafb' }}>
                <div className="skeleton rounded-2 flex-shrink-0" style={{ width: '44px', height: '44px' }} />
                <div className="flex-grow-1">
                  <div className="skeleton mb-2" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
                </div>
                <div className="skeleton rounded-pill" style={{ width: '80px', height: '32px' }} />
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ backgroundColor: '#f9fafb' }}>
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '56px', height: '56px', backgroundColor: '#e5e7eb' }}
            >
              <UserCheck size={24} className="text-muted" />
            </div>
            <p className="fw-semibold text-dark mb-1" style={{ fontSize: '0.875rem' }}>
              {localQuery.trim()
                ? `No visitors found for "${localQuery}"`
                : 'No pre-registered visitors'}
            </p>
            <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
              {localQuery.trim()
                ? 'Try a different name or phone number'
                : 'Pre-registered guests will appear here'}
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {filteredResults.map((visitor) => (
              <div
                key={visitor.id}
                className="card border rounded-3 p-0 shadow-xs overflow-hidden"
                style={{
                  borderColor: '#e5e7eb',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <div className="d-flex align-items-center gap-3 p-3">
                  {/* Photo / Avatar */}
                  {visitor.photoUrl ? (
                    <img
                      src={visitor.photoUrl}
                      alt={visitor.name}
                      className="rounded-2 flex-shrink-0 object-fit-cover border"
                      style={{ width: '48px', height: '48px', borderColor: '#e5e7eb' }}
                    />
                  ) : (
                    <div
                      className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9' }}
                    >
                      <User size={20} className="text-muted" />
                    </div>
                  )}

                  {/* Visitor Info */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-2 mb-0.5">
                      <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.875rem', color: '#1a1f36' }}>
                        {visitor.name}
                      </h6>
                      {visitor.apartment && (
                        <span className="badge bg-light text-dark font-monospace flex-shrink-0" style={{ fontSize: '0.65rem', border: '1px solid #e5e7eb' }}>
                          {visitor.apartment.block}-{visitor.apartment.floorNumber}{visitor.apartment.unitNumber}
                        </span>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.75rem' }}>
                      <span className="text-muted d-inline-flex align-items-center gap-1">
                        <Phone size={11} /> {visitor.phone}
                      </span>
                      <span className="text-muted">&middot;</span>
                      <span className="text-muted d-inline-flex align-items-center gap-1">
                        <MapPin size={11} /> {visitor.purpose}
                      </span>
                      {visitor.vehicleNumber && (
                        <>
                          <span className="text-muted">&middot;</span>
                          <span className="text-muted d-inline-flex align-items-center gap-1 font-monospace">
                            <Car size={11} /> {visitor.vehicleNumber}
                          </span>
                        </>
                      )}
                    </div>
                    {visitor.expectedAt && (
                      <div className="mt-1 d-inline-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.7rem' }}>
                        <Clock size={10} /> Expected: {formatDate(visitor.expectedAt)}
                      </div>
                    )}
                  </div>

                  {/* Check In Button */}
                  <button
                    type="button"
                    disabled={checkInLoading || actionId === visitor.id}
                    className="btn btn-sm fw-semibold px-3 py-2 d-inline-flex align-items-center gap-1.5 flex-shrink-0 rounded-2"
                    onClick={() => handleVisitorCheckIn(visitor)}
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#fff',
                      fontSize: '0.8rem',
                      minWidth: '100px',
                    }}
                  >
                    {checkInLoading && actionId === visitor.id ? (
                      <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        Check In
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorLookupSearch;
