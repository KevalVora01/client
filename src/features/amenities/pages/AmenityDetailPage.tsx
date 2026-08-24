import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useAmenityDetail } from '../hooks/useAmenityDetail';
import { useBookingMutations } from '../hooks/useBookingMutations';
import { useBlackouts } from '../hooks/useBlackouts';
import { amenityApi } from '../api/amenityApi';
import type { AvailabilityResult, CreateBookingPayload, CreateBlackoutPayload } from '../types/amenity.types';
import AvailabilityGrid from '../components/AvailabilityGrid';
import BookingFormModal from '../components/BookingFormModal';
import BlackoutModal from '../components/BlackoutModal';

const AmenityDetailPage = () => {
  const { id } = useParams();
  const amenityId = Number(id);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { amenity, blackouts, loading, refetch } = useAmenityDetail(amenityId);
  const bookingMutations = useBookingMutations();
  const blackoutOps = useBlackouts(amenityId, refetch);
  const navigate = useNavigate();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [avLoading, setAvLoading] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [blackoutOpen, setBlackoutOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ start?: string; end?: string }>({});

  useScrollLock(bookingOpen || blackoutOpen);

  const loadAvailability = useCallback(async () => {
    setAvLoading(true);
    try {
      const a = await amenityApi.getAvailability(amenityId, date);
      setAvailability(a);
    } catch {
      setAvailability(null);
    } finally {
      setAvLoading(false);
    }
  }, [amenityId, date]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setAvLoading(true);
      try {
        const a = await amenityApi.getAvailability(amenityId, date);
        if (!cancelled) setAvailability(a);
      } catch {
        if (!cancelled) setAvailability(null);
      } finally {
        if (!cancelled) setAvLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [amenityId, date]);

  const openBooking = (start?: string, end?: string) => {
    setPrefill(start && end ? { start, end } : {});
    setBookingOpen(true);
  };

  const handleBook = async (payload: CreateBookingPayload): Promise<boolean> => {
    const ok = await bookingMutations.create(payload);
    if (ok) { setBookingOpen(false); loadAvailability(); }
    return ok;
  };

  const handleBlackout = async (payload: CreateBlackoutPayload): Promise<boolean> => {
    const ok = await blackoutOps.create(payload);
    if (ok) setBlackoutOpen(false);
    return ok;
  };

  if (loading) {
    return <div className="container-fluid p-4 text-center"><div className="spinner-border text-primary" /></div>;
  }
  if (!amenity) {
    return <div className="container-fluid p-4 text-center text-muted">Amenity not found.</div>;
  }

  return (
    <div className="container-fluid p-3 p-md-4">
      <button className="btn btn-link text-decoration-none ps-0 mb-2 text-secondary" onClick={() => navigate('/amenities')}>
        <i className="bi bi-arrow-left me-1" /> Back to amenities
      </button>

      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#1a1f36' }}>{amenity.name}</h4>
          <p className="text-muted mb-0 small">{amenity.description ?? 'No description provided.'}</p>
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: amenity.isActive ? '#d1fae5' : '#f3f4f6',
            color: amenity.isActive ? '#065f46' : '#6b7280',
            fontSize: '0.8rem',
          }}
        >
          {amenity.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>Details</h6>
              <p className="small text-secondary mb-1"><i className="bi bi-clock me-1" /> Operating: {amenity.operatingStart} – {amenity.operatingEnd}</p>
              {amenity.capacity != null && (
                <p className="small text-secondary mb-3"><i className="bi bi-people me-1" /> Capacity: {amenity.capacity}</p>
              )}

              <hr className="border-light-subtle" />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Blackouts</h6>
                {isAdmin && (
                  <button className="btn btn-sm btn-outline-dark" style={{ borderRadius: '8px' }} onClick={() => setBlackoutOpen(true)}>
                    <i className="bi bi-plus-lg me-1" /> Add
                  </button>
                )}
              </div>
              {blackouts.length === 0 ? (
                <p className="small text-muted mb-0">No blackouts configured.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {blackouts.map((b) => (
                    <li key={b.id} className="d-flex justify-content-between align-items-start small border-bottom border-light-subtle py-2">
                      <div>
                        <div className="fw-medium" style={{ color: '#1a1f36' }}>{b.date}</div>
                        <div className="text-secondary">{b.startTime} – {b.endTime}</div>
                        <div className="text-muted">{b.reason}</div>
                      </div>
                      {isAdmin && (
                        <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: '8px' }} onClick={() => blackoutOps.remove(b.id)}>
                          <i className="bi bi-trash" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Availability</h6>
                <input
                  type="date"
                  className="form-control shadow-none border-light-subtle"
                  style={{ fontSize: '0.875rem', height: '38px', maxWidth: '200px' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <AvailabilityGrid
                availability={availability}
                loading={avLoading}
                onOpenBooking={() => openBooking()}
              />

              <div className="mt-4 d-grid d-sm-flex justify-content-sm-end">
                <button
                  className="btn btn-dark fw-medium px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#1a1f36' }}
                  onClick={() => openBooking()}
                >
                  <i className="bi bi-calendar-plus" /> Book This Amenity (Custom Duration)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <BookingFormModal
          amenityId={amenityId}
          isAdmin={isAdmin}
          initialDate={date}
          initialStart={prefill.start}
          initialEnd={prefill.end}
          operatingStart={amenity.operatingStart}
          operatingEnd={amenity.operatingEnd}
          loading={bookingMutations.loading}
          onSubmit={handleBook}
          onCancel={() => setBookingOpen(false)}
        />
      )}

      {blackoutOpen && (
        <BlackoutModal loading={blackoutOps.loading} onSubmit={handleBlackout} onCancel={() => setBlackoutOpen(false)} />
      )}
    </div>
  );
};

export default AmenityDetailPage;
