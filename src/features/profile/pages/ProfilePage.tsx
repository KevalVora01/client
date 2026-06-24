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

      {/* ── Side by side ── */}
      <div className="pf-grid">
        <PersonalInfoForm
          user={user}
          loading={updateLoading}
          onSubmit={updateProfile}
        />
        <ChangePasswordForm
          loading={passwordLoading}
          onSubmit={changePassword}
        />
      </div>

    </div>
  );
};

export default ProfilePage;