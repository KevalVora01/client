import { useFormik } from "formik";
import * as Yup from "yup";
import type { ProfileUser, UpdateProfilePayload } from "../types/profile.types";

interface PersonalInfoFormProps {
  user: ProfileUser;
  loading: boolean;
  onSubmit: (payload: UpdateProfilePayload) => Promise<boolean>;
}

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
});

const PersonalInfoForm = ({ user, loading, onSubmit }: PersonalInfoFormProps) => {

  const formik = useFormik({
    initialValues: {
      name: user.name,
      phone: user.phone,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <form className="pf-card" onSubmit={formik.handleSubmit}>
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
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your name"
            className={formik.touched.name && formik.errors.name ? "pf-input--error" : ""}
          />
          {formik.touched.name && formik.errors.name && (
            <span className="pf-field__error">{formik.errors.name}</span>
          )}
        </div>

        <div className="pf-field">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="10 digit number"
            className={formik.touched.phone && formik.errors.phone ? "pf-input--error" : ""}
          />
          {formik.touched.phone && formik.errors.phone && (
            <span className="pf-field__error">{formik.errors.phone}</span>
          )}
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