import { useState } from "react";
import { useResidents } from "./useResidents";
import { useResidentMutations } from "./useResidentMutations";
import type {
  ResidentDetail,
  CreateResidentPayload,
  UpdateResidentPayload,
} from "../types/resident.types";

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
    createResident, createLoading, createError,
    updateResident, updateLoading, updateError,
    deactivateResident, deactivateLoading, deactivateError,
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

  const handleCreate = async (payload: CreateResidentPayload): Promise<boolean> =>
    await createResident(payload);

  const handleUpdate = async (id: number, payload: UpdateResidentPayload): Promise<boolean> =>
    await updateResident(id, payload);

  const handleDeactivateConfirm = async (id: number): Promise<boolean> =>
    await deactivateResident(id);

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
    createLoading, createError,
    updateLoading, updateError,
    deactivateLoading, deactivateError,

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