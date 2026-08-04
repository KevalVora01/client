import { useState } from "react";
import { CarFront } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import useMyResident from "../../residents/hooks/useMyResident";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from "../types/vehicle.types";
import VehicleCard from "../components/VehicleCard";
import VehicleFormModal from "../components/VehicleFormModal";

interface VehiclesSectionProps {
  residentId: number;
  readOnly?: boolean;
  tenantResidentId?: number | null;
  onTenantChange?: (tenantId: number | null) => void;
}

const VehiclesSection = ({ residentId, readOnly = false, tenantResidentId = null, onTenantChange }: VehiclesSectionProps) => {
  const { isOwner, isCurrentOccupant } = useMyResident(!readOnly);
  const [viewingTenantId, setViewingTenantId] = useState<number | null>(tenantResidentId);
  const targetResidentId = viewingTenantId ?? residentId;
  const isViewingOwn = viewingTenantId === null;

  const { vehicles, loading, addVehicle, editVehicle, removeVehicle } = useVehicles(targetResidentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const handleAdd = async (payload: CreateVehiclePayload | UpdateVehiclePayload): Promise<boolean> => {
    setMutationLoading(true);
    const success = await addVehicle(payload as CreateVehiclePayload);
    setMutationLoading(false);
    if (success) { setModalOpen(false); setEditingVehicle(null); }
    return success;
  };

  const handleEdit = async (payload: CreateVehiclePayload | UpdateVehiclePayload): Promise<boolean> => {
    if (!editingVehicle) return false;
    setMutationLoading(true);
    const success = await editVehicle(editingVehicle.id, payload as UpdateVehiclePayload);
    setMutationLoading(false);
    if (success) { setModalOpen(false); setEditingVehicle(null); }
    return success;
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingVehicle) return;
    setMutationLoading(true);
    await removeVehicle(deletingVehicle.id);
    setMutationLoading(false);
    setDeletingVehicle(null);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVehicle(null);
  };

  const handleTenantChange = (tenantId: number | null) => {
    setViewingTenantId(tenantId);
    onTenantChange?.(tenantId);
  };

  const showTenantSelector = isOwner && !readOnly && tenantResidentId;

  return (
    <>
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-3">
        <div className="card-header bg-white border-bottom border-light-subtle px-3 px-sm-4 py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3">
            <h6 className="fw-bold mb-0 text-nowrap d-flex align-items-center gap-2" style={{ color: '#1a1f36' }}>
              <CarFront size={18} className="text-dark" /> Vehicles
            </h6>
            {showTenantSelector && (
              <select
                className="form-select form-select-sm"
                style={{ minWidth: '160px', fontSize: '0.85rem' }}
                value={viewingTenantId ?? ''}
                onChange={(e) => handleTenantChange(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Your Vehicles</option>
                {tenantResidentId && (
                  <option value={tenantResidentId}>Tenant's Vehicles</option>
                )}
              </select>
            )}
          </div>
          {!readOnly && isViewingOwn && isCurrentOccupant && (
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-1"
              onClick={openAddModal}
              style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
            >
              <i className="bi bi-car-front" /> Add Vehicle
            </button>
          )}
        </div>

        <div className="card-body px-3 px-sm-4 py-3">

          {/* ── List ── */}
          {loading ? (
            <div className="d-flex flex-column gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '64px', height: '64px', backgroundColor: '#f3f4f6' }}
              >
                <CarFront size={28} style={{ color: '#9ca3af' }} />
              </div>
              <p className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#4b5563' }}>No vehicles found</p>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.8rem' }}>
                {isViewingOwn ? 'No vehicles added yet' : "Tenant has no vehicles added"}
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={openEditModal}
                  onDelete={(v) => setDeletingVehicle(v)}
                  readOnly={readOnly || !isViewingOwn}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <VehicleFormModal
        show={modalOpen}
        mode={editingVehicle ? "edit" : "add"}
        vehicle={editingVehicle}
        loading={mutationLoading}
        onClose={closeModal}
        onSubmit={editingVehicle ? handleEdit : handleAdd}
      />

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        show={!!deletingVehicle}
        title="Remove Vehicle"
        message={deletingVehicle ? `Are you sure you want to remove ${deletingVehicle.brandName} ${deletingVehicle.model} (${deletingVehicle.plateNumber})?` : ""}
        confirmLabel="Yes, Remove"
        variant="danger"
        loading={mutationLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </>
  );
};

export default VehiclesSection;