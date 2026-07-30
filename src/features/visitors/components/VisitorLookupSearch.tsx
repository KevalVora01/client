import React, { useState } from 'react';
import { useVisitorSearch } from '../hooks/useVisitorSearch';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import VisitorCard from './VisitorCard';
import type { Visitor } from '../types/visitor.types';
import { Search, UserCheck, X, Sparkles, Filter } from 'lucide-react';

interface VisitorLookupSearchProps {
  onCheckIn?: (visitor: Visitor) => void;
  onCheckInSuccess?: () => void;
  checkInLoading?: boolean;
}

const PRESET_FILTERS = ['All', 'Guest', 'Delivery', 'Cab', 'Service'];

export const VisitorLookupSearch: React.FC<VisitorLookupSearchProps> = ({
  onCheckIn,
  onCheckInSuccess,
  checkInLoading,
}) => {
  const { setQuery, results, loading, search } = useVisitorSearch();
  const { checkIn, actionId } = useVisitorMutations();
  const [localQuery, setLocalQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

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

  const handlePresetClick = (filter: string) => {
    setSelectedFilter(filter);
    const queryTerm = filter === 'All' ? '' : filter;
    setLocalQuery(queryTerm);
    setQuery(queryTerm);
    search(queryTerm);
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

  // Ensure ONLY pre-registered visitors are displayed
  const preRegisteredOnly = results.filter(r => r.isPreRegistered === true);

  const filteredResults = selectedFilter === 'All'
    ? preRegisteredOnly
    : preRegisteredOnly.filter(r => r.purpose?.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div
      className="card border border-primary-subtle shadow-sm rounded-4 overflow-hidden p-3.5 p-md-4"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)' }}
    >
      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center gap-2.5">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary shadow-xs"
            style={{ width: '42px', height: '42px' }}
          >
            <UserCheck size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
              Pre-Registered Expected Visitors
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
              Pre-approved guest entries created by residents.
            </p>
          </div>
        </div>

        <span className="badge bg-primary-subtle text-primary border border-primary-subtle font-monospace d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
          <Sparkles size={13} />
          Pre-Registered Only
        </span>
      </div>

      {/* ── Interactive Search Bar ── */}
      <form onSubmit={handleSearchSubmit} className="mb-3">
        <div className="input-group input-group-lg shadow-sm border border-light-subtle rounded-3 overflow-hidden bg-white">
          <span className="input-group-text bg-white border-0 ps-3 pe-2 text-secondary">
            <Search size={20} className="text-primary" />
          </span>
          <input
            type="text"
            className="form-control border-0 ps-1 fs-6 shadow-none"
            placeholder="Search pre-registered guest name or phone..."
            value={localQuery}
            onChange={handleInputChange}
            style={{ fontSize: '0.925rem' }}
          />
          {localQuery && (
            <button
              type="button"
              className="btn btn-link text-secondary text-decoration-none border-0 px-2"
              onClick={handleClearQuery}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary px-4 fw-semibold border-0"
            disabled={loading}
            style={{ backgroundColor: '#0d6efd' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* ── Quick Purpose Filter Chips ── */}
      <div className="d-flex align-items-center gap-1.5 flex-wrap mb-3">
        <span className="text-muted me-1 d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
          <Filter size={12} />
          Filter:
        </span>
        {PRESET_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`btn btn-sm rounded-pill fw-medium px-3 py-1 transition-all ${
              selectedFilter === filter
                ? 'btn-dark text-white shadow-xs'
                : 'btn-outline-secondary border-light-subtle bg-white text-secondary'
            }`}
            style={{ fontSize: '0.75rem' }}
            onClick={() => handlePresetClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Search Results List ── */}
      {loading ? (
        <div className="d-flex flex-column gap-2 mt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: '72px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-3 border border-light-subtle text-center py-4 px-3 mt-1 shadow-xs">
          <UserCheck size={32} className="text-muted mb-2 opacity-50" />
          <p className="fw-semibold text-dark mb-1" style={{ fontSize: '0.875rem' }}>
            {localQuery.trim() ? `No pre-registered visitors found matching "${localQuery}"` : 'No pre-registered visitors expected today'}
          </p>
          <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
            {localQuery.trim() ? 'Verify the guest phone number or name.' : 'Pre-registered guests created by residents will appear here.'}
          </p>
        </div>
      ) : (
        <div className="mt-1">
          <div className="d-flex align-items-center justify-content-between mb-2.5">
            <h6 className="fw-bold text-secondary mb-0 small text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>
              Pre-Registered Visitors ({filteredResults.length})
            </h6>
          </div>
          <div className="d-flex flex-column gap-2.5">
            {filteredResults.map((visitor) => (
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