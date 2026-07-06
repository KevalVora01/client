import NoticeCard from './NoticeCard';
import type { Notice } from '../types/notice.types';

interface NoticeListProps {
  notices: Notice[];
  loading: boolean;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onTogglePin: (notice: Notice) => void;
  readOnly?: boolean;
}

const NoticeList = ({ notices, loading, onEdit, onDelete, onTogglePin, readOnly = false }: NoticeListProps) => {

  if (loading) {
    return (
    <div className="d-flex flex-column gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="d-flex align-items-start justify-content-between p-3 rounded-3 border border-light-subtle bg-white"
            style={{ gap: '12px' }}
          >
            <div className="flex-grow-1 overflow-hidden">
              <div className="skeleton mb-2" style={{ width: '80px', height: '18px', borderRadius: '6px' }} />
              <div className="skeleton mb-2" style={{ width: '70%', height: '16px' }} />
              <div className="skeleton mb-1" style={{ width: '100%', height: '14px' }} />
              <div className="skeleton mb-2" style={{ width: '45%', height: '14px' }} />
              <div className="skeleton" style={{ width: '120px', height: '12px' }} />
            </div>
            {!readOnly && (
              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                <div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ width: '44px', height: '28px', borderRadius: '8px' }} />
                <div className="skeleton" style={{ width: '62px', height: '28px', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
        >
          <i className="bi bi-megaphone" style={{ fontSize: '1.6rem', color: '#9ca3af' }} />
        </div>
        <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>No notices found</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem', maxWidth: '280px' }}>
          There are no notices matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  const pinned = notices.filter((n) => n.isPinned);
  const rest = notices.filter((n) => !n.isPinned);

  return (
    <div className="d-flex flex-column gap-3">

      {/* ── Pinned ── */}
      {pinned.length > 0 && (
        <div className="d-flex flex-column gap-3">
          <p className="text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem', color: '#6b7280', letterSpacing: '0.06em' }}>
            <i className="bi bi-pin-angle-fill me-1" style={{ fontSize: '0.75rem' }} />Pinned
          </p>
          {pinned.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {/* ── Rest ── */}
      {rest.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {pinned.length > 0 && (
            <p className="text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem', color: '#6b7280', letterSpacing: '0.06em' }}>
              <i className="bi bi-list-ul me-1" style={{ fontSize: '0.75rem' }} />All notices
            </p>
          )}
          {rest.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default NoticeList;