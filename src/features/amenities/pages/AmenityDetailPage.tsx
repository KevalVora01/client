import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, IndianRupee, Image as ImageIcon, CalendarPlus, Plus, Trash2, Lock, CheckCircle2, Sparkles } from 'lucide-react';
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
import DatePicker from '../../../components/DatePicker/DatePicker';

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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

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
    return (
      <div className="container-fluid p-4 text-center">
        <div className="py-5 card border-0 shadow-sm rounded-3 p-5 my-4">
          <div className="d-flex justify-content-center">
            <Sparkles size={48} className="text-secondary mb-3 opacity-50" />
          </div>
          <h5 className="fw-semibold text-dark mb-1">Amenity Not Found</h5>
          <p className="small text-muted mb-3">The facility you are looking for does not exist or has been removed.</p>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-dark px-3 py-1.5 fw-medium"
              onClick={() => navigate('/amenities')}
              style={{ borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Back to Amenities
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(amenity.images) ? amenity.images : [];
  const currentPhoto = images[selectedPhotoIndex] ?? images[0] ?? null;
  const isShared = amenity.bookingType === 'SHARED_CAPACITY' || amenity.isSharedCapacity;
  const isFree = isShared || !amenity.price || amenity.price === 0;

  return (
    <div className="container-fluid p-3 p-md-4">
      <button className="btn btn-link text-decoration-none ps-0 mb-2 text-secondary" onClick={() => navigate('/amenities')}>
        <i className="bi bi-arrow-left me-1" /> Back to amenities
      </button>

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h4 className="fw-bold mb-0 fs-4" style={{ color: '#1a1f36' }}>{amenity.name}</h4>
            <span
              className="badge d-inline-flex align-items-center gap-1"
              style={{
                backgroundColor: isShared ? '#ecfdf5' : '#f8fafc',
                color: isShared ? '#065f46' : '#334155',
                fontSize: '0.8rem',
                border: isShared ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                fontWeight: 600,
                padding: '5px 10px',
              }}
            >
              {isShared ? (
                <>
                  <Users size={13} /> Shared Facility
                </>
              ) : (
                <>
                  <Lock size={13} /> Exclusive Booking
                </>
              )}
            </span>
            {!isFree && (
              <span
                className="badge"
                style={{
                  backgroundColor: '#eef2ff',
                  color: '#4338ca',
                  fontSize: '0.8rem',
                  border: '1px solid #c7d2fe',
                  fontWeight: 600,
                }}
              >
                ₹{amenity.price} / booking
              </span>
            )}
          </div>
          <p className="text-muted mb-0 small">{amenity.description ?? 'No description provided.'}</p>
        </div>
      </div>

      <div className="row g-3">
        {/* ── Left Column: Photos, Details & Blackouts ── */}
        <div className="col-12 col-lg-4">
          
          {/* Photo Gallery Card */}
          <div className="card border-0 shadow-sm mb-3 overflow-hidden" style={{ borderRadius: '12px' }}>
            <div className="position-relative w-100" style={{ height: '220px', backgroundColor: '#f1f5f9' }}>
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={`${amenity.name} photo`}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Amenity+Photo';
                  }}
                />
              ) : (
                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                  <ImageIcon size={40} className="text-secondary opacity-50 mb-1" />
                  <span style={{ fontSize: '0.8rem' }}>No photos available</span>
                </div>
              )}

              {/* Price Tag Overlay */}
              <div
                className="badge position-absolute fw-bold"
                style={{
                  bottom: 12,
                  left: 12,
                  backgroundColor: isFree ? 'rgba(16, 185, 129, 0.92)' : 'rgba(30, 41, 59, 0.92)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {isFree ? 'Free Facility' : `₹${amenity.price}`}
              </div>
            </div>

            {/* Thumbnail Selectors (if > 1 image) */}
            {images.length > 1 && (
              <div className="card-body p-2 d-flex gap-2 overflow-auto bg-light border-top border-light-subtle">
                {images.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="p-0 border-0 rounded-2 overflow-hidden flex-shrink-0"
                    style={{
                      width: '56px',
                      height: '42px',
                      outline: selectedPhotoIndex === idx ? '2px solid #1a1f36' : '1px solid #e5e7eb',
                      opacity: selectedPhotoIndex === idx ? 1 : 0.65,
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Thumb ${idx + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x80?text=Photo';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Blackouts Card */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>Facility Details & Guidelines</h6>
              
              <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 small text-secondary">
                  <Clock size={15} className="text-muted flex-shrink-0" />
                  <span><strong>Operating Hours:</strong> {amenity.operatingStart} – {amenity.operatingEnd}</span>
                </div>
                {amenity.capacity != null && (
                  <div className="d-flex align-items-center gap-2 small text-secondary">
                    <Users size={15} className="text-muted flex-shrink-0" />
                    <span>
                      <strong>{isShared ? 'Max Concurrent People:' : 'Capacity:'}</strong> {amenity.capacity} people
                    </span>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2 small text-secondary">
                  <IndianRupee size={15} className="text-muted flex-shrink-0" />
                  <span>
                    <strong>Booking Fee:</strong>{' '}
                    {isFree ? (
                      <span className="text-success fw-semibold">Free (Instant Confirmation)</span>
                    ) : (
                      <span className="text-dark fw-bold">₹{amenity.price} (payable after voting approval)</span>
                    )}
                  </span>
                </div>
                {isShared && (
                  <div className="d-flex align-items-center gap-2 small text-success">
                    <CheckCircle2 size={15} className="flex-shrink-0" />
                    <span>Auto-approved instantly with no committee voting required.</span>
                  </div>
                )}
              </div>

              <hr className="border-light-subtle" />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>Maintenance Blackouts</h6>
                {isAdmin && (
                  <button className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1" style={{ borderRadius: '8px' }} onClick={() => setBlackoutOpen(true)}>
                    <Plus size={14} /> Add
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
                        <div className="fw-medium" style={{ color: '#1a1f36' }}>
                          {(() => {
                            const [y, m, d] = (b.date || '').split('-').map(Number);
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return y && m && d ? `${months[m - 1]} ${d}, ${y}` : b.date;
                          })()}
                        </div>
                        <div className="text-secondary">{b.startTime} – {b.endTime}</div>
                        <div className="text-muted">{b.reason}</div>
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0 ms-2"
                          onClick={() => blackoutOps.remove(b.id)}
                          title="Delete blackout"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Availability Schedule Timeline & Booking ── */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>
                  {isShared ? 'Facility Schedule & Live Crowd' : 'Availability Schedule'}
                </h6>
                <div style={{ width: '190px' }}>
                  <DatePicker
                    value={date}
                    required
                    align="right"
                    minDate={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => {
                      const val = typeof e === 'string' ? e : e?.target?.value;
                      if (val) setDate(val);
                    }}
                    style={{ height: '38px' }}
                  />
                </div>
              </div>

              <AvailabilityGrid
                availability={availability}
                loading={avLoading}
                onOpenBooking={(prefillSlot) => openBooking(prefillSlot?.start, prefillSlot?.end)}
              />

              <div className="mt-4 d-grid d-sm-flex justify-content-sm-end">
                <button
                  className="btn btn-dark fw-medium px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ borderRadius: '8px', fontSize: '0.9rem', backgroundColor: '#1a1f36' }}
                  onClick={() => openBooking()}
                >
                  <CalendarPlus size={16} />
                  {isShared ? 'Reserve Free Spot' : `Book This Amenity (₹${amenity.price})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <BookingFormModal
          amenityId={amenityId}
          amenityName={amenity.name}
          isShared={isShared}
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
        <BlackoutModal
          loading={blackoutOps.loading}
          onSubmit={handleBlackout}
          onCancel={() => setBlackoutOpen(false)}
        />
      )}
    </div>
  );
};

export default AmenityDetailPage;
