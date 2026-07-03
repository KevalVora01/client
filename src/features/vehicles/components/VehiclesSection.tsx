import { useState } from "react";
import { useVehicles } from "../hooks/useVehicles";
import { useVehicleMutations } from "../hooks/useVehicleMutations";
import VehicleCard from "./VehicleCard";
import VehicleForm from "./VehicleForm";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from "../types/vehicle.types";

interface VehiclesSectionProps {
  residentId: number;
  readOnly?: boolean;
}

const VehiclesSection = ({ residentId, readOnly = false }: VehiclesSectionProps) => {
  const { vehicles, setVehicles, loading } = useVehicles(residentId);
  const { createVehicle, createLoading, updateVehicle, updateLoading, deleteVehicle, deleteLoading } =
    useVehicleMutations(residentId, setVehicles);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  const handleAdd = async (payload: CreateVehiclePayload): Promise<boolean> => {
    const success = await createVehicle(payload);
    if (success) setShowForm(false);
    return success;
  };

  const handleEdit = async (payload: UpdateVehiclePayload): Promise<boolean> => {
    if (!editingVehicle) return false;
    const success = await updateVehicle(editingVehicle.id, payload);
    if (success) setEditingVehicle(null);
    return success;
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingVehicle) return;
    await deleteVehicle(deletingVehicle.id);
    setDeletingVehicle(null);
  };

  return (
    <>
      <div className="card bg-white border border-light-subtle rounded-3 shadow-sm">
        <div className="card-header bg-white border-bottom border-light-subtle px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0" style={{ color: '#1a1f36' }}>
            <i className="bi bi-car-front me-2" />Vehicles
          </h6>
          {!readOnly && !showForm && !editingVehicle && (
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowForm(true)}
              style={{ fontSize: "0.875rem", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
            >
              <i className="bi bi-plus-lg" /> Add Vehicle
            </button>
          )}
        </div>

        <div className="card-body px-4 py-3">

          {/* ── Add Form ── */}
          {!readOnly && showForm && (
            <div className="mb-3 p-3 rounded-3 border border-light-subtle" style={{ background: '#f8f9fa' }}>
              <p className="fw-semibold mb-3 text-dark" style={{ fontSize: '0.875rem' }}>Add Vehicle</p>
              <VehicleForm
                loading={createLoading}
                onSubmit={(payload) => handleAdd(payload as CreateVehiclePayload)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* ── Edit Form ── */}
          {!readOnly && editingVehicle && (
            <div className="mb-3 p-3 rounded-3 border border-light-subtle" style={{ background: '#f8f9fa' }}>
              <p className="fw-semibold mb-3 text-dark" style={{ fontSize: '0.875rem' }}>Edit Vehicle</p>
              <VehicleForm
                vehicle={editingVehicle}
                loading={updateLoading}
                onSubmit={(payload) => handleEdit(payload as UpdateVehiclePayload)}
                onCancel={() => setEditingVehicle(null)}
              />
            </div>
          )}

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
                  onEdit={(v) => { setEditingVehicle(v); setShowForm(false); }}
                  onDelete={(v) => setDeletingVehicle(v)}
                  readOnly={readOnly}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        show={!!deletingVehicle}
        title="Remove Vehicle"
        message={deletingVehicle ? `Are you sure you want to remove ${deletingVehicle.brandName} ${deletingVehicle.model} (${deletingVehicle.plateNumber})?` : ""}
        confirmLabel="Yes, Remove"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </>
  );
};

export default VehiclesSection;