import { useState } from 'react';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ComplaintPriorityBadge from './ComplaintPriorityBadge';
import type { Complaint, ComplaintStatus } from '../types/complaint.types';
import { PRIORITY_BORDER_COLOR } from '../constants/complaintStyles';

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

interface ComplaintCardProps {
  complaint: Complaint;
  onView: (complaint: Complaint) => void;
  onUpdateStatus?: (complaint: Complaint, status: ComplaintStatus) => void;
  isAdmin?: boolean;
}

const ComplaintCard = ({ complaint, onView, onUpdateStatus, isAdmin = false }: ComplaintCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = complaint.description.length > 160;
  const displayBody = isLong && !expanded ? complaint.description.slice(0, 160) + '...' : complaint.description;
  const isResolved = complaint.status === 'Resolved';

  return (
    <div
      className="d-flex align-items-start justify-content-between bg-white"
      style={{
        gap: '16px',
        borderTop: '0.5px solid #e5e7eb',
        borderRight: '0.5px solid #e5e7eb',
        borderBottom: '0.5px solid #e5e7eb',
        borderLeft: `3px solid ${PRIORITY_BORDER_COLOR[complaint.priority]}`,
        borderRadius: '0 12px 12px 0',
        padding: '14px 18px',
        opacity: isResolved ? 0.8 : 1,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
      }}
      onClick={() => onView(complaint)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="flex-grow-1 overflow-hidden">

        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <ComplaintStatusBadge status={complaint.status} />
          <ComplaintPriorityBadge priority={complaint.priority} />
        </div>

        <p className="fw-medium mb-1" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
          {complaint.title}
        </p>

        <p className="text-secondary mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
          {displayBody}
          {isLong && (
            <button
              className="btn btn-link p-0 ms-1"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              style={{ fontSize: '0.78rem', textDecoration: 'none' }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {complaint.images && complaint.images.length > 0 && (
          <div className="d-flex gap-2 mb-2">
            {complaint.images.slice(0, 3).map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt=""
                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '0.5px solid #e5e7eb' }}
              />
            ))}
            {complaint.images.length > 3 && (
              <div
                className="d-flex align-items-center justify-content-center fw-medium text-secondary"
                style={{ width: '44px', height: '44px', borderRadius: '6px', backgroundColor: '#f3f4f6', fontSize: '0.72rem' }}
              >
                +{complaint.images.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
          <i className="bi bi-person" />
          {complaint.resident ? `Apartment ${complaint.resident.apartmentId}` : 'Resident'}
          <span className="mx-1">&middot;</span>
          <i className="bi bi-clock" />
          {isResolved && complaint.resolvedAt ? `Resolved ${timeAgo(complaint.resolvedAt)}` : timeAgo(complaint.createdAt)}
        </div>

      </div>

      {isAdmin && !isResolved && onUpdateStatus && (
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <select
            className="form-select form-select-sm shadow-none"
            value={complaint.status}
            onChange={(e) => onUpdateStatus(complaint, e.target.value as ComplaintStatus)}
            style={{ fontSize: '0.8rem', borderRadius: '8px', minWidth: '130px' }}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      )}

    </div>
  );
};

export default ComplaintCard;