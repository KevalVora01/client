import { useState } from 'react';
import ApartmentSelect from '../../apartments/components/ApartmentSelect';
import type { LogWalkInPayload } from '../types/visitor.types';

interface WalkInVisitorFormProps {
  loading?: boolean;
  onSubmit: (payload: LogWalkInPayload, photo?: File) => Promise<boolean>;
  onCancel?: () => void;
}

const WalkInVisitorForm = ({ loading = false, onSubmit, onCancel }: WalkInVisitorFormProps) => {
  const [apartmentId, setApartmentId] = useState<number>(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!apartmentId || apartmentId === 0) {
      setError('Please select an apartment');
      return;
    }
    if (name.trim().length < 2) {
      setError('Visitor name is required');
      return;
    }
    if (phone.trim().length !== 10) {
      setError('Phone must be exactly 10 digits');
      return;
    }
    if (purpose.trim().length < 2) {
      setError('Purpose is required');
      return;
    }

    const success = await onSubmit(
      {
        apartmentId,
        name: name.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        vehicleNumber: vehicleNumber.trim() || undefined,
      },
      photo ?? undefined
    );

    if (success) {
      setName('');
      setPhone('');
      setPurpose('');
      setVehicleNumber('');
      setPhoto(null);
      setPhotoPreview(null);
      setApartmentId(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Apartment Select (Same as Resident Modal) */}
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>
          Apartment <span className="text-danger">*</span>
        </label>
        <ApartmentSelect
          value={apartmentId}
          onChange={(id) => {
            setApartmentId(id);
            if (error) setError(null);
          }}
          onlyOccupied={true}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Visitor Name</label>
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Enter visitor full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Phone Number</label>
          <input
            type="tel"
            className="form-control shadow-none"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Purpose of Visit</label>
        <input
          type="text"
          className="form-control shadow-none"
          placeholder="e.g. Delivery, Guest, Maintenance work"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>
            Vehicle Number <span className="text-secondary fw-normal">(optional)</span>
          </label>
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="e.g. GJ-01-AB-1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="form-control shadow-none"
            onChange={handlePhotoChange}
            style={{ borderRadius: '8px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {photoPreview && (
        <div className="mb-3">
          <img
            src={photoPreview}
            alt="Visitor preview"
            style={{ width: '72px', height: '72px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
          />
        </div>
      )}

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
          className="btn btn-primary fw-medium px-3.5 d-inline-flex align-items-center"
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
              <i className="bi bi-person-plus me-1.5" />
              Log Visitor
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default WalkInVisitorForm;