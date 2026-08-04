import { useState, useRef, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ApartmentSelect from '../../apartments/components/ApartmentSelect';
import type { LogWalkInPayload } from '../types/visitor.types';
import { Camera, RefreshCw, X } from 'lucide-react';
import { showError } from '../../../utils/toast';

interface WalkInVisitorFormProps {
  loading?: boolean;
  onSubmit: (payload: LogWalkInPayload, photo?: File) => Promise<boolean>;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  apartmentId: Yup.number()
    .min(1, 'Please select an apartment')
    .required('Apartment is required'),
  name: Yup.string()
    .trim()
    .min(2, 'Visitor name is required')
    .required('Visitor name is required'),
  phone: Yup.string()
    .trim()
    .length(10, 'Phone must be exactly 10 digits')
    .matches(/^\d+$/, 'Phone must contain only numbers')
    .required('Phone is required'),
  purpose: Yup.string()
    .trim()
    .min(2, 'Purpose of visit is required')
    .required('Purpose of visit is required'),
  vehicleNumber: Yup.string()
    .trim()
    .optional(),
});

const WalkInVisitorForm = ({ loading = false, onSubmit, onCancel }: WalkInVisitorFormProps) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      streamRef.current = mediaStream;
      setCameraOpen(true);
    } catch {
      showError('Unable to access camera. Please upload a photo instead.');
    }
  }, []);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `visitor-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(blob));
            setPhotoError('');
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }, [stopCamera]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoError('');
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const formik = useFormik({
    initialValues: {
      apartmentId: 0,
      name: '',
      phone: '',
      purpose: '',
      vehicleNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!photo) {
        setPhotoError('Visitor photo is required for security verification');
        return;
      }

      const success = await onSubmit(
        {
          apartmentId: values.apartmentId,
          name: values.name.trim(),
          phone: values.phone.trim(),
          purpose: values.purpose.trim(),
          vehicleNumber: values.vehicleNumber.trim() || undefined,
        },
        photo
      );

      if (success) {
        formik.resetForm();
        setPhoto(null);
        setPhotoPreview(null);
        setPhotoError('');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      {/* Apartment Select */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">
          Apartment <span className="text-danger">*</span>
        </label>
        <ApartmentSelect
          value={formik.values.apartmentId}
          onChange={(id) => {
            formik.setFieldValue('apartmentId', id);
          }}
          onlyOccupied={true}
          error={formik.touched.apartmentId && formik.errors.apartmentId ? formik.errors.apartmentId : undefined}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-medium text-secondary small mb-1">
            Visitor Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control shadow-none rounded-2 text-dark ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
            placeholder="Enter visitor full name"
            {...formik.getFieldProps('name')}
            style={{ fontSize: '0.875rem', borderColor: formik.touched.name && formik.errors.name ? '#dc3545' : '#e5e7eb' }}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>
              {formik.errors.name}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label fw-medium text-secondary small mb-1">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className={`form-control shadow-none rounded-2 text-dark ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
            placeholder="Enter 10-digit mobile number"
            value={formik.values.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              formik.setFieldValue('phone', val);
            }}
            onBlur={formik.handleBlur}
            style={{ fontSize: '0.875rem', borderColor: formik.touched.phone && formik.errors.phone ? '#dc3545' : '#e5e7eb' }}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>
              {formik.errors.phone}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">
          Purpose of Visit <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control shadow-none rounded-2 text-dark ${formik.touched.purpose && formik.errors.purpose ? 'is-invalid' : ''}`}
          placeholder="e.g. Delivery, Guest, Maintenance work"
          {...formik.getFieldProps('purpose')}
          style={{ fontSize: '0.875rem', borderColor: formik.touched.purpose && formik.errors.purpose ? '#dc3545' : '#e5e7eb' }}
        />
        {formik.touched.purpose && formik.errors.purpose && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: "0.8rem" }}>
            {formik.errors.purpose}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">
          Vehicle Number <span className="text-muted fw-normal">(optional)</span>
        </label>
        <input
          type="text"
          className="form-control shadow-none rounded-2 text-dark"
          placeholder="e.g. GJ-01-AB-1234"
          {...formik.getFieldProps('vehicleNumber')}
          style={{ fontSize: '0.875rem', borderColor: '#e5e7eb' }}
        />
      </div>

      {/* Photo Capture Section */}
      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">
          Visitor Photo <span className="text-danger">*</span>
        </label>

        {!cameraOpen && !photoPreview && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-dark fw-semibold d-inline-flex align-items-center gap-2 flex-grow-1"
              onClick={startCamera}
              style={{ borderRadius: '8px', fontSize: '0.85rem', height: '42px' }}
            >
              <Camera size={16} />
              Open Camera
            </button>
            <label
              className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center gap-2 flex-grow-1 mb-0"
              style={{ borderRadius: '8px', fontSize: '0.85rem', height: '42px', cursor: 'pointer' }}
            >
              <i className="bi bi-upload" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        )}

        {/* Camera Live View */}
        {cameraOpen && (
          <div className="position-relative rounded-3 overflow-hidden" style={{ backgroundColor: '#000' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-100 rounded-3"
              style={{ maxHeight: '250px', objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-center gap-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <button
                type="button"
                className="btn btn-light fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2"
                onClick={capturePhoto}
                style={{ borderRadius: '24px', fontSize: '0.85rem' }}
              >
                <Camera size={16} />
                Capture
              </button>
              <button
                type="button"
                className="btn btn-outline-light fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2"
                onClick={stopCamera}
                style={{ borderRadius: '24px', fontSize: '0.85rem' }}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Photo Preview */}
        {photoPreview && !cameraOpen && (
          <div className="d-flex align-items-center gap-3">
            <img
              src={photoPreview}
              alt="Visitor preview"
              className="rounded-2 border"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div className="d-flex flex-column gap-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={() => { removePhoto(); startCamera(); }}
                style={{ fontSize: '0.78rem' }}
              >
                <RefreshCw size={12} /> Retake
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                onClick={removePhoto}
                style={{ fontSize: '0.78rem' }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        )}

        {photoError && (
          <div className="invalid-feedback d-block text-danger mt-2" style={{ fontSize: "0.8rem" }}>
            {photoError}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="d-flex align-items-center justify-content-end gap-2 mt-4 pt-2">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
            onClick={onCancel}
            disabled={loading}
            style={{ height: '38px', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center"
          disabled={loading}
          style={{
            height: '38px',
            fontSize: '0.875rem',
            borderRadius: '8px',
            opacity: loading ? 0.55 : 1,
          }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm mx-auto" role="status" />
          ) : (
            <>
              <i className="bi bi-person-plus me-1" />
              Log Visitor
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default WalkInVisitorForm;
