import React, { useState, useMemo } from 'react';
import type { Visitor } from '../types/visitor.types';
import CurrentlyInsideList from '../components/CurrentlyInsideList';
import { useCurrentlyInside } from '../hooks/useCurrentlyInside';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import { Search, RefreshCw } from 'lucide-react';

export const CheckOutPage: React.FC = () => {
  const { visitors, loading, refetch: fetchCurrentlyInside } = useCurrentlyInside();
  const { checkOut } = useVisitorMutations();

  const [search, setSearch] = useState('');

  const filteredVisitors = useMemo(() => {
    if (!search.trim()) return visitors;
    const q = search.toLowerCase();
    return visitors.filter(
      (v: Visitor) => v.name.toLowerCase().includes(q) || v.phone.includes(q) || v.purpose.toLowerCase().includes(q)
    );
  }, [search, visitors]);

  const handleCheckOut = async (visitorId: number) => {
    await checkOut(visitorId);
    fetchCurrentlyInside();
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#0f172a' }}>
            Security Gate — Visitor Check-Out
          </h4>
          <p className="text-muted small mb-0">Record visitor exits and clear active occupancy logs</p>
        </div>

        <button className="btn btn-outline-secondary btn-sm rounded-2 d-flex align-items-center gap-1.5" onClick={fetchCurrentlyInside}>
          <RefreshCw size={15} />
          Refresh List
        </button>
      </div>

      {/* Search box */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={18} className="text-secondary" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search active visitors by name, phone, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="row">
        <div className="col-12 col-lg-9">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold mb-0 text-dark">
              Visitors Currently Inside ({filteredVisitors.length})
            </h6>
          </div>

          <CurrentlyInsideList visitors={filteredVisitors} loading={loading} onCheckOut={handleCheckOut} />
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
