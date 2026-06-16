import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const DashboardLayout = () => (
  <div className="d-flex">
    <Sidebar />
    <main className="flex-grow-1 bg-light" style={{ minHeight: '100vh' }}>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;