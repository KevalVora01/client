import { Bell } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import './Topbar.css';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4">

      {/* ── Page title / breadcrumb area ── */}
      <div className="topbar__left">
        <p className="topbar__greeting mb-0">
          Welcome back, <span className="fw-semibold">{user?.name ?? 'User'}</span>
        </p>
      </div>

      {/* ── Right actions ── */}
      <div className="d-flex align-items-center gap-2">

        {/* Notification */}
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.8} />
          <span className="topbar__badge" />
        </button>

      </div>
    </div>
  );
};

export default Topbar;