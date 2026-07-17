import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { getMeApi } from '../../auth/api/authApi';

const POLL_INTERVAL_MS = 30000;

const formatDate = (value: string | null): string => {
  if (!value) return 'soon';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'soon';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const TenantWelcomePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState<Date>(new Date());

  const resident = user?.resident ?? null;
  const moveInDate = resident?.moveInDate ? new Date(resident.moveInDate) : null;
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? '';

  // Redirect anyone who isn't actually a locked tenant away from this page.
  useEffect(() => {
    if (resident && (resident.isOwner || resident.isOccupant)) {
      navigate('/resident', { replace: true });
    }
  }, [resident, navigate]);

  // Live countdown tick.
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Poll /me so we unlock the moment the cron promotes the tenant to occupant.
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const me = await getMeApi();
        if (!active) return;
        updateUser(me.user);
        const r = me.user.resident;
        if (r && !r.isOwner && r.isOccupant) {
          navigate('/resident', { replace: true });
        }
      } catch {
        // keep showing the welcome page if the refresh fails
      }
    };
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [navigate, updateUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const countdownParts: string[] = [];
  if (moveInDate && !isNaN(moveInDate.getTime())) {
    const diff = moveInDate.getTime() - now.getTime();
    if (diff > 0) {
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      countdownParts.push(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: 520, width: '100%' }}>
        <div className="card-body p-4 p-md-5 text-center">
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
            style={{ width: 72, height: 72 }}
          >
            <i className="bi bi-house-heart" style={{ fontSize: '2rem' }}></i>
          </div>

          <h2 className="h4 fw-bold mb-1">
            Welcome{firstName ? `, ${firstName}` : ''}!
          </h2>
          <p className="text-muted mb-4">
            Your tenancy request has been approved.
          </p>

          <div className="alert alert-primary border-0" role="alert">
            <div className="fw-semibold mb-1">
              You can access all features of Civic Horizon from
            </div>
            <div className="fs-5 fw-bold">{formatDate(resident?.moveInDate ?? null)}</div>
          </div>

          {countdownParts.length > 0 && (
            <div className="mb-4">
              <div className="text-uppercase text-muted small fw-semibold mb-1">
                Unlocks in
              </div>
              <div className="fs-4 fw-bold text-primary font-monospace">
                {countdownParts[0]}
              </div>
            </div>
          )}

          <p className="text-muted small mb-4">
            We'll take you to your dashboard automatically once access opens.
            You can also log out and return closer to your move-in date.
          </p>

          <button className="btn btn-outline-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantWelcomePage;
