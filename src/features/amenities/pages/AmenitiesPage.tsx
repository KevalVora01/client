import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useAmenities } from '../hooks/useAmenities';
import { useAmenityMutations } from '../hooks/useAmenityMutations';
import AmenityCard from '../components/AmenityCard';
import AmenityFormModal from '../components/AmenityFormModal';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { Amenity, CreateAmenityPayload, UpdateAmenityPayload } from '../types/amenity.types';

const AmenitiesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { amenities, loading, refetch } = useAmenities();
  const { create, update, deactivate, loading: mutationLoading } = useAmenityMutations(refetch);

  const [formOpen, setFormOpen] = useState(false);
  const [editAmenity, setEditAmenity] = useState<Amenity | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Amenity | null>(null);

  useScrollLock(formOpen || !!deactivateTarget);

  const openAdd = () => { setEditAmenity(null); setFormOpen(true); };
  const openEdit = (a: Amenity) => { setEditAmenity(a); setFormOpen(true); };
  const closeForm = () => setFormOpen(false);

  const handleSubmit = async (payload: CreateAmenityPayload | UpdateAmenityPayload): Promise<boolean> => {
    const success = editAmenity
      ? await update(editAmenity.id, payload as UpdateAmenityPayload)
      : await create(payload as CreateAmenityPayload);
    if (success) closeForm();
    return success;
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    const ok = await deactivate(deactivateTarget.id);
    if (ok) setDeactivateTarget(null);
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-2 fs-4" style={{ color: '#1a1f36' }}>Amenities</h4>
          <p className="text-muted mb-0 small">
            {isAdmin ? 'Manage society amenities, operating hours and blackouts.' : 'Browse and book available amenities.'}
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-dark fw-medium d-inline-flex align-items-center gap-2 px-3 py-2"
            onClick={openAdd}
            style={{ fontSize: '0.875rem', borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}
          >
            <i className="bi bi-plus-lg" /> Add Amenity
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : amenities.length === 0 ? (
        <div className="text-center text-muted py-5">No amenities found.</div>
      ) : (
        <div className="row g-3">
          {amenities.map((a) => (
            <div key={a.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <AmenityCard amenity={a} isAdmin={isAdmin} onEdit={openEdit} onDeactivate={setDeactivateTarget} />
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <AmenityFormModal amenity={editAmenity} loading={mutationLoading} onSubmit={handleSubmit} onCancel={closeForm} />
      )}

      <ConfirmDialog
        show={!!deactivateTarget}
        title="Deactivate Amenity"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? Residents will no longer be able to book it.`}
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
};

export default AmenitiesPage;
