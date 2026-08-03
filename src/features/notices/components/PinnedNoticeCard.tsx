import { useState, useRef, useEffect } from 'react';
import type { Notice } from '../types/notice.types';
import { useNoticeStore } from '../hooks/useNoticeStore';

const CATEGORY_BADGE: Record<string, { bg: string; color: string; border: string }> = {
  General: { bg: '#e8f0fe', color: '#1a56db', border: '#3b82f6' },
  Maintenance: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
  Emergency: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
  Event: { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
};

interface PinnedNoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
  onTogglePin: (notice: Notice) => void;
  readOnly: boolean;
}

const PinnedNoticeCard = ({ notice, onEdit, onDelete, onTogglePin, readOnly }: PinnedNoticeCardProps) => {
  const badge = CATEGORY_BADGE[notice.category] ?? CATEGORY_BADGE.General;
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const { filters } = useNoticeStore();
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div
      className="p-3 rounded-3 shadow-sm"
      style={{
        border: '1px solid #e5e7eb',
        background: '#fff',
      }}
    >
      <div className="d-flex align-items-start justify-content-between mb-2">
        <span
          className="fw-medium"
          style={{ background: badge.bg, color: badge.color, fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px' }}
        >
          {notice.category}
        </span>
        {!readOnly && (
          <div className="position-relative" ref={menuRef}>
            <button
              className="btn btn-sm btn-outline-secondary border-0 p-1"
              onClick={() => setShowMenu(!showMenu)}
              style={{ borderRadius: '6px' }}
            >
              <i className="bi bi-three-dots-vertical" style={{ fontSize: '1.1rem' }} />
            </button>
            {showMenu && (
              <div
                className="position-absolute bg-white rounded-3 border border-light-subtle shadow-sm p-1"
                style={{ right: 0, top: '110%', minWidth: 140, zIndex: 100 }}
              >
                <button
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
                  onClick={() => { onTogglePin(notice); setShowMenu(false); }}
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className={`bi ${notice.isPinned ? 'bi-pin' : 'bi-pin-fill'}`} />
                  {notice.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
                  onClick={() => { onEdit(notice); setShowMenu(false); }}
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-pencil" /> Edit
                </button>
                {onDelete && (
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small text-danger"
                    onClick={() => { onDelete(notice); setShowMenu(false); }}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <i className="bi bi-trash3" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#1a1f36', lineHeight: '1.4' }}>
        {highlightMatch(notice.title, searchVal)}
      </p>
      {!expanded && (
        <p className="text-secondary mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
          {highlightMatch(notice.body.length > 100 ? notice.body.slice(0, 100) + '...' : notice.body, searchVal)}
        </p>
      )}

      {/* ── Expanded Content ── */}
      {expanded && (
        <div className="mb-3 pb-3" style={{ borderTop: '1px solid #e5e7eb' }}>
          <p className="text-secondary mt-3 mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {highlightMatch(notice.body, searchVal)}
          </p>
          <div className="d-flex gap-4 flex-wrap">
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-person me-1" />{notice.admin?.name ?? 'Unknown'}
            </span>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between">
        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-calendar3 me-1" />
          {formatDate(notice.publishedAt)}
        </span>
        <button
          className="btn btn-link p-0 fw-medium text-decoration-none"
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '0.78rem', color: badge.color }}
        >
          {expanded ? 'Show less ↑' : 'View Details →'}
        </button>
      </div>
    </div>
  );
};

export default PinnedNoticeCard;
