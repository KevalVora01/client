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
    showError(null);

    if (title.trim().length < 3) {
      showError('Title must be at least 3 characters');
      return;
    }
    if (description.trim().length < 10) {
      showError('Description must be at least 10 characters');
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Title */}
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Title</label>
        <input
          type="text"
          className="form-control shadow-none"
          placeholder="e.g. Leaking pipe in kitchen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Description</label>
        <textarea
          className="form-control shadow-none"
          placeholder="Describe the issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ borderRadius: '8px', fontSize: '0.9rem', resize: 'vertical', minHeight: '120px' }}
        />
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
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>

    </form>
  );
};

export default ComplaintForm;