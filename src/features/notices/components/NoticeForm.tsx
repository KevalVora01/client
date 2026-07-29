import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from '../../../components/Select/Select';
import type { Notice, NoticeCategory, CreateNoticePayload, UpdateNoticePayload } from '../types/notice.types';

const CATEGORIES: NoticeCategory[] = ['General', 'Maintenance', 'Emergency', 'Event'];

const schema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  body: Yup.string().trim().required('Body is required'),
  category: Yup.string().oneOf(CATEGORIES, 'Invalid category').required('Category is required'),
});

interface NoticeFormProps {
  notice?: Notice | null;
  loading: boolean;
  onSubmit: (payload: CreateNoticePayload | UpdateNoticePayload) => Promise<boolean>;
  onCancel: () => void;
}

const NoticeForm = ({ notice, loading, onSubmit, onCancel }: NoticeFormProps) => {
  const isEdit = !!notice;

  const formik = useFormik({
    initialValues: {
      title: notice?.title ?? '',
      body: notice?.body ?? '',
      category: notice?.category ?? 'General',
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const success = await onSubmit(values);
      if (success) resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-3">

        {/* Title */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fw-medium text-secondary small mb-0">
              Title <span className="text-danger">*</span>
            </label>
            <span
              className={`small fw-medium ${formik.values.title.length === 150 ? 'text-primary fw-bold' : 'text-muted'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {formik.values.title.length}/150
            </span>
          </div>
          <input
            type="text"
            name="title"
            className={`form-control shadow-none ${formik.touched.title && formik.errors.title ? 'is-invalid' : 'border-light-subtle'}`}
            placeholder="e.g. Fire Safety Drill"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={150}
            style={{ fontSize: '0.875rem', height: '40px' }}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="invalid-feedback">{formik.errors.title}</div>
          ) : formik.values.title.length === 150 ? (
            <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-info-circle text-primary me-1" />
              Maximum limit of 150 characters reached.
            </small>
          ) : null}
        </div>

        {/* Category */}
        <div className="col-12">
          <Select
            label="Category"
            name="category"
            required
            options={CATEGORIES}
            placeholder="Select category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.category}
            touched={formik.touched.category}
            className="shadow-none"
          />
        </div>

        {/* Body */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fw-medium text-secondary small mb-0">
              Body <span className="text-danger">*</span>
            </label>
            <span
              className={`small fw-medium ${formik.values.body.length === 2000 ? 'text-primary fw-bold' : 'text-muted'}`}
              style={{ fontSize: '0.78rem' }}
            >
              {formik.values.body.length}/2000
            </span>
          </div>
          <textarea
            name="body"
            rows={6}
            className={`form-control shadow-none ${formik.touched.body && formik.errors.body ? 'is-invalid' : 'border-light-subtle'}`}
            placeholder="Write the notice content here..."
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={2000}
            style={{ fontSize: '0.875rem', resize: 'vertical', minHeight: '120px' }}
          />
          {formik.touched.body && formik.errors.body ? (
            <div className="invalid-feedback">{formik.errors.body}</div>
          ) : formik.values.body.length === 2000 ? (
            <small className="text-secondary d-block mt-1" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-info-circle text-primary me-1" />
              Maximum limit of 2000 characters reached.
            </small>
          ) : null}
        </div>

        {/* Actions */}
        <div className="col-12">
          <div className="d-grid d-sm-flex gap-2 justify-content-sm-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
              style={{ fontSize: '0.875rem', height: '40px', borderRadius: '8px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-dark d-flex align-items-center justify-content-center gap-1"
              disabled={loading}
              style={{ fontSize: '0.875rem', height: '40px', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm" />
                : <><i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-plus-lg'}`} /> {isEdit ? 'Save Changes' : 'Add Notice'}</>
              }
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};

export default NoticeForm;