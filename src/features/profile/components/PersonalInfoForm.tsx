import { useState } from "react";
import type { ProfileUser, UpdateProfilePayload } from "../types/profile.types";

interface PersonalInfoFormProps {
  user: ProfileUser;
  loading: boolean;
  onSubmit: (payload: UpdateProfilePayload) => Promise<boolean>;
}

const PersonalInfoForm = ({ user, loading, onSubmit }: PersonalInfoFormProps) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, phone });
  };

  return (
    <form className="pf-card" onSubmit={handleSubmit}>
      <div className="pf-card__head">
        <div className="pf-card__title">
          <i className="bi bi-person" /> Personal info
        </div>
      </div>

      <div className="pf-form-grid">
        <div className="pf-field">
          <label>Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="pf-field">
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10 digit number"
            required
          />
        </div>
        <div className="pf-field pf-field--full">
          <label>Email address</label>
          <input type="text" value={user.email} readOnly />
          <span className="pf-field__hint">Email cannot be changed. Contact support if needed.</span>
        </div>
      </div>

      <div className="pf-card__footer" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" className="pf-btn pf-btn--primary" disabled={loading}>
          {loading
            ? <><span className="pf-spinner" /> Saving...</>
            : <><i className="bi bi-floppy" /> Save changes</>
          }
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;