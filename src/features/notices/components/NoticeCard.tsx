import { useState } from 'react';
import { Pin, AlertTriangle } from 'lucide-react';
import type { Notice, NoticeCategory } from '../types/notice.types';

const CATEGORY_BADGE: Record<NoticeCategory, { bg: string; color: string; border: string }> = {
  General: { bg: '#e8f0fe', color: '#1a56db', border: '#3b82f6' },
  Maintenance: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
  Emergency: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
  Event: { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
};

const CATEGORY_ICON: Record<NoticeCategory, string> = {
  General: 'bi-megaphone',
  Maintenance: 'bi-tools',
  Emergency: 'bi-exclamation-triangle-fill',
  Event: 'bi-calendar-event',
};

const CATEGORY_EMERGENCY_BG = 'linear-gradient(135deg, #fef2f2 0%, #fff 50%)';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });
}

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onTogglePin: (notice: Notice) => void;
  readOnly?: boolean;
}

const NoticeCard = ({ notice, onEdit, onDelete, onTogglePin, readOnly = false }: NoticeCardProps) => {
  const badge = CATEGORY_BADGE[notice.category];
  const [expanded, setExpanded] = useState(false);
  const isLong = notice.body.length > 200;
  const displayBody = isLong && !expanded ? notice.body.slice(0, 200) + '...' : notice.body;

  return (
    <div
      className="d-flex align-items-start justify-content-between rounded-3 bg-white notice-card"
      style={{
        gap: '12px',
        borderLeft: `4px solid ${badge.border}`,
        borderTop: '1px solid #f0f0f0',
        borderRight: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 20px',
        background: notice.category === 'Emergency' ? CATEGORY_EMERGENCY_BG : undefined,
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Left — info ── */}
      <div className="flex-grow-1 overflow-hidden">

        {/* Category + Pinned + Emergency icon */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <span
            className="fw-medium d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: '0.72rem',
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.02em',
            }}
          >
            <i className={`bi ${CATEGORY_ICON[notice.category]}`} style={{ fontSize: '0.65rem' }} />
            {notice.category}
          </span>
          {notice.category === 'Emergency' && (
            <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: '0.72rem', color: '#991b1b' }}>
              <AlertTriangle size={12} strokeWidth={2.5} />
              Attention
            </span>
          )}
          {notice.isPinned && (
            <span
              className="d-inline-flex align-items-center gap-1 fw-medium"
              style={{ fontSize: '0.7rem', color: '#92400e', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '20px' }}
            >
              <Pin size={11} strokeWidth={2} />
              Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#1a1f36', lineHeight: '1.4' }}>
          {notice.title}
        </p>

        {/* Body */}
        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
          {displayBody}
          {isLong && (
            <button
              className="btn btn-link p-0 ms-1 fw-medium"
              onClick={() => setExpanded(!expanded)}
              style={{ fontSize: '0.8rem', textDecoration: 'none', verticalAlign: 'baseline' }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Footer */}
        <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.72rem' }}>
          {notice.admin && (
            <>
              <i className="bi bi-person" />
              <span className="fw-medium" style={{ color: '#6b7280' }}>{notice.admin.name}</span>
              <span className="mx-1">·</span>
            </>
          )}
          <i className="bi bi-clock" />
          <span title={new Date(notice.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}>
            {timeAgo(notice.publishedAt)}
          </span>
        </div>

      </div>

      {/* ── Right — actions (admin only) ── */}
      {!readOnly && (
        <div className="d-flex align-items-center gap-1 flex-shrink-0">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary border-0 p-1"
            title={notice.isPinned ? 'Unpin' : 'Pin'}
            onClick={() => onTogglePin(notice)}
            style={{ borderRadius: '6px' }}
          >
            <i className={`bi ${notice.isPinned ? 'bi-pin-fill' : 'bi-pin'}`} style={{ fontSize: '0.875rem' }} />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem', borderRadius: '8px' }}
            onClick={() => onEdit(notice)}
          >
            <i className="bi bi-pencil" /> Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem', borderRadius: '8px' }}
            onClick={() => onDelete(notice)}
          >
            <i className="bi bi-trash3" /> Remove
          </button>
        </div>
      )}

    </div>
  );
};

export default NoticeCard;