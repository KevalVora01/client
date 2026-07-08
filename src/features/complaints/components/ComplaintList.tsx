import { useState } from 'react';
import { complaintApi } from '../api/complaintApi';
import AppTable from '../../../components/AppTable/AppTable';
import Select from '../../../components/Select/Select';
import type { TableColumn } from '../../../components/AppTable/AppTable';
import type { SelectOption } from '../../../components/Select/Select';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ComplaintPriorityBadge from './ComplaintPriorityBadge';
import ComplaintComments from './ComplaintComments';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
  onUpdateStatus?: (complaint: Complaint, status: ComplaintStatus) => void;
  isAdmin?: boolean;
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

const ComplaintList = ({ complaints, loading, onUpdateStatus, isAdmin = false }: ComplaintListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<Complaint | null>(null);

  const fetchDetail = async (complaintId: number) => {
    try {
      const detail = await complaintApi.getComplaint(complaintId);
      setExpandedDetail(detail);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load complaint details'));
    }
  };

  const handleExpand = (complaint: Complaint) => {
    if (expandedId === complaint.id) {
      setExpandedId(null);
      setExpandedDetail(null);
    } else {
      setExpandedId(complaint.id);
      setExpandedDetail(null);
      fetchDetail(complaint.id);
    }
  };

  const handleStatusChange = (complaint: Complaint, value: string) => {
    onUpdateStatus?.(complaint, value as ComplaintStatus);
  };

  const columns: TableColumn<Complaint>[] = [
    {
      key: 'expand',
      label: '',
      width: '40px',
      render: (c) => (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ cursor: 'pointer', minHeight: '24px' }}
          onClick={() => handleExpand(c)}
        >
          <i
            className={`bi ${expandedId === c.id ? 'bi-chevron-down' : 'bi-chevron-right'}`}
            style={{ fontSize: '0.85rem', color: '#9ca3af' }}
          />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      width: '30%',
      render: (c) => (
        <div style={{ cursor: 'pointer' }} onClick={() => handleExpand(c)}>
          <p className="fw-medium mb-0" style={{ fontSize: '0.875rem', color: '#1a1f36', lineHeight: '1.3' }}>
            {c.title}
          </p>
          {expandedId !== c.id && (
            <p className="text-muted mb-0" style={{ fontSize: '0.775rem', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {c.description.length > 80 ? c.description.slice(0, 80) + '...' : c.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '14%',
      render: (c) => <ComplaintStatusBadge status={c.status} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '15%',
      render: (c) => <ComplaintPriorityBadge priority={c.priority} />,
    },
    {
      key: 'date',
      label: 'Date',
      width: '12%',
      render: (c) => (
        <span className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          {timeAgo(c.createdAt)}
        </span>
      ),
    },
    {
      key: 'apt',
      label: 'Apt',
      width: '9%',
      render: (c) => (
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
          {c.resident ? `Apt ${c.resident.apartmentId}` : '\u2014'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '16%',
      render: (c) => (
        <div onClick={(e) => e.stopPropagation()}>
          {isAdmin && c.status !== 'Resolved' && onUpdateStatus ? (
            <Select
              name="status"
              options={STATUS_OPTIONS}
              value={c.status}
              onChange={(e) => handleStatusChange(c, e.target.value)}
              className="shadow-none"
              style={{ height: '32px', fontSize: '0.8rem', minWidth: '120px' }}
            />
          ) : null}
        </div>
      ),
    },
  ];

  const renderExpandedRow = (complaint: Complaint) => {
    const detail = expandedDetail?.id === complaint.id ? expandedDetail : complaint;
    return (
    <div className="p-4">
      <div className="row g-4">
        <div className="col-12 col-md-5 col-lg-4">
          {detail.images && detail.images.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mb-3">
              {detail.images.map((img) => (
                <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img.imageUrl}
                    alt=""
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </a>
              ))}
            </div>
          )}

          <p className="text-secondary mb-0" style={{ fontSize: '0.875rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {complaint.description}
          </p>
        </div>

        <div className="col-12 col-md-7 col-lg-8">
          <ComplaintComments
            complaintId={complaint.id}
            status={complaint.status}
            residentName={detail.resident?.user?.name ?? `Apt ${detail.resident?.apartmentId ?? '—'}`}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      <button
        className="btn btn-link p-0 mt-3 fw-medium text-decoration-none"
        onClick={() => setExpandedId(null)}
        style={{ fontSize: '0.78rem', color: '#6b7280' }}
      >
        <i className="bi bi-chevron-up me-1" />Show less
      </button>
    </div>
  );
  };

  return (
    <div>
      <AppTable
        columns={columns}
        data={complaints}
        loading={loading}
        rowKey={(c) => c.id}
        expandedRowKey={expandedId}
        renderExpandedRow={renderExpandedRow}
        emptyTitle="No complaints found"
        emptySubtitle="There are no complaints matching your criteria. Try adjusting your filters or check back later."
        emptyIcon="bi-clipboard-check"
        skeletonRows={4}
      />
    </div>
  );
};

export default ComplaintList;
