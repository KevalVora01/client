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
} from 'lucide-react';
import useAuth from '../../../features/auth/hooks/useAuth';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard,        path: '/' },
  { label: 'Residents',  icon: Users,                  path: '/residents' },
  { label: 'Apartments', icon: Building2,              path: '/apartments' },
  { label: 'Notices',    icon: Megaphone,              path: '/notices' },
  { label: 'Complaints', icon: MessageSquareWarning,   path: '/complaints' },
  { label: 'Billing',    icon: ReceiptText,            path: '/billing' },
  { label: 'Events',     icon: CalendarDays,           path: '/events' },
  { label: 'Logs',       icon: History,                path: '/logs' },
];

const Sidebar = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="sidebar d-flex flex-column">

      {/* ── Brand ── */}
      <div className="sidebar__brand px-3 pt-4 pb-3">
        <h5 className="sidebar__brand-name fw-bold text-white mb-0">
          Civic Horizon
        </h5>
        <span className="sidebar__brand-role text-uppercase text-white opacity-75 small fw-semibold">
          {user?.role ?? 'Admin'}
        </span>
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
                  `sidebar__nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none text-white ${isActive ? 'sidebar__nav-link--active' : ''}`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span className="sidebar__nav-label fw-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User footer ── */}
      <div className="sidebar__footer d-flex align-items-center gap-3 px-3 py-3">
        <div className="sidebar__avatar d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="sidebar__user-name text-white fw-semibold mb-0 text-truncate">
            {user?.name ?? 'Admin User'}
          </p>
          <p className="sidebar__user-role text-uppercase text-white opacity-75 mb-0 text-truncate">
            {user?.role ?? 'Admin'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;