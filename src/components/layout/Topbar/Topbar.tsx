import { Menu } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import NotificationBell from './NotificationBell';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <div
      className="d-flex align-items-center justify-content-between px-4 bg-white border-bottom"
      style={{ height: '64px', flexShrink: 0 }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light border-0 rounded-circle d-flex d-md-none align-items-center justify-content-center p-0"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          style={{ width: '38px', height: '38px' }}
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
        <p className="mb-0" style={{ fontSize: '0.9rem', color: '#374151' }}>
          Welcome back, <span className="fw-semibold" style={{ color: '#1a1f36' }}>{user?.name ?? 'User'}</span>
        </p>
      </div>

      <div className="d-flex align-items-center gap-2">
        <NotificationBell />
      </div>
    </div>
  );
};

export default Topbar;