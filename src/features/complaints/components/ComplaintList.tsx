import { useState, useEffect } from 'react';
import { complaintApi } from '../api/complaintApi';
import AppTable from '../../../components/AppTable/AppTable';
import Select from '../../../components/Select/Select';
import Pagination from '../../../components/Pagination/Pagination';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { SelectOption } from '../../../components/Select/Select';
import type { PaginatedResult } from '../../../types/pagination.types';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ComplaintPriorityBadge from './ComplaintPriorityBadge';
import ComplaintComments from './ComplaintComments';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import { useComplaintStore } from '../hooks/useComplaintStore';

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
  onUpdateStatus?: (complaint: Complaint, status: ComplaintStatus) => void;
  onDeleteComplaint?: (complaintId: number) => Promise<void>;
  isAdmin?: boolean;
  pagination?: Omit<PaginatedResult<unknown>, 'items'> | null;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const ComplaintList = ({
  complaints,
  loading,
  onUpdateStatus,
  onDeleteComplaint,
  isAdmin = false,
  pagination,
  onPageChange,
  onPageSizeChange
}: ComplaintListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const expId = params.get('expandedId');
    if (expId) {
      params.delete('expandedId');
      const newSearch = params.toString();
      const newUrl = newSearch
        ? `${window.location.pathname}?${newSearch}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState(null, '', newUrl);
      return Number(expId);
    }
    return null;
  });
  const [expandedDetail, setExpandedDetail] = useState<Complaint | null>(null);
  const [deletingComplaint, setDeletingComplaint] = useState<Complaint | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { filters } = useComplaintStore();
  const searchVal = filters.search ?? '';

  const highlightMatch = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    const cleanSearch = search.trim();
    const regex = new RegExp(`(${cleanSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark
              key={index}
              style={{
                backgroundColor: '#ffe066',
                color: '#1a1f36',
                padding: '0 2px',
                borderRadius: '3px',
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  useEffect(() => {
    if (!expandedId) {
      document.body.classList.remove('drawer-open');
      return;
    }
    document.body.classList.add('drawer-open');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedId(null);
        setExpandedDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let cancelled = false;
    (async () => {
      try {
        const detail = await complaintApi.getComplaint(expandedId);
        if (!cancelled) setExpandedDetail(detail);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load complaint details'));
      }
    })();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('drawer-open');
      cancelled = true;
    };
  }, [expandedId]);

  const handleCloseDrawer = () => {
    setExpandedId(null);
    setExpandedDetail(null);
  };

  const handleExpand = (complaint: Complaint) => {
    if (expandedId === complaint.id) {
      setExpandedId(null);
      setExpandedDetail(null);
    } else {
      setExpandedId(complaint.id);
      setExpandedDetail(null);
    }
  };

  const handleStatusChange = (complaint: Complaint, value: string) => {
    onUpdateStatus?.(complaint, value as ComplaintStatus);
  };

  const allColumnDefs: { key: string; label: string; adminWidth: string; residentWidth: string; render: (c: Complaint) => React.ReactNode }[] = [
    {
      key: 'chat', label: 'Chat', adminWidth: '60px', residentWidth: '60px',
      render: (c) => {
        const isResolved = c.status === 'Resolved';
        return (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              cursor: isResolved ? 'not-allowed' : 'pointer',
              minHeight: '34px',
              opacity: isResolved ? 0.5 : 1
            }}
            onClick={() => !isResolved && handleExpand(c)}
          >
            <i
              className={`bi bi-chat-left-text ${isResolved ? 'text-secondary' : 'text-primary'}`}
              style={{ fontSize: '1rem' }}
            />
          </div>
        );
      },
    },
    {
      key: 'title', label: 'Title', adminWidth: '30%', residentWidth: '40%',
      render: (c) => {
        const isResolved = c.status === 'Resolved';
        return (
          <div
            style={{ cursor: isResolved ? 'default' : 'pointer' }}
            onClick={() => !isResolved && handleExpand(c)}
          >
            <p className="fw-medium mb-0" style={{ fontSize: '0.875rem', color: '#1a1f36', lineHeight: '1.3' }}>
              {highlightMatch(c.title, searchVal)}
            </p>
          </div>
        );
      },
    },
    {
      key: 'status', label: 'Status', adminWidth: '14%', residentWidth: '19%',
      render: (c) => <ComplaintStatusBadge status={c.status} />,
    },
    {
      key: 'priority', label: 'Priority', adminWidth: '15%', residentWidth: '20%',
      render: (c) => <ComplaintPriorityBadge priority={c.priority} />,
    },
    {
      key: 'apt', label: 'Apt', adminWidth: '9%', residentWidth: '0%',
      render: (c) => {
        const apt = c.resident?.apartment;
        const label = apt ? `${apt.block}-${apt.floorNumber}${apt.unitNumber}` : '\u2014';
        return (
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'date', label: 'Date', adminWidth: '12%', residentWidth: '16%',
      render: (c) => (
        <span className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          {timeAgo(c.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', adminWidth: '16%', residentWidth: '12%',
      render: (c) => (
        <div onClick={(e) => e.stopPropagation()} style={{ width: '130px' }}>
          {isAdmin && c.status !== 'Resolved' && onUpdateStatus ? (
            <Select
              name="status"
              options={STATUS_OPTIONS}
              value={c.status}
              onChange={(e) => handleStatusChange(c, e.target.value)}
              className="shadow-none"
              style={{ height: '38px', fontSize: '0.8rem' }}
            />
          ) : null}
          {!isAdmin && onDeleteComplaint && c.status === 'Open' && (
            <button
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
              onClick={() => setDeletingComplaint(c)}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
              title="Delete complaint"
            >
              <i className="bi bi-trash" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const columns: TableColumn<Complaint>[] = allColumnDefs
    .filter((col) => isAdmin || (col.adminWidth !== '0%' && col.residentWidth !== '0%'))
    .map((col) => ({
      key: col.key,
      label: col.label,
      width: isAdmin ? col.adminWidth : col.residentWidth,
      render: col.render,
    }));

  const complaintFromList = complaints.find((c) => c.id === expandedId);
  const activeDetail = expandedDetail?.id === expandedId ? expandedDetail : complaintFromList;

  return (
    <div className="table-card">
      <AppTable
        columns={columns}
        data={complaints}
        loading={loading}
        rowKey={(c) => c.id}
        emptyTitle="No complaints found"
        emptySubtitle="There are no complaints matching your criteria. Try adjusting your filters or check back later."
        emptyIcon="bi-clipboard-check"
        skeletonRows={4}
      />
      {!loading && (complaints?.length ?? 0) > 0 && pagination && onPageChange && (
        <div className="table-card__footer">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}

      {/* ── Slide-Over Panel (Drawer) ── */}
      {expandedId && (
        <div className="complaint-drawer-backdrop" onClick={handleCloseDrawer}>
          <div className="complaint-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="complaint-drawer-header">
              {activeDetail ? (
                <div>
                  <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: '400px', fontSize: '1rem' }}>
                    {activeDetail.title}
                  </h6>
                  <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                    <ComplaintStatusBadge status={activeDetail.status} />
                    <ComplaintPriorityBadge priority={activeDetail.priority} />
                    {activeDetail.resident?.apartment && (
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                        Unit: {activeDetail.resident.apartment.block}-{activeDetail.resident.apartment.floorNumber}{activeDetail.resident.apartment.unitNumber}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <h6 className="mb-0 fw-bold text-dark">Complaint Chat</h6>
              )}
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={handleCloseDrawer}
                aria-label="Close"
              />
            </div>

            {/* Drawer Body */}
            <div className="complaint-drawer-body">
              {!expandedDetail || expandedDetail.id !== expandedId ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 flex-grow-1">
                  <span className="spinner-border spinner-border-sm text-primary mb-2" />
                  <span className="text-secondary small">Loading details...</span>
                </div>
              ) : (
                <>
                  <div className="complaint-drawer-info">
                    {expandedDetail.images && expandedDetail.images.length > 0 && (
                      <div className="mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {expandedDetail.images.map((img) => (
                          <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                            <img
                              src={img.imageUrl}
                              alt=""
                              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-secondary mb-0" style={{ fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      <strong>Description:</strong> {highlightMatch(expandedDetail.description, searchVal)}
                    </p>
                  </div>

                  {/* Chat Section */}
                  <div className="complaint-drawer-chat flex-grow-1 mt-3">
                    <ComplaintComments
                      complaintId={expandedDetail.id}
                      status={expandedDetail.status}
                      residentName={expandedDetail.resident?.user?.name ?? 'Unknown'}
                      isAdmin={isAdmin}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {deletingComplaint && (
        <ConfirmDialog
          show={!!deletingComplaint}
          title="Delete Complaint"
          message={deletingComplaint ? `Are you sure you want to delete "${deletingComplaint.title}"? This action cannot be undone.` : ''}
          confirmLabel="Delete"
          variant="danger"
          loading={deleteLoading}
          onConfirm={async () => {
            if (deletingComplaint) {
              setDeleteLoading(true);
              try {
                await onDeleteComplaint?.(deletingComplaint.id);
                setDeletingComplaint(null);
              } finally {
                setDeleteLoading(false);
              }
            }
          }}
          onCancel={() => setDeletingComplaint(null)}
        />
      )}
    </div>
  );
};

export default ComplaintList;
