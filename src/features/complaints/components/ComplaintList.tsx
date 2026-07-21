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
  currentUserId?: number;
  disableChat?: boolean;
  hideChatColumn?: boolean;
  showResidentName?: boolean;
  bare?: boolean;
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
  currentUserId,
  disableChat = false,
  hideChatColumn = false,
  showResidentName = false,
  bare = false,
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

  const allColumnDefs: { key: string; label: string; adminWidth: string; residentWidth: string; align?: 'start' | 'center' | 'end'; show?: boolean; render: (c: Complaint) => React.ReactNode }[] = [
    {
      key: 'chat', label: 'Chat', align: 'center', adminWidth: '5%', residentWidth: '7%', show: !showResidentName && !hideChatColumn,
      render: (c) => {
        const isDisabled = disableChat || c.status === 'Resolved';
        return (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              minHeight: '34px',
              opacity: isDisabled ? 0.5 : 1
            }}
            onClick={() => !isDisabled && handleExpand(c)}
          >
            <i
              className={`bi bi-chat-left-text ${isDisabled ? 'text-secondary' : 'text-primary'}`}
              style={{ fontSize: '1rem' }}
            />
          </div>
        );
      },
    },
    {
      key: 'title', label: 'Title', align: 'center', adminWidth: '30%', residentWidth: showResidentName ? '28%' : hideChatColumn ? '40%' : '33%',
      render: (c) => {
        const isDisabled = disableChat || showResidentName || hideChatColumn || c.status === 'Resolved';
        return (
          <div
            style={{ cursor: isDisabled ? 'default' : 'pointer' }}
            onClick={() => !isDisabled && handleExpand(c)}
          >
            <p className="fw-medium mb-0" style={{ fontSize: '0.875rem', color: '#1a1f36', lineHeight: '1.3' }}>
              {highlightMatch(c.title, searchVal)}
            </p>
          </div>
        );
      },
    },
    {
      key: 'raisedBy', label: 'Raised By', align: 'center', adminWidth: '0%', residentWidth: '14.4%', show: showResidentName,
      render: (c) => (
        <span className="fw-medium" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
          {c.resident?.user?.name ?? '\u2014'}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', align: 'center', adminWidth: '14%', residentWidth: showResidentName ? '14.4%' : '15%',
      render: (c) => <ComplaintStatusBadge status={c.status} />,
    },
    {
      key: 'priority', label: 'Priority', align: 'center', adminWidth: '15%', residentWidth: showResidentName ? '14.4%' : '15%',
      render: (c) => <ComplaintPriorityBadge priority={c.priority} />,
    },
    {
      key: 'apt', label: 'Apt', align: 'center', adminWidth: '8%', residentWidth: '0%',
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
      key: 'date', label: 'Submitted', align: 'center', adminWidth: '10%', residentWidth: showResidentName ? '14.4%' : '15%',
      render: (c) => (
        <span className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          {timeAgo(c.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'center', adminWidth: '14%', residentWidth: showResidentName ? '14.4%' : '15%',
      render: (c) => {
        let actionContent: React.ReactNode = null;

        if (isAdmin && c.status !== 'Resolved' && onUpdateStatus) {
          actionContent = (
            <Select
              name="status"
              options={STATUS_OPTIONS}
              value={c.status}
              onChange={(e) => handleStatusChange(c, e.target.value)}
              className="shadow-none"
              style={{ height: '38px', fontSize: '0.8rem', width: '130px' }}
            />
          );
        } else if (!isAdmin && onDeleteComplaint && c.status === 'Open' && c.resident?.userId === currentUserId) {
          actionContent = (
            <button
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
              onClick={() => setDeletingComplaint(c)}
              style={{ borderRadius: '6px', fontSize: '0.78rem' }}
              title="Delete complaint"
            >
              <i className="bi bi-trash" />
            </button>
          );
        }

        return (
          <div onClick={(e) => e.stopPropagation()} className="d-flex justify-content-center">
            {actionContent ?? <span className="text-secondary" style={{ fontSize: '0.85rem' }}>&mdash;</span>}
          </div>
        );
      },
    },
  ];

  const columns: TableColumn<Complaint>[] = allColumnDefs
    .filter((col) => col.show !== false)
    .filter((col) => (isAdmin ? col.adminWidth !== '0%' : col.residentWidth !== '0%'))
    .map((col) => ({
      key: col.key,
      label: col.label,
      align: col.align,
      width: isAdmin ? col.adminWidth : col.residentWidth,
      render: col.render,
    }));

  const complaintFromList = complaints.find((c) => c.id === expandedId);
  const activeDetail = expandedDetail?.id === expandedId ? expandedDetail : complaintFromList;

  return (
    <div className={bare ? '' : 'table-card'}>
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
