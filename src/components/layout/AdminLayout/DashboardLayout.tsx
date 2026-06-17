import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';

const DashboardLayout = () => (
  <div className="d-flex" style={{ minHeight: '100vh' }}>
    <Sidebar />
    <div className="d-flex flex-column flex-grow-1">  {/* ← column wrapper */}
      <Topbar />
      <main className="flex-grow-1 bg-light p-4">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;