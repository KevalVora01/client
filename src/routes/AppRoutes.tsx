import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardLayout from '../components/layout/AdminLayout/DashboardLayout';
import ResidentsPage from '../features/residents/pages/ResidentsPage';
import ResidentDetailPage from '../features/residents/pages/ResidentDetailPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import ApartmentsPage from '../features/apartments/pages/ApartmentsPage';
import ApartmentDetailPage from '../features/apartments/pages/ApartmentDetailPage';

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

        {/* ─── Protected routes (admin only) ───────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/residents" element={<ResidentsPage />} />
            <Route path="/residents/:id" element={<ResidentDetailPage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
            {/* rest of admin routes */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/resident" element={<ResidentDashboard />} />
            {/* <Route path="/" element={<ResidentDashboard />} />
            <Route path="/notices" element={<NoticesPage />} /> */}
            {/* rest of resident routes */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['security']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/security" element={<SecurityDashboard />} />
            {/* <Route path="/checkin" element={<CheckInPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/logs" element={<VisitorLogsPage />} /> */}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'resident', 'security']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ─── Utility routes ───────────────────────────────── */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;