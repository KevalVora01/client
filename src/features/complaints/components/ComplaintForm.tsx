import { useState } from 'react';
import Select from '../../../components/Select/Select';
import type { ComplaintPriority } from '../types/complaint.types';
import { showError } from '../../../utils/toast';

interface ComplaintFormProps {
  loading: boolean;
  onSubmit: (formData: FormData) => Promise<boolean>;
  onCancel: () => void;
}

const MAX_IMAGES = 5;

const ComplaintForm = ({ loading, onSubmit, onCancel }: ComplaintFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});

  const handleTitleBlur = () => {
    setTouched(prev => ({ ...prev, title: true }));
    const newErrors: { title?: string } = {};
    if (title.trim().length === 0) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else {
      newErrors.title = undefined;
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleDescBlur = () => {
    setTouched(prev => ({ ...prev, description: true }));
    const newErrors: { description?: string } = {};
    if (description.trim().length === 0) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else {
      newErrors.description = undefined;
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (images.length + files.length > MAX_IMAGES) {
      showError(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    showError(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true });

    const titleErr = title.trim().length === 0
      ? 'Title is required'
      : title.trim().length < 3
        ? 'Title must be at least 3 characters'
        : undefined;

    const descErr = description.trim().length === 0
      ? 'Description is required'
      : description.trim().length < 10
        ? 'Description must be at least 10 characters'
        : undefined;

    setErrors({ title: titleErr, description: descErr });

    if (titleErr || descErr) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('priority', priority);
    images.forEach((img) => formData.append('images', img));

    const success = await onSubmit(formData);
    if (success) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setImages([]);
      setPreviews([]);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">Title <span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control shadow-none rounded-2 text-dark ${touched.title && errors.title ? 'is-invalid' : ''}`}
          placeholder="e.g. Leaking pipe in kitchen"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (touched.title) {
              setErrors(prev => ({
                ...prev,
                title: e.target.value.trim().length === 0
                  ? 'Title is required'
                  : e.target.value.trim().length < 3
                    ? 'Title must be at least 3 characters'
                    : undefined
              }));
            }
          }}
          onBlur={handleTitleBlur}
          maxLength={150}
          style={{
            borderRadius: '8px',
            fontSize: '0.9rem',
            borderColor: touched.title && errors.title ? '#dc3545' : '#e5e7eb'
          }}
        />
        {touched.title && errors.title && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {errors.title}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">Description <span className="text-danger">*</span></label>
        <textarea
          className={`form-control shadow-none rounded-2 text-dark ${touched.description && errors.description ? 'is-invalid' : ''}`}
          placeholder="Describe the issue in detail..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (touched.description) {
              setErrors(prev => ({
                ...prev,
                description: e.target.value.trim().length === 0
                  ? 'Description is required'
                  : e.target.value.trim().length < 10
                    ? 'Description must be at least 10 characters'
                    : undefined
              }));
            }
          }}
          onBlur={handleDescBlur}
          rows={5}
          style={{
            borderRadius: '8px',
            fontSize: '0.9rem',
            resize: 'vertical',
            minHeight: '120px',
            borderColor: touched.description && errors.description ? '#dc3545' : '#e5e7eb'
          }}
        />
        {touched.description && errors.description && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {errors.description}
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
          value={priority}
          onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
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
      <div className="d-flex justify-content-end gap-2">
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
          className="btn btn-dark"
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