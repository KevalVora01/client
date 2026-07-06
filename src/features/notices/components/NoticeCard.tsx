import { Pin } from 'lucide-react';
import type { Notice, NoticeCategory } from '../types/notice.types';

const CATEGORY_BADGE: Record<NoticeCategory, { bg: string; color: string }> = {
  General: { bg: '#e8f0fe', color: '#1a56db' },
  Maintenance: { bg: '#fef3c7', color: '#92400e' },
  Emergency: { bg: '#fee2e2', color: '#991b1b' },
  Event: { bg: '#dcfce7', color: '#166534' },
};

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onTogglePin: (notice: Notice) => void;
  readOnly?: boolean;
}

const NoticeCard = ({ notice, onEdit, onDelete, onTogglePin, readOnly = false }: NoticeCardProps) => {
  const badge = CATEGORY_BADGE[notice.category];

  return (
    <div
      className="d-flex align-items-start justify-content-between p-3 rounded-3 border border-light-subtle bg-white"
      style={{ gap: '12px' }}
    >
      {/* ── Left — info ── */}
      <div className="flex-grow-1 overflow-hidden">

        {/* Category + Pinned */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <span
            className="fw-medium"
            style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px' }}
          >
            {notice.category}
          </span>
          {notice.isPinned && (
            <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: '#92400e' }}>
              <Pin size={12} strokeWidth={2} />
              Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>
          {notice.title}
        </p>

        {/* Body */}
        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {notice.body}
        </p>

        {/* Footer */}
        <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.75rem' }}>
          {notice.admin && (
            <>
              <i className="bi bi-person" />
              <span>{notice.admin.name}</span>
              <span className="mx-1">·</span>
            </>
          )}
          <i className="bi bi-clock" />
          <span>
            {new Date(notice.publishedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
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