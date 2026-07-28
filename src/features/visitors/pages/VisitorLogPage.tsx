import React, { useState } from 'react';
import type { VisitorStatus } from '../types/visitor.types';
import VisitorStatsRow from '../components/VisitorStatsRow';
import VisitorCard from '../components/VisitorCard';
import PreRegisterVisitorModal from '../components/PreRegisterVisitorModal';
import useAuth from '../../../hooks/useAuth';
import { useVisitors } from '../hooks/useVisitors';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import { Search, Plus, Filter, RefreshCw, ChevronLeft, ChevronRight, History } from 'lucide-react';

export const VisitorLogPage: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role ?? 'resident';

  const {
    visitors,
    loading,
    statusFilter,
    pageNumber,
    totalPages,
    totalCount,
    setPageNumber,
    setStatusFilter,
    setSearchQuery,
    refetch: refetchVisitors,
  } = useVisitors({ userRole, pageSize: 9 });

  const { metrics, loading: loadingMetrics, refetch: refetchMetrics } = useDashboardMetrics(
    userRole === 'admin' || userRole === 'security'
  );

  const { respond, checkIn, checkOut, cancel } = useVisitorMutations();

  const [searchInput, setSearchInput] = useState('');
  const [showPreRegisterModal, setShowPreRegisterModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleApprove = async (visitorId: number) => {
    await respond(visitorId, 'Approve');
    refetchVisitors();
    if (userRole !== 'resident') refetchMetrics();
  };

  const handleReject = async (visitorId: number) => {
    await respond(visitorId, 'Reject');
    refetchVisitors();
    if (userRole !== 'resident') refetchMetrics();
  };

  const handleCheckIn = async (visitorId: number) => {
    await checkIn(visitorId);
    refetchVisitors();
    refetchMetrics();
  };

  const handleCheckOut = async (visitorId: number) => {
    await checkOut(visitorId);
    refetchVisitors();
    refetchMetrics();
  };

  const handleCancel = async (visitorId: number) => {
    await cancel(visitorId);
    refetchVisitors();
  };

  const statuses: Array<{ key: VisitorStatus | 'ALL'; label: string }> = [
    { key: 'ALL', label: 'All Statuses' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Approved', label: 'Approved' },
    { key: 'CheckedIn', label: 'Checked In' },
    { key: 'CheckedOut', label: 'Checked Out' },
    { key: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#0f172a' }}>
            {userRole === 'resident' ? 'My Apartment Visitor History' : 'Society Visitor Register'}
          </h4>
          <p className="text-muted small mb-0">
            {userRole === 'resident'
              ? 'View visitor history and pre-register expected guests for your apartment'
              : 'Complete visitor entry & exit logs across all society apartments'}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {userRole === 'resident' && (
            <button
              className="btn btn-primary rounded-2 d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-xs"
              onClick={() => setShowPreRegisterModal(true)}
            >
              <Plus size={18} />
              Pre-Register Visitor
            </button>
          )}

          <button
            className="btn btn-outline-secondary btn-sm p-2 rounded-2"
            onClick={() => {
              refetchVisitors();
              if (userRole !== 'resident') refetchMetrics();
            }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Admin / Security Stats Row */}
      {(userRole === 'admin' || userRole === 'security') && (
        <VisitorStatsRow metrics={metrics} loading={loadingMetrics} />
      )}

      {/* Filters and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Status Pills */}
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center gap-1.5 flex-wrap">
              <span className="text-muted small fw-semibold me-2 d-none d-sm-inline">
                <Filter size={14} className="me-1" />
                Filter:
              </span>
              {statuses.map(({ key, label }) => (
                <button
                  key={key}
                  className={`btn btn-sm rounded-pill px-3 fw-medium ${
                    statusFilter === key ? 'btn-primary shadow-xs' : 'btn-light text-secondary border-0'
                  }`}
                  onClick={() => setStatusFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="col-12 col-lg-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by visitor name or phone..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Visitor Cards Grid */}
      {loading ? (
        <div className="p-5 text-center text-muted border rounded-3 bg-white">
          <div className="spinner-border text-primary me-2" role="status"></div>
          Loading visitor logs...
        </div>
      ) : visitors.length === 0 ? (
        <div className="p-5 text-center text-muted border rounded-3 bg-white">
          <History size={40} className="text-secondary opacity-50 mb-2" />
          <h6 className="fw-bold mb-1">No visitors found</h6>
          <p className="small mb-0">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {visitors.map((visitor) => (
              <div key={visitor.id} className="col-12 col-md-6 col-lg-4">
                <VisitorCard
                  visitor={visitor}
                  userRole={userRole}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  onCancel={handleCancel}
                />
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between border-top pt-3 flex-wrap gap-2">
              <span className="text-muted small">
                Showing page {pageNumber} of {totalPages} ({totalCount} total entries)
              </span>
              <div className="d-flex align-items-center gap-1">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2 d-flex align-items-center gap-1"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2 d-flex align-items-center gap-1"
                  disabled={pageNumber >= totalPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Pre-Register Modal for Residents */}
      {showPreRegisterModal && (
        <PreRegisterVisitorModal
          show={showPreRegisterModal}
          onClose={() => setShowPreRegisterModal(false)}
          onSuccess={refetchVisitors}
        />
      )}
    </div>
  );
};

export default VisitorLogPage;
