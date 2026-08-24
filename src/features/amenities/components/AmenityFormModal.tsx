import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UploadCloud, Trash2, Users, Lock } from 'lucide-react';
import type { Amenity, AmenityBookingType } from '../types/amenity.types';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Min 2 characters').max(100, 'Max 100 characters').required('Name is required'),
  description: Yup.string().nullable(),
  capacity: Yup.number().nullable().min(1, 'Capacity must be at least 1 person'),
  operatingStart: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating start is required'),
  operatingEnd: Yup.string().matches(TIME_RE, 'HH:MM required').required('Operating end is required'),
  bookingType: Yup.string().oneOf(['EXCLUSIVE', 'SHARED_CAPACITY']).default('EXCLUSIVE'),
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
      operatingStart: amenity?.operatingStart ?? '06:00',
      operatingEnd: amenity?.operatingEnd ?? '22:00',
      bookingType: (amenity?.bookingType ?? 'EXCLUSIVE') as AmenityBookingType,
      price: amenity?.bookingType === 'SHARED_CAPACITY' ? 0 : (amenity?.price ?? 0),
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
      formData.append('bookingType', values.bookingType);
      formData.append('price', String(values.bookingType === 'SHARED_CAPACITY' ? 0 : (values.price || 0)));
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

  const isShared = formik.values.bookingType === 'SHARED_CAPACITY';

  const fieldClass = (field: string) =>
    `form-control shadow-none ${formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] ? 'is-invalid' : 'border-light-subtle'}`;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white" style={{ overflow: 'visible' }}>
          <div className="modal-header border-bottom border-light-subtle px-3 px-sm-4 pt-4 pb-3 align-items-start position-relative">
            <div>
              <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
                {isEdit ? 'Edit Amenity' : 'Add Amenity'}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                Configure facility access type, capacity, hours, and photos.
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
                {/* ── Facility Booking Type Selector ── */}
                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-2">
                    Facility Access Type <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <div
                        onClick={() => {
                          formik.setFieldValue('bookingType', 'SHARED_CAPACITY');
                          formik.setFieldValue('price', 0);
                          if (!formik.values.capacity) formik.setFieldValue('capacity', 25);
                        }}
                        className={`p-3 rounded-3 border d-flex align-items-start gap-3 cursor-pointer ${
                          isShared ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-white'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        <div className={`p-2 rounded-2 ${isShared ? 'bg-primary text-white' : 'bg-light text-secondary'}`}>
                          <Users size={20} />
                        </div>
                        <div>
                          <div className="fw-bold small text-dark d-flex align-items-center gap-1">
                            Shared Public Facility
                            <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>Free</span>
                          </div>
                          <p className="text-secondary small mb-0" style={{ fontSize: '0.76rem' }}>
                            Gym, Yoga Studio, Pool. Multiple residents book concurrently with live crowd stats.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div
                        onClick={() => formik.setFieldValue('bookingType', 'EXCLUSIVE')}
                        className={`p-3 rounded-3 border d-flex align-items-start gap-3 cursor-pointer ${
                          !isShared ? 'border-dark bg-light' : 'border-light-subtle bg-white'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        <div className={`p-2 rounded-2 ${!isShared ? 'bg-dark text-white' : 'bg-light text-secondary'}`}>
                          <Lock size={20} />
                        </div>
                        <div>
                          <div className="fw-bold small text-dark">
                            Exclusive Private Booking
                          </div>
                          <p className="text-secondary small mb-0" style={{ fontSize: '0.76rem' }}>
                            Banquet Hall, Party Lawn, Tennis Court. Reserved exclusively for 1 apartment per slot.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-7">
                  <label className="form-label fw-medium text-secondary small mb-1">
                    Amenity Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Fitness Gymnasium, Swimming Pool, Clubhouse Hall"
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

                <div className="col-12 col-md-5">
                  <label className="form-label fw-medium text-secondary small mb-1">
                    {isShared ? 'Max Concurrent People (Capacity)' : 'Capacity (Max Attendees)'}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="capacity"
                    placeholder={isShared ? 'e.g. 25 people' : 'e.g. 100 people'}
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

                {!isShared && (
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-medium text-secondary small mb-1">
                      Booking Fee (₹)
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
                )}

                <div className={isShared ? 'col-12 col-md-6' : 'col-12 col-md-4'}>
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

                <div className={isShared ? 'col-12 col-md-6' : 'col-12 col-md-4'}>
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

                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Description</label>
                  <textarea
                    name="description"
                    className={fieldClass('description')}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter facility description, equipment available, guidelines..."
                    style={{ fontSize: '0.875rem', height: '80px', resize: 'none' }}
                  />
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
                      <UploadCloud size={28} className="text-secondary mb-1" />
                      <div className="small fw-semibold text-dark mb-0">
                        Click or drag & drop photos here
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        PNG, JPG, WEBP up to 5MB each ({5 - images.length} remaining)
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div className="text-danger small mb-2">{imageError}</div>
                  )}

                  {/* Uploaded Thumbnails Preview */}
                  {images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 pt-1">
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          className="position-relative rounded-2 overflow-hidden border border-light-subtle shadow-sm"
                          style={{ width: '82px', height: '82px', background: '#f8fafc' }}
                        >
                          <img
                            src={img.url}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="btn btn-sm btn-danger position-absolute p-0 d-flex align-items-center justify-content-center"
                            style={{
                              top: 4,
                              right: 4,
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              opacity: 0.9,
                            }}
                            title="Remove photo"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-12 pt-2">
                  <div className="d-grid d-sm-flex gap-2 justify-content-sm-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-2 px-3 small"
                      onClick={onCancel}
                      disabled={loading}
                      style={{ height: '38px', fontSize: '0.875rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark fw-medium px-4 d-inline-flex align-items-center justify-content-center"
                      disabled={loading}
                      style={{ height: '38px', fontSize: '0.875rem', borderRadius: '8px', opacity: loading ? 0.55 : 1 }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        isEdit ? 'Save Changes' : 'Create Amenity'
                      )}
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
