import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import AdminLayout from '../components/layout/AdminLayout/AdminLayout';

// ─── Placeholder pages (replace as you build each module) ─────────
const Dashboard = () => <div className="p-4">Dashboard — coming soon</div>;
const Unauthorized = () => (
  <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
    <h2 className="fw-bold text-danger">403</h2>
    <p className="text-muted">You don't have permission to access this page.</p>
    <a href="/" className="btn btn-primary mt-2">Go Home</a>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ─── Guest routes (only for unauthenticated users) ─── */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ─── Protected routes (admin only) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Add more admin routes here as you build each module:
              <Route path="/apartments" element={<ApartmentsPage />} />
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/visitors" element={<VisitorsPage />} />
              <Route path="/dashboard" element={<AdminDashboardPage />} />
              */}
          </Route>
        </Route>

        {/* ─── Utility routes ───────────────────────────────── */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;