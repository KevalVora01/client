import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UploadCloud, Trash2 } from 'lucide-react';
import type { Amenity } from '../types/amenity.types';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Min 2 characters').max(100, 'Max 100 characters').required('Name is required'),
  description: Yup.string().nullable(),
  capacity: Yup.number().nullable().min(0, 'Must be 0 or more'),
  operatingStart: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating start is required'),
  operatingEnd: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating end is required'),
  price: Yup.number().min(0, 'Price cannot be negative').default(0),
  isActive: Yup.boolean(),
});

interface AmenityFormModalProps {
  amenity?: Amenity | null;
  loading: boolean;
  onSubmit: (payload: FormData) => Promise<boolean>;
  onCancel: () => void;
}

interface ImageItem {
  id: string;
  type: 'existing' | 'file';
  url: string;
  file?: File;
}

const AmenityFormModal = ({ amenity, loading, onSubmit, onCancel }: AmenityFormModalProps) => {
  const isEdit = !!amenity;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const initialImages: ImageItem[] = (
    Array.isArray(amenity?.images) ? amenity.images : []
  ).map((url, idx) => ({
    id: `existing-${idx}-${url}`,
    type: 'existing',
    url,
  }));

  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [imageError, setImageError] = useState('');

  const processFiles = (files: File[]) => {
    setImageError('');
    const validImageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (!validImageFiles.length) {
      setImageError('Please select valid image files (JPG, PNG, WEBP, etc.)');
      return;
    }

    if (images.length + validImageFiles.length > 5) {
      setImageError(`Maximum 5 images allowed. You can only add ${5 - images.length} more.`);
      return;
    }

    const newItems: ImageItem[] = validImageFiles.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}-${file.name}`,
      type: 'file',
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    processFiles(files);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError('');
  };

  const formik = useFormik({
    initialValues: {
      name: amenity?.name ?? '',
      description: amenity?.description ?? '',
      capacity: amenity?.capacity ?? '',
      operatingStart: amenity?.operatingStart ?? '08:00',
      operatingEnd: amenity?.operatingEnd ?? '20:00',
      price: amenity?.price ?? 0,
      isActive: amenity?.isActive ?? true,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('description', values.description?.trim() || '');
      if (values.capacity !== '' && values.capacity != null) {
        formData.append('capacity', String(values.capacity));
      }
      formData.append('operatingStart', values.operatingStart);
      formData.append('operatingEnd', values.operatingEnd);
      formData.append('price', String(values.price || 0));
      formData.append('isActive', String(isEdit ? values.isActive : true));

      // Separate existing URLs and newly uploaded file objects
      const existingUrls = images.filter((img) => img.type === 'existing').map((img) => img.url);
      formData.append('existingImages', JSON.stringify(existingUrls));

      const newFiles = images.filter((img) => img.type === 'file' && img.file).map((img) => img.file!);
      newFiles.forEach((file) => {
        formData.append('images', file);
      });

      await onSubmit(formData);
    },
  });

  const fieldClass = (field: string) =>
    `form-control shadow-none ${formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] ? 'is-invalid' : 'border-light-subtle'}`;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white" style={{ overflow: 'visible' }}>
          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                {isEdit ? 'Edit Amenity' : 'Add Amenity'}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                Configure operating hours, pricing, photos, and details.
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

          <div className="modal-body p-3 p-sm-4" style={{ overflow: 'visible' }}>
            <form onSubmit={formik.handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-medium text-secondary small mb-1">
                    Amenity Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Swimming Pool, Clubhouse, Tennis Court"
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

                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">
                    Booking Price (₹)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light-subtle text-secondary small">₹</span>
                    <input
                      type="number"
                      min={0}
                      name="price"
                      placeholder="0 for free"
                      className={fieldClass('price')}
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ fontSize: '0.875rem', height: '40px' }}
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-danger small mt-1">{formik.errors.price}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Description</label>
                  <textarea
                    name="description"
                    className={fieldClass('description')}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amenity rules, equipment provided, or booking guidelines..."
                    style={{ fontSize: '0.875rem', height: '85px', resize: 'none' }}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-secondary small mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Max people (optional)"
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

                {/* ── Photos Section (Up to 5 images) ── */}
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label fw-medium text-secondary small mb-0">
                      Amenity Photos (Max 5)
                    </label>
                    <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                      {images.length} / 5 photos
                    </span>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="d-none"
                  />

                  {images.length < 5 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 mb-2 text-center"
                      style={{
                        border: isDragging ? '2px dashed #1a1f36' : '2px dashed #cbd5e1',
                        backgroundColor: isDragging ? '#f1f5f9' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <UploadCloud size={24} className="text-secondary mb-1" />
                      <div className="fw-semibold text-dark small" style={{ fontSize: '0.85rem' }}>
                        Click to upload photos from device or drag & drop
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        PNG, JPG, WEBP up to 5MB each (up to {5 - images.length} more)
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div className="text-danger small mb-2">{imageError}</div>
                  )}

                  {/* Thumbnail gallery */}
                  {images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 pt-1">
                      {images.map((img, idx) => (
                        <div
                          key={img.id}
                          className="position-relative rounded-3 overflow-hidden border border-light-subtle shadow-sm"
                          style={{ width: '92px', height: '72px', background: '#f8fafc' }}
                        >
                          <img
                            src={img.url}
                            alt={`Amenity photo ${idx + 1}`}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/180x140?text=Invalid+Image';
                            }}
                          />
                          {idx === 0 && (
                            <span
                              className="badge bg-dark position-absolute"
                              style={{ bottom: 2, left: 2, fontSize: '0.6rem', padding: '2px 4px' }}
                            >
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="btn btn-danger position-absolute p-0 d-flex align-items-center justify-content-center rounded-circle"
                            style={{ top: 3, right: 3, width: '20px', height: '20px', fontSize: '0.7rem' }}
                            title="Remove photo"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
