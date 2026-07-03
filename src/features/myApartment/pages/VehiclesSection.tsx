import { useState } from "react";
import { useVehicles } from "../hooks/useVehicles";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from "../types/vehicle.types";
import VehicleCard from "../components/VehicleCard";
import VehicleFormModal from "../components/VehicleFormModal";

interface VehiclesSectionProps {
  residentId: number;
  readOnly?: boolean;
}

const VehiclesSection = ({ residentId, readOnly = false }: VehiclesSectionProps) => {
  const { vehicles, loading, addVehicle, editVehicle, removeVehicle } = useVehicles(residentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const handleAdd = async (payload: CreateVehiclePayload): Promise<boolean> => {
    setMutationLoading(true);
    const success = await addVehicle(payload);
    setMutationLoading(false);
    if (success) { setModalOpen(false); setEditingVehicle(null); }
    return success;
  };

  const handleEdit = async (payload: UpdateVehiclePayload): Promise<boolean> => {
    if (!editingVehicle) return false;
    setMutationLoading(true);
    const success = await editVehicle(editingVehicle.id, payload);
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

  return (
    <>
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm mt-3">
        <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>
            <i className="bi bi-car-front me-2" />Vehicles
          </h6>
          {!readOnly && (
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-1"
              onClick={openAddModal}
              style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
            >
              <i className="bi bi-plus-lg" /> Add Vehicle
            </button>
          )}
        </div>

        <div className="card-body px-4 py-3">

          {/* ── List ── */}
          {loading ? (
            <div className="d-flex flex-column gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-car-front d-block mb-2" style={{ fontSize: '2rem', color: '#d1d5db' }} />
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No vehicles added yet</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={openEditModal}
                  onDelete={(v) => setDeletingVehicle(v)}
                  readOnly={readOnly}
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
