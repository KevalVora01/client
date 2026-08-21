import { useFormik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  reason: Yup.string().trim().min(2, 'Min 2 characters').max(500, 'Max 500 characters').required('Reason is required'),
});

interface ReasonModalProps {
  title: string;
  submitLabel: string;
  icon: string;
  loading: boolean;
  onSubmit: (reason: string) => Promise<boolean>;
  onCancel: () => void;
}

const ReasonModal = ({ title, submitLabel, icon, loading, onSubmit, onCancel }: ReasonModalProps) => {
  const formik = useFormik({
    initialValues: { reason: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmit(values.reason.trim());
    },
  });

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>{title}</h5>
            </div>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onCancel}
              disabled={loading}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="modal-body p-3 p-sm-4">
            <form onSubmit={formik.handleSubmit}>
              <label className="form-label fw-medium text-secondary small mb-1">Reason <span className="text-danger">*</span></label>
              <textarea
                name="reason"
                rows={3}
                className={`form-control shadow-none ${formik.touched.reason && formik.errors.reason ? 'is-invalid' : 'border-light-subtle'}`}
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ fontSize: '0.875rem', resize: 'vertical' }}
              />
              {formik.touched.reason && formik.errors.reason && <div className="invalid-feedback">{formik.errors.reason}</div>}
              <div className="d-grid d-sm-flex gap-2 justify-content-sm-end mt-3">
                <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={onCancel} disabled={loading} style={{ height: '38px', fontSize: '0.875rem' }}>Cancel</button>
                <button type="submit" className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center justify-content-center" disabled={loading} style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px', opacity: loading ? 0.55 : 1 }}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : <><i className={`bi ${icon} me-1`} /> {submitLabel}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
