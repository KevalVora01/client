import React, { useState, useRef, useCallback, useEffect } from 'react';
import { visitorApi } from '../api/visitorApi';
import { User, Phone, Tag, Calendar, Car, RefreshCw, Camera, Upload, X } from 'lucide-react';
import { showError, showSuccess } from '../../../utils/toast';

interface PreRegisterVisitorModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PreRegisterVisitorModal: React.FC<PreRegisterVisitorModalProps> = ({ show, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedAt, setExpectedAt] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Visitor name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (phone.length !== 10 || !/^\d{10}$/.test(phone)) errs.phone = 'Phone number must be exactly 10 digits';
    if (!purpose.trim()) errs.purpose = 'Purpose of visit is required';
    if (!expectedAt) errs.expectedAt = 'Expected arrival date is required';
    else {
      const selectedDate = new Date(expectedAt + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) errs.expectedAt = 'Expected arrival date cannot be in the past';
    }
    return errs;
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
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
      streamRef.current.getTracks().forEach((track) => track.stop());
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
            const file = new File([blob], `visitor-prereg-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg', 0.85);
      }
    }
  }, [stopCamera]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    setTouched({ name: true, phone: true, purpose: true, expectedAt: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      await visitorApi.preRegister(
        {
          name: name.trim(),
          phone: phone.trim(),
          purpose: purpose.trim(),
          expectedAt: new Date(expectedAt + 'T00:00:00').toISOString(),
          vehicleNumber: vehicleNumber.trim() || undefined,
        },
        photo || undefined
      );

      showSuccess('Visitor pre-registered successfully!');
      onSuccess();
      onClose();
      // Reset
      setName('');
      setPhone('');
      setPurpose('');
      setExpectedAt('');
      setVehicleNumber('');
      setPhoto(null);
      setPhotoPreview(null);
      setErrors({});
      setTouched({});
      stopCamera();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      showError(axiosError?.response?.data?.message || 'Failed to pre-register visitor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ backdropFilter: "blur(4px)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          
          {/* ── Header ── */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: "1rem", color: "#1a1f36" }}>
                Pre-Register Expected Visitor
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: "0.8rem" }}>
                Fill in details for expected guest entry approval.
              </p>
            </div>

            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body px-4 py-3">
              {/* Visitor Name */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-medium text-secondary small mb-0">
                    Visitor Name <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${name.length === 100 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {name.length}/100
                  </span>
                </div>
                <div className="input-group">
                  <span
                    className={`input-group-text bg-light border-end-0 ${touched.name && errors.name ? 'border-danger' : ''}`}
                    style={{ borderColor: touched.name && errors.name ? '#dc3545' : '#e5e7eb' }}
                  >
                    <User size={18} className={touched.name && errors.name ? "text-danger" : "text-secondary"} />
                  </span>
                  <input
                    type="text"
                    className={`form-control border-start-0 shadow-none text-dark ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    placeholder="Full name of expected visitor"
                    maxLength={100}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) setErrors(prev => ({ ...prev, name: e.target.value.trim() ? '' : 'Visitor name is required' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    style={{ fontSize: "0.875rem", borderColor: touched.name && errors.name ? '#dc3545' : '#e5e7eb' }}
                  />
                </div>
                {touched.name && errors.name && (
                  <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-medium text-secondary small mb-0">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${phone.length === 10 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {phone.length}/10
                  </span>
                </div>
                <div className="input-group">
                  <span
                    className={`input-group-text bg-light border-end-0 ${touched.phone && errors.phone ? 'border-danger' : ''}`}
                    style={{ borderColor: touched.phone && errors.phone ? '#dc3545' : '#e5e7eb' }}
                  >
                    <Phone size={18} className={touched.phone && errors.phone ? "text-danger" : "text-secondary"} />
                  </span>
                  <input
                    type="tel"
                    className={`form-control border-start-0 shadow-none text-dark ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPhone(val);
                      if (touched.phone) setErrors(prev => ({ ...prev, phone: val.length === 10 ? '' : 'Phone number must be exactly 10 digits' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    style={{ fontSize: "0.875rem", borderColor: touched.phone && errors.phone ? '#dc3545' : '#e5e7eb' }}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Purpose of Visit */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-medium text-secondary small mb-0">
                    Purpose of Visit <span className="text-danger">*</span>
                  </label>
                  <span className={`small fw-medium ${purpose.length === 150 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {purpose.length}/150
                  </span>
                </div>
                <div className="input-group">
                  <span
                    className={`input-group-text bg-light border-end-0 ${touched.purpose && errors.purpose ? 'border-danger' : ''}`}
                    style={{ borderColor: touched.purpose && errors.purpose ? '#dc3545' : '#e5e7eb' }}
                  >
                    <Tag size={18} className={touched.purpose && errors.purpose ? "text-danger" : "text-secondary"} />
                  </span>
                  <input
                    type="text"
                    className={`form-control border-start-0 shadow-none text-dark ${touched.purpose && errors.purpose ? 'is-invalid' : ''}`}
                    placeholder="e.g. Guest, Delivery, Service"
                    maxLength={150}
                    value={purpose}
                    onChange={(e) => {
                      setPurpose(e.target.value);
                      if (touched.purpose) setErrors(prev => ({ ...prev, purpose: e.target.value.trim() ? '' : 'Purpose of visit is required' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, purpose: true }))}
                    style={{ fontSize: "0.875rem", borderColor: touched.purpose && errors.purpose ? '#dc3545' : '#e5e7eb' }}
                  />
                </div>
                {touched.purpose && errors.purpose && (
                  <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                    {errors.purpose}
                  </div>
                )}
              </div>

              {/* Expected Date */}
              <div className="mb-3">
                <label className="form-label fw-medium text-secondary small mb-1">
                  Expected Date <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span
                    className={`input-group-text bg-light border-end-0 ${touched.expectedAt && errors.expectedAt ? 'border-danger' : ''}`}
                    style={{ borderColor: touched.expectedAt && errors.expectedAt ? '#dc3545' : '#e5e7eb' }}
                  >
                    <Calendar size={18} className={touched.expectedAt && errors.expectedAt ? "text-danger" : "text-secondary"} />
                  </span>
                  <input
                    type="date"
                    className={`form-control border-start-0 shadow-none text-dark ${touched.expectedAt && errors.expectedAt ? 'is-invalid' : ''}`}
                    value={expectedAt}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => {
                      setExpectedAt(e.target.value);
                      if (touched.expectedAt) setErrors(prev => ({ ...prev, expectedAt: e.target.value ? '' : 'Expected arrival date is required' }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, expectedAt: true }))}
                    style={{ fontSize: "0.875rem", borderColor: touched.expectedAt && errors.expectedAt ? '#dc3545' : '#e5e7eb' }}
                  />
                </div>
                {touched.expectedAt && errors.expectedAt && (
                  <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
                    {errors.expectedAt}
                  </div>
                )}
              </div>

              {/* Vehicle Plate Number */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-medium text-secondary small mb-0">
                    Vehicle Plate Number <span className="text-muted fw-normal">(Optional)</span>
                  </label>
                  <span className={`small fw-medium ${vehicleNumber.length === 20 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
                    {vehicleNumber.length}/20
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Car size={18} className="text-secondary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 shadow-none text-dark"
                    placeholder="e.g. MH 12 AB 1234"
                    maxLength={20}
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
              </div>

              {/* Visitor Photo (Optional) */}
              <div className="mb-3">
                <label className="form-label fw-medium text-secondary small mb-1">
                  Visitor Photo <span className="text-muted fw-normal">(Optional)</span>
                </label>

                {!cameraOpen && !photoPreview && (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5 flex-grow-1 py-2"
                      onClick={startCamera}
                      style={{ borderRadius: '8px' }}
                    >
                      <Camera size={15} />
                      Take Photo
                    </button>
                    <label
                      className="btn btn-outline-secondary btn-sm fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5 flex-grow-1 py-2 mb-0"
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                    >
                      <Upload size={15} />
                      Upload File
                      <input type="file" accept="image/*" className="d-none" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                )}

                {cameraOpen && (
                  <div className="position-relative rounded-3 overflow-hidden" style={{ backgroundColor: '#000' }}>
                    <video ref={videoRef} autoPlay playsInline muted className="w-100" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                    <div className="position-absolute bottom-0 start-0 end-0 p-2 d-flex justify-content-center gap-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                      <button type="button" className="btn btn-light btn-sm fw-semibold rounded-pill px-3" onClick={capturePhoto}>
                        <Camera size={14} className="me-1" /> Capture
                      </button>
                      <button type="button" className="btn btn-outline-light btn-sm fw-semibold rounded-pill px-3" onClick={stopCamera}>
                        <X size={14} className="me-1" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {photoPreview && !cameraOpen && (
                  <div className="d-flex align-items-center gap-3 bg-light p-2 rounded-3 border">
                    <img src={photoPreview} alt="Preview" className="rounded border object-fit-cover" style={{ width: '60px', height: '60px' }} />
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-secondary py-1 px-2" style={{ fontSize: '0.75rem' }} onClick={() => { removePhoto(); startCamera(); }}>
                        <RefreshCw size={12} className="me-1" /> Retake
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger py-1 px-2" style={{ fontSize: '0.75rem' }} onClick={removePhoto}>
                        <X size={12} className="me-1" /> Remove
                      </button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="modal-footer border-top border-light-subtle px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
                style={{ height: "38px", fontSize: "0.875rem" }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center gap-2"
                style={{ height: "38px", fontSize: "0.875rem", borderRadius: "8px" }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Registering...
                  </>
                ) : (
                  'Register Visitor'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreRegisterVisitorModal;
