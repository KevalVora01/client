// src/components/layout/AdminLayout/DashboardLayout.tsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import { useSidebar } from '../../../hooks/useSidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="dashboard-layout">

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="dashboard-layout__overlay"
          onClick={close}
        />
      )}

      {/* ── Sidebar ── */}
      <div className={`dashboard-layout__sidebar ${isOpen ? 'dashboard-layout__sidebar--open' : ''}`}>
        <Sidebar onClose={close} />
      </div>

      {/* ── Main ── */}
      <div className="dashboard-layout__main">
        <Topbar onMenuClick={toggle} />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;