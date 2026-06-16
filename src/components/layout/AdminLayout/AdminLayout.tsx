// src/components/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const AdminLayout = () => (
  <div className="d-flex">
    <Sidebar />
    <main className="flex-grow-1 bg-light" style={{ minHeight: '100vh' }}>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;