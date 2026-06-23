import { useState } from "react";
import { useResidents } from "./useResidents";
import { useResidentMutations } from "./useResidentMutations";
import type {
  ResidentDetail,
  CreateResidentPayload,
  UpdateResidentPayload,
} from "../types/resident.types";
import { showSuccess } from "../../../utils/toast";

export const useResidentsPage = () => {
  // ── Data ──────────────────────────────────────────────────
  const {
    residents,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    changePage,
    refetch,
  } = useResidents();

  const {
    createResident, createLoading, updateResident, updateLoading,
    deactivateResident, deactivateLoading,
  } = useResidentMutations(refetch);

  // ── Modal state ───────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<ResidentDetail | null>(null);

  // ── Handlers ──────────────────────────────────────────────
  const handleView = (resident: ResidentDetail) => {
    console.log("View resident", resident.id);
  };

  const handleEdit = (resident: ResidentDetail) => {
    setSelectedResident(resident);
    setShowEditModal(true);
  };

  const handleDeactivate = (resident: ResidentDetail) => {
    setSelectedResident(resident);
    setShowDeactivateModal(true);
  };

  const handleCreate = async (payload: CreateResidentPayload): Promise<boolean> => {
    const success = await createResident(payload);
    if (success) showSuccess("Resident created successfully");
    return success;
  };

  const handleUpdate = async (id: number, payload: UpdateResidentPayload): Promise<boolean> => {
    const success = await updateResident(id, payload);
    if (success) showSuccess("Resident updated successfully");
    return success;
  };

  const handleDeactivateConfirm = async (id: number): Promise<boolean> => {
    const success = await deactivateResident(id);
    if (success) showSuccess("Resident deactivated successfully");
    return success;
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedResident(null);
  };

  const handleCloseDeactivate = () => {
    setShowDeactivateModal(false);
    setSelectedResident(null);
  };

  return {
    // data
    residents,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    changePage,
    refetch,

    // modal visibility
    showAddModal,
    showEditModal,
    showDeactivateModal,
    setShowAddModal,

    // selected
    selectedResident,

    // mutation state
    createLoading,
    updateLoading,
    deactivateLoading,

    // handlers
    handleView,
    handleEdit,
    handleDeactivate,
    handleCreate,
    handleUpdate,
    handleDeactivateConfirm,
    handleCloseEdit,
    handleCloseDeactivate,
  };
};