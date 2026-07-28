import { useState, useEffect } from 'react';
import { apartmentApi } from '../../apartments/api/apartmentApi';
import type { Apartment } from '../../apartments/types/apartment.types';
import type { LogWalkInPayload } from '../types/visitor.types';

interface WalkInVisitorFormProps {
  loading?: boolean;
  onSubmit: (payload: LogWalkInPayload, photo?: File) => Promise<boolean>;
  onCancel?: () => void;
}

const WalkInVisitorForm = ({ loading = false, onSubmit, onCancel }: WalkInVisitorFormProps) => {
  const [apartmentQuery, setApartmentQuery] = useState('');
  const [apartmentResults, setApartmentResults] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [apartmentSearchLoading, setApartmentSearchLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedApartment || apartmentQuery.trim().length < 1) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setApartmentSearchLoading(true);
      try {
        const res = await apartmentApi.getApartments({ search: apartmentQuery.trim(), pageSize: 8, pageNumber: 1 });
        if (!cancelled) setApartmentResults(res.items);
      } catch {
        if (!cancelled) setApartmentResults([]);
      } finally {
        if (!cancelled) setApartmentSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [apartmentQuery, selectedApartment]);

  const handleSelectApartment = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setApartmentQuery(`${apartment.block} - ${apartment.unitNumber}`);
    setApartmentResults([]);
  };

  const handleClearApartment = () => {
    setSelectedApartment(null);
    setApartmentQuery('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedApartment) {
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
        apartmentId: selectedApartment.id,
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
      handleClearApartment();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* Apartment lookup */}
      <div className="mb-3 position-relative">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Apartment</label>
        <div className="position-relative d-flex align-items-center">
          <input
            type="text"
            className="form-control shadow-none"
            placeholder="Search block or unit number"
            value={apartmentQuery}
            onChange={(e) => { setApartmentQuery(e.target.value); setSelectedApartment(null); }}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          />
          {selectedApartment && (
            <button
              type="button"
              className="btn btn-sm position-absolute"
              onClick={handleClearApartment}
              style={{ right: '8px', color: '#9ca3af' }}
            >
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>

        {apartmentSearchLoading && (
          <div className="text-secondary mt-1" style={{ fontSize: '0.8rem' }}>Searching...</div>
        )}

        {!selectedApartment && apartmentResults.length > 0 && (
          <div
            className="position-absolute w-100 bg-white rounded-3 shadow-sm mt-1"
            style={{ border: '1px solid #e5e7eb', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}
          >
            {apartmentResults.map((apt) => (
              <div
                key={apt.id}
                className="px-3 py-2"
                style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleSelectApartment(apt)}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {apt.block} - {apt.unitNumber} <span className="text-secondary">(Floor {apt.floorNumber})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Visitor Name</label>
          <input
            type="text"
            className="form-control shadow-none"
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

      <div className="d-flex align-items-center gap-2">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={loading}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary flex-grow-1"
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        >
          {loading ? 'Logging visitor...' : 'Log Visitor & Send Approval Request'}
        </button>
      </div>
    </form>
  );
};

export default WalkInVisitorForm;