import React, { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import VisitorTable from '../components/VisitorTable';
import VisitorCardGrid from '../components/VisitorCardGrid';
import VisitorAccordionList from '../components/VisitorAccordionList';
import PreRegisterVisitorModal from '../components/PreRegisterVisitorModal';
import Pagination from '../../../components/Pagination/Pagination';
import PendingApprovalCard from '../components/PendingApprovalCard';
import type { PaginatedVisitors, VisitorStatus } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';
import useAuth from '../../../hooks/useAuth';
import { useVisitorMutations } from '../hooks/useVisitorMutations';

const STATUS_OPTIONS: { value: VisitorStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'CheckedIn', label: 'Checked In' },
  { value: 'CheckedOut', label: 'Checked Out' },
];

const VisitorLogPage = () => {
  const { user } = useAuth();
  const isResident = user?.role === 'resident';
  const { respond, cancel } = useVisitorMutations();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VisitorStatus | ''>('');
  const [results, setResults] = useState<PaginatedVisitors | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPreRegisterModal, setShowPreRegisterModal] = useState(false);

  const fetchLog = useCallback(async (page: number = 1, overrideSearch?: string, overrideStatus?: VisitorStatus | '') => {
    setLoading(true);
    try {
      const params = {
        search: (overrideSearch !== undefined ? overrideSearch : search).trim() || undefined,
        status: (overrideStatus !== undefined ? overrideStatus : status) || undefined,
        pageNumber: page,
        pageSize: 15,
      };

      const data = isResident
        ? await visitorApi.getMyVisitors(params)
        : await visitorApi.getAll(params);

      setResults(data);
      setPageNumber(page);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch visitor log'));
    } finally {
      setLoading(false);
    }
  }, [isResident, search, status]);

  useEffect(() => {
    let isSubscribed = true;
    Promise.resolve().then(() => {
      if (isSubscribed) {
        fetchLog(1);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [isResident, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLog(1);
  };

  const handleApprove = async (visitorId: number) => {
    await respond(visitorId, 'Approve');
    fetchLog(pageNumber);
  };

  const handleReject = async (visitorId: number) => {
    await respond(visitorId, 'Reject');
    fetchLog(pageNumber);
  };

  const handleCancel = async (visitorId: number) => {
    await cancel(visitorId);
    fetchLog(pageNumber);
  };

  const pendingVisitors = (results?.items ?? []).filter((v) => v.status === 'Pending');

  return (
    <div className="container-fluid p-3 p-md-4">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4 fs-sm-3" style={{ color: '#1a1f36' }}>
            {isResident ? 'My Visitors' : 'Visitor Logs'}
          </h4>
          <p className="text-muted mb-0 small">
            {isResident
              ? 'Pre-register expected guests and manage visitor history for your apartment.'
              : 'Search and browse the full visitor history across society.'}
          </p>
        </div>
        {isResident && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2"
              onClick={() => setShowPreRegisterModal(true)}
              style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
            >
              <i className="bi bi-plus-lg" /> Pre-Register Visitor
            </button>
          </div>
        )}
      </div>

      {/* ── Action Required Pending Approvals Banner (For Residents) ── */}
      {isResident && pendingVisitors.length > 0 && (
        <div className="card border-warning bg-warning bg-opacity-10 rounded-3 p-3 mb-4">
          <h6 className="fw-bold text-warning-emphasis mb-2 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
            Action Required — Pending Gate Approvals ({pendingVisitors.length})
          </h6>
          <div className="d-flex flex-column gap-2">
            {pendingVisitors.map((visitor) => (
              <PendingApprovalCard
                key={visitor.id}
                visitor={visitor}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3 mb-4">
        <form onSubmit={handleSearch} className="d-flex align-items-center gap-2 flex-wrap">
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '260px', borderRadius: '8px', fontSize: '0.875rem' }}
          />
          <select
            className="form-select shadow-none"
            value={status}
            onChange={(e) => setStatus(e.target.value as VisitorStatus | '')}
            style={{ maxWidth: '160px', borderRadius: '8px', fontSize: '0.875rem' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '8px', fontSize: '0.875rem' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* ── 1. Desktop View (>= 992px / lg): Full Table ── */}
      <div className="d-none d-lg-block card bg-white border border-light-subtle rounded-3 shadow-sm overflow-hidden">
        <VisitorTable
          visitors={results?.items ?? []}
          loading={loading}
          search={search}
          isResident={isResident}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
        />
      </div>

      {/* ── 2. Tablet View (768px - 991px / md): 2-Column Card Grid ── */}
      <div className="d-none d-md-block d-lg-none">
        <VisitorCardGrid
          visitors={results?.items ?? []}
          loading={loading}
          search={search}
          isResident={isResident}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
          onPreRegister={() => setShowPreRegisterModal(true)}
        />
      </div>

      {/* ── 3. Mobile View (< 768px / sm & xs): Touch Accordion List ── */}
      <div className="d-md-none">
        <VisitorAccordionList
          visitors={results?.items ?? []}
          loading={loading}
          search={search}
          isResident={isResident}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
          onPreRegister={() => setShowPreRegisterModal(true)}
        />
      </div>

      {/* Pagination Footer */}
      {(!loading && results && results.items.length > 0) && (
        <div className="card bg-white border border-light-subtle rounded-3 shadow-sm p-3 mt-3">
          <Pagination
            pagination={results}
            onPageChange={(page) => fetchLog(page)}
          />
        </div>
      )}

      {/* ── Pre-Register Visitor Modal ── */}
      {showPreRegisterModal && (
        <PreRegisterVisitorModal
          show={showPreRegisterModal}
          onClose={() => setShowPreRegisterModal(false)}
          onSuccess={() => fetchLog(1)}
        />
      )}

    </div>
  );
};

export default VisitorLogPage;