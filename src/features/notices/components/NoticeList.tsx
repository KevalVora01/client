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
      <div className="d-flex flex-column gap-2">
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
        <i className="bi bi-bell-slash mb-2" style={{ fontSize: '2rem', color: '#adb5bd' }} />
        <p className="text-secondary small mb-0">No notices found</p>
        <p className="text-secondary small" style={{ fontSize: '0.8rem' }}>
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  const pinned = notices.filter((n) => n.isPinned);
  const rest = notices.filter((n) => !n.isPinned);

  return (
    <div className="d-flex flex-column gap-2">

      {/* ── Pinned ── */}
      {pinned.length > 0 && (
        <div className="mb-1">
          <p className="text-uppercase fw-medium mb-2" style={{ fontSize: '0.7rem', color: '#adb5bd', letterSpacing: '0.08em' }}>
            Pinned
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
        <div>
          {pinned.length > 0 && (
            <p className="text-uppercase fw-medium mb-2" style={{ fontSize: '0.7rem', color: '#adb5bd', letterSpacing: '0.08em' }}>
              All notices
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