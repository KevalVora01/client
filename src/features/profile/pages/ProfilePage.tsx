import useAuth from '../../../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { getAvatarColor, getInitials } from '../../residents/components/ResidentTable/residentTableHelpers';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const { updateProfile, updateLoading, changePassword, passwordLoading } = useProfile();

  if (!user) return null;

  const { bg, color } = getAvatarColor(user.name);

  return (
    <div className="pf-page">

      {/* ── Hero ── */}
      <div className="pf-hero">
        <div className="pf-avatar" style={{ background: bg, color }}>
          {getInitials(user.name)}
        </div>
        <div className="pf-hero__info">
          <h4 className="pf-hero__name">{user.name}</h4>
          <div className="pf-hero__meta">
            <span><i className="bi bi-envelope" /> {user.email}</span>
            <span><i className="bi bi-telephone" /> {user.phone}</span>
          </div>
          <div className="pf-hero__badges">
            <span className="pf-badge pf-badge--role">{user.role}</span>
            <span className={`pf-badge pf-badge--${user.isActive ? 'active' : 'inactive'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="pf-grid">

        <PersonalInfoForm
          user={user}
          loading={updateLoading}
          onSubmit={updateProfile}
        />

        {/* ── Account details ── */}
        <div className="pf-card">
          <div className="pf-card__head">
            <div className="pf-card__title">
              <i className="bi bi-shield-check" /> Account details
            </div>
          </div>
          <div className="pf-stat-list">
            <div className="pf-stat-row">
              <span className="pf-stat-label"><i className="bi bi-person-badge" /> Role</span>
              <span className="pf-stat-val">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-label"><i className="bi bi-calendar-plus" /> Member since</span>
              <span className="pf-stat-val">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-label"><i className="bi bi-circle-fill pf-dot--active" /> Status</span>
              <span className="pf-stat-val">{user.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>

        {/* ── Change password ── */}
        <div className="pf-full">
          <ChangePasswordForm
            loading={passwordLoading}
            onSubmit={changePassword}
          />
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;