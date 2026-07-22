import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardLayout from '../components/layout/AdminLayout/DashboardLayout';
import ResidentsPage from '../features/residents/pages/ResidentsPage';
import ResidentDetailPage from '../features/residents/pages/ResidentDetailPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import PasswordResetRequiredPage from '../features/auth/pages/PasswordResetRequiredPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import ApartmentsPage from '../features/apartments/pages/ApartmentsPage';
import ApartmentDetailPage from '../features/apartments/pages/ApartmentDetailPage';
import MyApartmentPage from '../features/myApartment/pages/MyApartmentPage';
import TenantManagementPage from '../features/myApartment/pages/TenantManagementPage';
import TenantDetailPage from '../features/myApartment/pages/TenantDetailPage';
import TenantRequestsPage from '../features/tenantRequests/pages/TenantRequestsPage';
import TenantRequestDetailPage from '../features/tenantRequests/pages/TenantRequestDetailPage';
import TenantWelcomePage from '../features/tenantRequests/pages/TenantWelcomePage';
import NoticesPage from '../features/notices/pages/NoticesPage';
import ComplaintsPage from '../features/complaints/pages/ComplaintsPage';
import MaintenancePage from '../features/maintenance/pages/MaintenancePage';
import DocumentsPage from '../features/documents/pages/DocumentsPage';
import DocumentRequestDetailPage from '../features/documents/pages/DocumentRequestDetailPage';

// ─── Placeholder pages (replace as you build each module) ─────────
const Dashboard = () => <div className="p-4">Admin Dashboard — coming soon</div>;
const ResidentDashboard = () => <div className="p-4">Resident Dashboard — coming soon</div>;
const SecurityDashboard = () => <div className="p-4">Security Dashboard — coming soon</div>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ─── Guest routes (only for unauthenticated users) ─── */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ─── Must-reset gate (authenticated, but password not yet set) ─── */}
        <Route path="/set-password-required" element={<PasswordResetRequiredPage />} />

        {/* ─── Protected routes (admin only) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/residents" element={<ResidentsPage />} />
            <Route path="/residents/:id" element={<ResidentDetailPage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
            <Route path="/tenant-requests" element={<TenantRequestsPage />} />
            <Route path="/tenant-requests/:id" element={<TenantRequestDetailPage />} />
          </Route>
        </Route>

        {/* ─── Protected routes (resident only) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/resident" element={<ResidentDashboard />} />
            <Route path="/my-apartment" element={<MyApartmentPage />} />
            <Route path="/tenant" element={<TenantManagementPage />} />
            <Route path="/tenant/:id" element={<TenantDetailPage />} />
          </Route>
        </Route>

        {/* ─── Tenant pre-occupancy gate (standalone, no dashboard chrome) ─── */}
        <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
          <Route path="/tenant-welcome" element={<TenantWelcomePage />} />
        </Route>

        {/* ─── Protected routes (security only) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['security']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/security" element={<SecurityDashboard />} />
          </Route>
        </Route>

        {/* ─── Shared routes (admin + resident) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'resident']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentRequestDetailPage />} />
          </Route>
        </Route>

        {/* ─── Shared routes (all roles) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'resident', 'security']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ─── Utility routes ───────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;