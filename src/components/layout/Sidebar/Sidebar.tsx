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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import type { UserRole } from '../../../features/auth/types/auth.types';
import './Sidebar.css';
import { useState } from 'react';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog';
import { getAvatarColor, getInitials } from '../../../features/residents/components/ResidentTable/residentTableHelpers';

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
    { label: 'Billing', icon: ReceiptText, path: '/billing' },
    { label: 'Events', icon: CalendarDays, path: '/events' },
    { label: 'Logs', icon: History, path: '/logs' },
  ],
  resident: [
    { label: 'My Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Notices', icon: Megaphone, path: '/notices' },
    { label: 'My Complaints', icon: MessageSquareWarning, path: '/complaints' },
    { label: 'My Invoices', icon: ReceiptText, path: '/invoices' },
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
    <div className="sidebar d-flex flex-column">

      {/* ── Brand ── */}
      <div className="sidebar__brand px-3 pt-4 pb-3 d-flex align-items-center justify-content-between">
        <div>
          <h5 className="sidebar__brand-name mb-0">Civic Horizon</h5>
          <span className="sidebar__brand-role text-uppercase">{roleLabel[role]}</span>
        </div>
        <button className="sidebar__close-btn" onClick={onClose} aria-label="Close sidebar">
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
                className={({ isActive }) =>
                  `sidebar__nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none${isActive ? ' sidebar__nav-link--active' : ''}`
                }
              >
                <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
                <span className="sidebar__nav-label fw-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Profile card ── */}
      <div className="sidebar__profile d-flex align-items-center justify-content-between px-3 py-3">
        <div
          className="d-flex align-items-center gap-2 overflow-hidden"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          {/* avatar image */}
          <div
            className="sidebar__profile-img flex-shrink-0 d-flex align-items-center justify-content-center fw-semibold"
            style={{
              background: getAvatarColor(user?.name ?? '').bg,
              color: getAvatarColor(user?.name ?? '').color,
              borderRadius: '50%',
              fontSize: '0.75rem',
            }}
          >
            {getInitials(user?.name ?? '')}
          </div>
          <div className="overflow-hidden">
            <p className="sidebar__user-name fw-semibold mb-0 text-truncate">
              {user?.name ?? 'User'}
            </p>
            <p className="sidebar__user-role text-uppercase mb-0 text-truncate">
              {roleLabel[role]}
            </p>
          </div>
        </div>
        <button
          className="sidebar__logout-btn flex-shrink-0"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
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
  );
};

export default Sidebar;