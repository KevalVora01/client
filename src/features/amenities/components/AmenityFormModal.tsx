import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Amenity, CreateAmenityPayload, UpdateAmenityPayload } from '../types/amenity.types';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Min 2 characters').max(100, 'Max 100 characters').required('Name is required'),
  description: Yup.string().nullable(),
  capacity: Yup.number().nullable().min(0, 'Must be 0 or more'),
  operatingStart: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating start is required'),
  operatingEnd: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating end is required'),
  isActive: Yup.boolean(),
});

interface AmenityFormModalProps {
  amenity?: Amenity | null;
  loading: boolean;
  onSubmit: (payload: CreateAmenityPayload | UpdateAmenityPayload) => Promise<boolean>;
  onCancel: () => void;
}

const AmenityFormModal = ({ amenity, loading, onSubmit, onCancel }: AmenityFormModalProps) => {
  const isEdit = !!amenity;

  const formik = useFormik({
    initialValues: {
      name: amenity?.name ?? '',
      description: amenity?.description ?? '',
      capacity: amenity?.capacity ?? '',
      operatingStart: amenity?.operatingStart ?? '08:00',
      operatingEnd: amenity?.operatingEnd ?? '20:00',
      isActive: amenity?.isActive ?? true,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const capacity = values.capacity === '' || values.capacity == null ? null : Number(values.capacity);
      const base = {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        capacity,
        operatingStart: values.operatingStart,
        operatingEnd: values.operatingEnd,
      };
      const payload: CreateAmenityPayload | UpdateAmenityPayload = isEdit
        ? { ...base, isActive: values.isActive }
        : { ...base, isActive: true };
      await onSubmit(payload);
    },
  });

  const fieldClass = (field: string) =>
    `form-control shadow-none ${formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] ? 'is-invalid' : 'border-light-subtle'}`;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                {isEdit ? 'Edit Amenity' : 'Add Amenity'}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                Configure operating hours and details.
              </p>
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
                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    className={fieldClass('name')}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontSize: '0.875rem', height: '40px' }}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className={fieldClass('description')}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontSize: '0.875rem', resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    className={fieldClass('capacity')}
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontSize: '0.875rem', height: '40px' }}
                  />
                  {formik.touched.capacity && formik.errors.capacity && (
                    <div className="invalid-feedback">{formik.errors.capacity}</div>
                  )}
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Opens <span className="text-danger">*</span></label>
                  <input
                    type="time"
                    name="operatingStart"
                    className={fieldClass('operatingStart')}
                    value={formik.values.operatingStart}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontSize: '0.875rem', height: '40px' }}
                  />
                  {formik.touched.operatingStart && formik.errors.operatingStart && (
                    <div className="invalid-feedback">{formik.errors.operatingStart}</div>
                  )}
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Closes <span className="text-danger">*</span></label>
                  <input
                    type="time"
                    name="operatingEnd"
                    className={fieldClass('operatingEnd')}
                    value={formik.values.operatingEnd}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontSize: '0.875rem', height: '40px' }}
                  />
                  {formik.touched.operatingEnd && formik.errors.operatingEnd && (
                    <div className="invalid-feedback">{formik.errors.operatingEnd}</div>
                  )}
                </div>

                {isEdit && (
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label small text-secondary" htmlFor="isActive">
                        Active (visible for residents to book)
                      </label>
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <div className="d-grid d-sm-flex gap-2 justify-content-sm-end">
                    <button type="button" className="btn btn-outline-secondary rounded-2 px-3 small" onClick={onCancel} disabled={loading} style={{ height: '38px', fontSize: '0.875rem' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center justify-content-center" disabled={loading} style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px', opacity: loading ? 0.55 : 1 }}>
                      {loading
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-plus-lg'} me-1`} /> {isEdit ? 'Save Changes' : 'Add Amenity'}</>}
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

export default AmenityFormModal;
