import { NavLink } from 'react-router-dom';
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
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import useAuth from '../../../features/auth/hooks/useAuth';
import type { UserRole } from '../../../features/auth/types/auth.types';
import './Sidebar.css';

// ─── Types ────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
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

// ─── Component ────────────────────────────────────────────────────
const Sidebar = () => {
  const { user } = useAuth();

  const role: UserRole = user?.role ?? 'resident';
  const navItems = navConfig[role];

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'AD';

  return (
    <div className="sidebar d-flex flex-column">

      {/* ── Brand ── */}
      <div className="sidebar__brand px-3 pt-4 pb-3">
        <h5 className="sidebar__brand-name fw-bold text-white mb-0 d-flex justify-content-evenly align-items-center">
          <Home size={28} strokeWidth={2} />
          Civic Horizon
        </h5>
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
                  `sidebar__nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none text-white${isActive ? ' sidebar__nav-link--active' : ''
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
                <span className="sidebar__nav-label fw-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User footer ── */}
      <div className="sidebar__footer d-flex align-items-center gap-3 px-3 py-3">
        <div
          className="sidebar__avatar d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
        >
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="sidebar__user-name text-white fw-semibold mb-0 text-truncate">
            {user?.name ?? 'User'}
          </p>
          <p className="sidebar__user-role text-uppercase text-white opacity-75 mb-0 text-truncate">
            {role === 'admin'
              ? 'Admin'
              : role === 'resident'
                ? 'Resident'
                : 'Security Officer'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;