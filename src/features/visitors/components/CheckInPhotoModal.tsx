import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Visitor } from '../types/visitor.types';
import { Camera, RefreshCw, X, CheckCircle2, User, Phone, MapPin, Car, Upload } from 'lucide-react';
import { showError } from '../../../utils/toast';

interface CheckInPhotoModalProps {
  show: boolean;
  visitor: Visitor | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (visitorId: number, photo?: File) => Promise<boolean | void>;
}

export const CheckInPhotoModal: React.FC<CheckInPhotoModalProps> = ({
  show,
  visitor,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reset modal state when visitor changes or modal closes
  useEffect(() => {
    if (!show) {
      stopCamera();
      setPhoto(null);
      setPhotoPreview(null);
      setError(null);
    }
  }, [show]);

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
            const file = new File([blob], `visitor-checkin-${Date.now()}.jpg`, { type: 'image/jpeg' });
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

  const handleCheckIn = async () => {
    if (!visitor) return;

    const hasPhotoOnRecord = Boolean(visitor.photoUrl);
    if (!photo && !hasPhotoOnRecord) {
      showError('A visitor photo is required before completing check-in. Please capture or upload a photo.');
      return;
    }

    const success = await onConfirm(visitor.id, photo || undefined);
    if (success !== false) {
      onClose();
    }
  };

  if (!show || !visitor) return null;

  const currentPhoto = photoPreview || visitor.photoUrl;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ backdropFilter: "blur(4px)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          
          {/* Modal Header */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: "1rem", color: "#1a1f36" }}>
                Visitor Gate Check-In
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: "0.8rem" }}>
                Capture visitor photo and verify identity to grant entry.
              </p>
            </div>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small rounded-3" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            {/* Visitor Summary Info */}
            <div className="card border-0 bg-light p-3 rounded-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={visitor.name}
                    className="rounded-3 flex-shrink-0 object-fit-cover border"
                    style={{ width: '54px', height: '54px', borderColor: '#cbd5e1' }}
                  />
                ) : (
                  <div
                    className="rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center border"
                    style={{ width: '54px', height: '54px', backgroundColor: '#e2e8f0', color: '#64748b' }}
                  >
                    <User size={24} />
                  </div>
                )}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.95rem' }}>
                      {visitor.name}
                    </h6>
                    {visitor.isPreRegistered && (
                      <span className="badge bg-indigo-subtle text-indigo px-2 py-0.5 rounded-pill" style={{ fontSize: '0.68rem', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        Pre-Registered
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted flex-wrap" style={{ fontSize: '0.78rem' }}>
                    <span className="d-inline-flex align-items-center gap-1">
                      <Phone size={12} /> {visitor.phone}
                    </span>
                    <span>&middot;</span>
                    <span className="d-inline-flex align-items-center gap-1">
                      <MapPin size={12} /> {visitor.purpose}
                    </span>
                    {visitor.vehicleNumber && (
                      <>
                        <span>&middot;</span>
                        <span className="font-monospace d-inline-flex align-items-center gap-1">
                          <Car size={12} /> {visitor.vehicleNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Capture Section */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark d-flex align-items-center justify-content-between mb-2">
                <span>Visitor Photo Capture <span className="text-danger">*</span></span>
                {visitor.photoUrl && !photoPreview && (
                  <span className="text-success fw-normal" style={{ fontSize: '0.75rem' }}>
                    <CheckCircle2 size={12} className="me-1" /> Photo already attached from pre-registration
                  </span>
                )}
              </label>

              {/* Controls when camera is closed and no new photo preview */}
              {!cameraOpen && (
                <div className="d-flex gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark fw-semibold d-inline-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    onClick={startCamera}
                    style={{ borderRadius: '8px', fontSize: '0.85rem', height: '42px' }}
                  >
                    <Camera size={16} className="me-1.5" />
                    {visitor.photoUrl ? 'Capture New Photo' : 'Open Camera & Capture'}
                  </button>

                  <label
                    className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center justify-content-center gap-2 flex-grow-1 mb-0"
                    style={{ borderRadius: '8px', fontSize: '0.85rem', height: '42px', cursor: 'pointer' }}
                  >
                    <Upload size={16} />
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              )}

              {/* Active Camera View */}
              {cameraOpen && (
                <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ backgroundColor: '#000' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-100 rounded-3"
                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-center gap-2"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
                  >
                    <button
                      type="button"
                      className="btn btn-light fw-semibold px-3 py-2 d-inline-flex align-items-center gap-2"
                      onClick={capturePhoto}
                      style={{ borderRadius: '24px', fontSize: '0.85rem' }}
                    >
                      <Camera size={16} className="me-1.5" />
                      Capture Photo
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

              {/* Photo Preview Card */}
              {photoPreview && !cameraOpen && (
                <div className="card border-0 p-3 bg-light rounded-3 d-flex flex-row align-items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="Captured visitor"
                    className="rounded-2 border"
                    style={{ width: '84px', height: '84px', objectFit: 'cover' }}
                  />
                  <div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle mb-2 px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} className="me-1" /> New Photo Captured
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                        onClick={() => { removePhoto(); startCamera(); }}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <RefreshCw size={12} /> Retake
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={removePhoto}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top border-light-subtle px-4 py-3">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-2 px-3 small d-inline-flex align-items-center"
              onClick={onClose}
              disabled={loading}
              style={{ height: "38px", fontSize: "0.875rem" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center gap-2 text-white"
              onClick={handleCheckIn}
              disabled={loading}
              style={{ height: "38px", fontSize: "0.875rem", borderRadius: "8px" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" />
                  Checking In...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Check-In
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckInPhotoModal;
