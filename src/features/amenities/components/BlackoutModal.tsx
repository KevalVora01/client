import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { CreateBlackoutPayload } from '../types/amenity.types';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const today = () => new Date().toISOString().slice(0, 10);

const schema = Yup.object({
  date: Yup.string().matches(DATE_RE, 'Date is required').required('Date is required'),
  startTime: Yup.string().matches(TIME_RE, 'HH:MM required').required('Start time is required'),
  endTime: Yup.string().matches(TIME_RE, 'HH:MM required').required('End time is required'),
  reason: Yup.string().trim().min(2, 'Min 2 characters').max(500, 'Max 500 characters').required('Reason is required'),
});

interface BlackoutModalProps {
  loading: boolean;
  onSubmit: (payload: CreateBlackoutPayload) => Promise<boolean>;
  onCancel: () => void;
}

const BlackoutModal = ({ loading, onSubmit, onCancel }: BlackoutModalProps) => {
  const formik = useFormik({
    initialValues: { date: today(), startTime: '08:00', endTime: '09:00', reason: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      await onSubmit({
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        reason: values.reason.trim(),
      });
    },
  });

  const fieldClass = (field: string) =>
    `form-control shadow-none ${formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] ? 'is-invalid' : 'border-light-subtle'}`;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>Add Blackout</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Block a slot from being booked.</p>
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
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Date <span className="text-danger">*</span></label>
                  <input type="date" name="date" className={fieldClass('date')} value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ fontSize: '0.875rem', height: '40px' }} />
                  {formik.touched.date && formik.errors.date && <div className="invalid-feedback">{formik.errors.date}</div>}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Start <span className="text-danger">*</span></label>
                  <input type="time" name="startTime" className={fieldClass('startTime')} value={formik.values.startTime} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ fontSize: '0.875rem', height: '40px' }} />
                  {formik.touched.startTime && formik.errors.startTime && <div className="invalid-feedback">{formik.errors.startTime}</div>}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">End <span className="text-danger">*</span></label>
                  <input type="time" name="endTime" className={fieldClass('endTime')} value={formik.values.endTime} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ fontSize: '0.875rem', height: '40px' }} />
                  {formik.touched.endTime && formik.errors.endTime && <div className="invalid-feedback">{formik.errors.endTime}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Reason <span className="text-danger">*</span></label>
                  <textarea name="reason" rows={2} className={fieldClass('reason')} value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ fontSize: '0.875rem', resize: 'vertical' }} />
                  {formik.touched.reason && formik.errors.reason && <div className="invalid-feedback">{formik.errors.reason}</div>}
                </div>
                <div className="col-12">
                  <div className="d-grid d-sm-flex gap-2 justify-content-sm-end">
                    <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={onCancel} disabled={loading} style={{ height: '38px', fontSize: '0.875rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center justify-content-center" disabled={loading} style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px', opacity: loading ? 0.55 : 1 }}>
                      {loading ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-plus-lg me-1" /> Add Blackout</>}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackoutModal;
