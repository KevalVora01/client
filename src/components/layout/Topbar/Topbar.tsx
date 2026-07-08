import { Menu } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import './Topbar.css';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4">
      <div className="d-flex align-items-center gap-3">
        <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <Menu size={20} strokeWidth={1.8} />
        </button>
        <p className="topbar__greeting mb-0">
          Welcome back, <span className="fw-semibold">{user?.name ?? 'User'}</span>
        </p>
      </div>

      <div className="d-flex align-items-center gap-2">
        <NotificationBell />
      </div>
    </div>
  );
};

export default Topbar;