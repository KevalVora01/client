import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from '../../../components/Select/Select';
import type { ComplaintPriority } from '../types/complaint.types';
import { showError } from '../../../utils/toast';

interface ComplaintFormProps {
  loading: boolean;
  onSubmit: (formData: FormData) => Promise<boolean>;
  onCancel: () => void;
}

const MAX_IMAGES = 5;

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title must be at most 150 characters')
    .required('Title is required'),
  description: Yup.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  priority: Yup.string()
    .oneOf(['Low', 'Medium', 'High'], 'Invalid priority')
    .required('Priority is required'),
});

const ComplaintForm = ({ loading, onSubmit, onCancel }: ComplaintFormProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'Medium' as ComplaintPriority,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('description', values.description.trim());
      formData.append('priority', values.priority);
      images.forEach((img) => formData.append('images', img));

      const success = await onSubmit(formData);
      if (success) {
        resetForm();
        setImages([]);
        setPreviews([]);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (images.length + files.length > MAX_IMAGES) {
      showError(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newImages.map((f) => URL.createObjectURL(f)));
  };

  return (
    <form onSubmit={formik.handleSubmit}>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">Title <span className="text-danger">*</span></label>
        <input
          type="text"
          name="title"
          className={`form-control shadow-none rounded-2 text-dark ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
          placeholder="e.g. Leaking pipe in kitchen"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxLength={150}
          style={{
            borderRadius: '8px',
            fontSize: '0.9rem',
            borderColor: formik.touched.title && formik.errors.title ? '#dc3545' : '#e5e7eb'
          }}
        />
        {formik.touched.title && formik.errors.title && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {formik.errors.title}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">Description <span className="text-danger">*</span></label>
        <textarea
          name="description"
          className={`form-control shadow-none rounded-2 text-dark ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
          placeholder="Describe the issue in detail..."
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxLength={1000}
          rows={5}
          style={{
            borderRadius: '8px',
            fontSize: '0.9rem',
            resize: 'vertical',
            minHeight: '120px',
            borderColor: formik.touched.description && formik.errors.description ? '#dc3545' : '#e5e7eb'
          }}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {formik.errors.description}
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Priority</label>
        <Select
          name="priority"
          options={[
            { value: 'Low', label: 'Low Priority' },
            { value: 'Medium', label: 'Medium Priority' },
            { value: 'High', label: 'High Priority' },
          ]}
          placeholder="Select priority"
          value={formik.values.priority}
          onChange={(e) => formik.setFieldValue('priority', e.target.value)}
          className="shadow-none"
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>
          Attach Photos <span className="text-secondary fw-normal">(optional, max {MAX_IMAGES})</span>
        </label>

        <div className="d-flex align-items-center gap-3">
          <input
            type="file"
            id="complaint-images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={images.length >= MAX_IMAGES}
            hidden
          />
          <label
            htmlFor="complaint-images"
            className="btn d-inline-flex align-items-center gap-2 fw-medium"
            style={{
              borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #d1d5db',
              color: '#374151', backgroundColor: '#fff', padding: '8px 16px', cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.borderColor = '#9ca3af'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
          >
            <i className="bi bi-paperclip" />
            Choose Photos
            {images.length > 0 && (
              <span className="badge rounded-pill" style={{ backgroundColor: '#1a1f36', fontSize: '0.7rem', fontWeight: 600 }}>
                {images.length}
              </span>
            )}
          </label>
        </div>

        {previews.length > 0 && (
          <div className="d-flex gap-2 flex-wrap mt-3">
            {previews.map((src, i) => (
              <div key={i} className="position-relative">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <button
                  type="button"
                  className="btn btn-sm p-0 position-absolute d-flex align-items-center justify-content-center"
                  onClick={() => removeImage(i)}
                  style={{
                    top: '-6px', right: '-6px', width: '20px', height: '20px',
                    borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff',
                    fontSize: '0.7rem', lineHeight: 1,
                  }}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 justify-content-end">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-dark d-flex align-items-center justify-content-center gap-1"
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            'Submit Complaint'
          )}
        </button>
      </div>

    </form>
  );
};

export default ComplaintForm;