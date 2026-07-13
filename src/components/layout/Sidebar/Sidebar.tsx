import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Megaphone,
  MessageSquareWarning,
  ReceiptText,
  CalendarDays,
  History,
  UserCheck,
  UserMinus,
  LogOut,
  X,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import type { UserRole } from '../../../features/auth/types/auth.types';
import { useState } from 'react';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog';
import { getAvatarColor, getInitials } from '../../../features/residents/components/residentTableHelpers';

// ─── Types ────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarProps {
  onClose?: () => void;
}

// ─── Nav config per role ──────────────────────────────────────────
const navConfig: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Residents', icon: Users, path: '/residents' },
    { label: 'Apartments', icon: Building2, path: '/apartments' },
    { label: 'Notices', icon: Megaphone, path: '/notices' },
    { label: 'Complaints', icon: MessageSquareWarning, path: '/complaints' },
    { label: 'maintenance', icon: ReceiptText, path: '/maintenance' },
    { label: 'Events', icon: CalendarDays, path: '/events' },
    { label: 'Logs', icon: History, path: '/logs' },
  ],
  resident: [
    { label: 'My Dashboard', icon: LayoutDashboard, path: '/resident' },
    { label: 'My Apartment', icon: Home, path: '/my-apartment' },
    { label: 'Notices', icon: Megaphone, path: '/notices' },
    { label: 'My Complaints', icon: MessageSquareWarning, path: '/complaints' },
    { label: 'maintenance', icon: ReceiptText, path: '/maintenance' },
    { label: 'My Visitors', icon: UserCheck, path: '/visitors' },
    { label: 'Events', icon: CalendarDays, path: '/events' },
  ],
  security: [
    { label: 'Visitor Check-In', icon: UserCheck, path: '/checkin' },
    { label: 'Visitor Check-Out', icon: UserMinus, path: '/checkout' },
    { label: 'Visitor Logs', icon: History, path: '/logs' },
  ],
};

// ─── Role subtitle ────────────────────────────────────────────────
const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  resident: 'Resident',
  security: 'Security',
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const role: UserRole = user?.role ?? 'resident';
  const navItems = navConfig[role];

  return (
    <>
    <style>{`
      .sidebar-nav-link:hover { background-color: #e0e7ff; }
      .sidebar-nav-link.active { background-color: #e0e7ff !important; }
      .sidebar-close-btn:hover { background: #f3f4f6; }
      .sidebar-logout-btn:hover { background-color: #fee2e2; border-color: #fecaca; color: #ef4444; }
    `}</style>
    <div className="d-flex flex-column vh-100 sticky-top bg-white border-end border-light-subtle overflow-y-auto flex-shrink-0"
      style={{ width: "240px" }}
    >

      {/* ── Brand ── */}
      <div className="d-flex align-items-center justify-content-between px-3 pt-4 pb-3"
        style={{ borderBottom: "1px solid #f3f4f6" }}
      >
        <div>
          <h5 className="mb-0" style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            Civic Horizon
          </h5>
          <span className="text-secondary fw-semibold text-uppercase" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
            {roleLabel[role]}
          </span>
        </div>
        <button
          className="sidebar-close-btn border-0 bg-transparent text-secondary p-1 rounded-2 d-flex d-md-none align-items-center justify-content-center"
          onClick={onClose}
          aria-label="Close sidebar"
          style={{ cursor: "pointer" }}
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-grow-1 px-2 py-2">
        <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                onClick={onClose}
                className="sidebar-nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none"
                style={{ fontSize: "0.92rem", color: "#2c2f33" }}
              >
                <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
                <span className="fw-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Profile card ── */}
      <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top border-light">
        <div
          className="d-flex align-items-center gap-2 overflow-hidden"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div
            className="flex-shrink-0 d-flex align-items-center justify-content-center fw-semibold"
            style={{
              width: "34px",
              height: "34px",
              border: "2px solid #e5e7eb",
              background: getAvatarColor(user?.name ?? '').bg,
              color: getAvatarColor(user?.name ?? '').color,
              borderRadius: '50%',
              fontSize: '0.75rem',
            }}
          >
            {getInitials(user?.name ?? '')}
          </div>
          <div className="overflow-hidden">
            <p className="fw-semibold mb-0 text-truncate" style={{ fontSize: "0.88rem", color: "#111827" }}>
              {user?.name ?? 'User'}
            </p>
            <p className="text-uppercase mb-0 text-truncate text-secondary" style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>
              {roleLabel[role]}
            </p>
          </div>
        </div>
        <button
          className="sidebar-logout-btn d-flex align-items-center justify-content-center border rounded-2 bg-transparent text-secondary flex-shrink-0"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
          style={{ width: "32px", height: "32px", cursor: "pointer" }}
        >
          <LogOut size={18} strokeWidth={1.8} />
        </button>

        <ConfirmDialog
          show={showLogoutConfirm}
          title="Log Out"
          message="Are you sure you want to log out of your account?"
          confirmLabel="Log Out"
          cancelLabel="Stay"
          variant="danger"
          onConfirm={() => { setShowLogoutConfirm(false); logout(); }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </div>

    </div>
    </>
  );
};

export default Sidebar;