import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, MessageSquareWarning, Megaphone, X, CheckCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import useSocket from '../../../hooks/useSocket';
import useAuth from '../../../hooks/useAuth';
import { notificationApi, type NotificationItem } from '../../../features/notifications/api/notificationApi';

const ICON_MAP: Record<string, typeof FileText> = {
  complaint_status_changed: MessageSquareWarning,
  complaint_created: MessageSquareWarning,
  notice_created: Megaphone,
};

const BG_MAP: Record<string, string> = {
  complaint_status_changed: '#fef3c7',
  complaint_created: '#fef3c7',
  notice_created: '#eef2ff',
};

const COLOR_MAP: Record<string, string> = {
  complaint_status_changed: '#92400e',
  complaint_created: '#92400e',
  notice_created: '#4338ca',
};

const NAV_MAP: Record<string, string> = {
  complaint_status_changed: '/complaints',
  complaint_created: '/complaints',
  notice_created: '/notices',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const NotificationBell = () => {
  const socket = useSocket();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    (async () => {
      try {
        const [data, count] = await Promise.all([
          notificationApi.getNotifications(1, 50),
          notificationApi.getUnreadCount(),
        ]);
        if (!cancelled) {
          setNotifications(data.items);
          setUnreadCount(count);
        }
      } catch {
        // silent
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (n: unknown) => {
      const item = n as NotificationItem;
      setNotifications((prev) => [item, ...prev]);
      setUnreadCount((c) => c + 1);
      toast.info(item.title);
    };

    socket.on('notification:new', handleNewNotification);
    return () => { socket.off('notification:new', handleNewNotification); };
  }, [socket]);

  const handleDropdownOpen = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const handleDismiss = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationApi.markAsRead([id]);
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  };

  const handleNavigate = async (n: NotificationItem) => {
    if (!n.isRead) {
      setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      try {
        await notificationApi.markAsRead([n.id]);
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // silent
      }
    }
    const path = NAV_MAP[n.type];
    if (path) navigate(path);
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const iconFor = (type: string) => ICON_MAP[type] ?? FileText;
  const bgFor = (type: string) => BG_MAP[type] ?? '#f3f4f6';
  const colorFor = (type: string) => COLOR_MAP[type] ?? '#6b7280';

  return (
    <div className="dropdown">
      <button
        className="btn btn-light rounded-circle position-relative d-flex align-items-center justify-content-center"
        style={{ width: 44, height: 44, transition: 'background 0.2s' }}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleDropdownOpen}
      >
        <Bell size={22} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-flex align-items-center justify-content-center"
            style={{ minWidth: 20, height: 20, fontSize: '0.65rem', fontWeight: 600, padding: '0 4px' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>

      <div
        className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0 mt-2"
        style={{ width: 380, borderRadius: '14px', overflow: 'hidden' }}
      >
        {/* ── Header ── */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ background: '#f8f9fb', borderBottom: '1px solid #e5e7eb' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold" style={{ fontSize: '0.95rem', color: '#1a1f36' }}>Notifications</span>
            {unreadCount > 0 && (
              <span className="fw-semibold d-flex align-items-center justify-content-center text-white rounded-pill"
                style={{ minWidth: 20, height: 20, fontSize: '0.65rem', backgroundColor: '#6366f1', padding: '0 6px' }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              className="btn btn-sm d-flex align-items-center gap-1 text-decoration-none fw-medium"
              onClick={handleClear}
              style={{ fontSize: '0.78rem', color: '#6366f1', background: 'transparent', border: 'none', padding: '4px 8px', borderRadius: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#eef2ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <CheckCheck size={14} strokeWidth={2} />
              Mark all read
            </button>
          )}
        </div>

        {/* ── Body ── */}
        {notifications.length === 0 ? (
          <div className="text-center py-5" style={{ background: '#fff' }}>
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3f4f6' }}
            >
              <Bell size={24} style={{ color: '#d1d5db' }} />
            </div>
            <p className="fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#4b5563' }}>No notifications yet</p>
            <p className="mb-0" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>We'll let you know when something arrives.</p>
          </div>
        ) : (
          <ul className="list-unstyled mb-0" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.map((n) => {
              const Icon = iconFor(n.type);
              return (
                <li
                  key={n.id}
                  className="border-bottom"
                  style={{ borderColor: '#f3f4f6 !important', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div
                    className="d-flex align-items-start gap-3 px-4 py-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigate(n)}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 position-relative"
                      style={{ width: 40, height: 40, backgroundColor: bgFor(n.type), color: colorFor(n.type), marginTop: '2px' }}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                      <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: '0.85rem', color: '#1a1f36' }}>
                        {n.title}
                      </p>
                      <p className="mb-0 text-truncate" style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                        {n.body}
                      </p>
                      <p className="mb-0" style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    <div className="d-flex align-items-start gap-1 flex-shrink-0" style={{ paddingTop: '2px' }}>
                      {!n.isRead && (
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6366f1', display: 'inline-block' }} />
                      )}
                      <button
                        className="btn border-0 p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                        onClick={(e) => handleDismiss(n.id, e)}
                        aria-label="Dismiss"
                        style={{ width: 22, height: 22, minWidth: 22, borderRadius: '50%', opacity: 0.3, transition: 'opacity 0.15s, background 0.15s', color: '#6b7280' }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#f3f4f6'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <X size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
