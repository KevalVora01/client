// src/components/layout/Topbar/NotificationBell.tsx
import { useEffect, useState } from 'react';
import { Bell, FileText, Inbox } from 'lucide-react';
import { toast } from 'react-toastify';
import useSocket from '../../../hooks/useSocket';

interface NoticeNotification {
  id: number;
  title: string;
  body: string;
}

const NotificationBell = () => {
  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NoticeNotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotice = (notice: NoticeNotification) => {
      setNotifications((prev) => [notice, ...prev].slice(0, 20));
      setUnreadCount((c) => c + 1);
      toast.info(`New notice: ${notice.title}`);
    };

    socket.on('notice:new', handleNewNotice);
    return () => { socket.off('notice:new', handleNewNotice); };
  }, [socket]);

  const handleDropdownOpen = () => setUnreadCount(0);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light rounded-circle position-relative d-flex align-items-center justify-content-center"
        style={{ width: 40, height: 40 }}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleDropdownOpen}
      >
        <Bell size={19} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>

      <div
        className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0 mt-2"
        style={{ width: 340, maxHeight: 420, overflowY: 'auto' }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <span className="fw-semibold">Notifications</span>
          {notifications.length > 0 && (
            <button
              className="btn btn-sm btn-link text-decoration-none p-0"
              onClick={handleClear}
            >
              Clear all
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center text-muted py-4">
            <Inbox size={28} className="mb-2 opacity-50" />
            <p className="mb-0 small">No new notifications</p>
          </div>
        ) : (
          <ul className="list-unstyled mb-0">
            {notifications.map((n) => (
              <li key={n.id} className="border-bottom">
                <div className="d-flex gap-2 px-3 py-2 notification-item">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 34, height: 34 }}
                  >
                    <FileText size={16} />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-0 small fw-semibold text-truncate">{n.title}</p>
                    <p className="mb-0 small text-muted text-truncate">{n.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;