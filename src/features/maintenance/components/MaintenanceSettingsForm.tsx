import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showError, showSuccess } from '../../../utils/toast';

interface MaintenanceSettingsFormProps {
  currentAmount: number | undefined;
  updating: boolean;
  onSubmit: (amount: number) => Promise<boolean>;
}

const MaintenanceSettingsForm = ({ currentAmount, updating, onSubmit }: MaintenanceSettingsFormProps) => {
  const formik = useFormik({
    initialValues: {
      amount: currentAmount !== undefined ? String(currentAmount) : '',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError('Amount must be a valid number')
        .required('Amount is required')
        .moreThan(0, 'Amount must be greater than 0'),
    }),
    onSubmit: async (values) => {
      const parsed = Number(values.amount);
      const ok = await onSubmit(parsed);
      if (ok) {
        showSuccess('Saved');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-end gap-2">
      <div className="flex-grow-1" style={{ minWidth: '160px', maxWidth: '200px' }}>
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>
          Monthly Maintenance Amount (₹)
        </label>
        <input
          type="number"
          className={`form-control shadow-none${formik.touched.amount && formik.errors.amount ? ' is-invalid' : ''}`}
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        />
        {formik.touched.amount && formik.errors.amount && (
          <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>
            {formik.errors.amount}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center"
        disabled={updating}
        style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px', opacity: updating ? 0.55 : 1, whiteSpace: 'nowrap' }}
      >
        {updating ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          'Save'
        )}
      </button>
    </form>
  );
};

export default MaintenanceSettingsForm;
