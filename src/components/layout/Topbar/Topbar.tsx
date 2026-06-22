// src/components/layout/Topbar/Topbar.tsx

import { Bell, Menu } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import './Topbar.css';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4">
      <div className="d-flex align-items-center gap-3">

        {/* ── Hamburger — mobile only ── */}
        <button
          className="topbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        <p className="topbar__greeting mb-0">
          Welcome back, <span className="fw-semibold">{user?.name ?? 'User'}</span>
        </p>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.8} />
          <span className="topbar__badge" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;