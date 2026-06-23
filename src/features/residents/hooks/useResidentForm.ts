import { useState, useEffect } from "react";
import type { ResidentDetail, CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import { useScrollLock } from "../../../hooks/useScrollLock";

type Mode = "add" | "edit";

interface UseResidentFormProps {
  show: boolean;
  mode: Mode;
  resident?: ResidentDetail | null;
  onSubmit: (payload: CreateResidentPayload | UpdateResidentPayload, id?: number) => Promise<boolean>;
  onClose: () => void;
}

// ── Initial values ────────────────────────────────────────────
const initialAdd: CreateResidentPayload = {
  name: "", email: "", phone: "", password: "",
  apartmentId: 0, isOwner: false, moveInDate: "",
};

const toEditForm = (r: ResidentDetail): UpdateResidentPayload => ({
  name: r.user.name,
  phone: r.user.phone,
  apartmentId: r.apartmentId ?? undefined,
  isOwner: r.isOwner,
  moveOutDate: r.moveOutDate ?? undefined,
});

// ── Hook ─────────────────────────────────────────────────────
export const useResidentForm = ({ show, mode, resident, onSubmit, onClose }: UseResidentFormProps) => {
  const isEdit = mode === "edit";

  const [addForm, setAddForm] = useState<CreateResidentPayload>(initialAdd);
  const [editForm, setEditForm] = useState<UpdateResidentPayload>(
    resident ? toEditForm(resident) : {}
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetAdd = () => {
    setAddForm(initialAdd);
    setFormErrors({});
  };

  // Body scroll lock
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  // ── Change handlers ───────────────────────────────────────
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "apartmentId" ? Number(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "apartmentId" ? Number(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setAddField = (name: keyof CreateResidentPayload, value: unknown) => {
    setAddForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setEditField = (name: keyof UpdateResidentPayload, value: unknown) => {
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ────────────────────────────────────────────
  const validateAdd = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addForm.name.trim()) errors.name = "Name is required";
    if (!addForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(addForm.email)) errors.email = "Invalid email";
    if (!addForm.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(addForm.phone)) errors.phone = "Phone must be 10 digits";
    if (!addForm.password) errors.password = "Password is required";
    else if (addForm.password.length < 8) errors.password = "Minimum 8 characters";
    if (!addForm.moveInDate) errors.moveInDate = "Move-in date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEdit = (): boolean => {
    const errors: Record<string, string> = {};
    if (editForm.name !== undefined && !editForm.name.trim()) errors.name = "Name cannot be empty";
    if (editForm.phone !== undefined && !/^\d{10}$/.test(editForm.phone)) errors.phone = "Phone must be 10 digits";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit & close ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      if (!resident || !validateEdit()) return;
      const success = await onSubmit(editForm, resident.id);
      if (success) onClose();
    } else {
      if (!validateAdd()) return;
      const success = await onSubmit(addForm);
      if (success) { resetAdd(); onClose(); }
    }
  };

  const handleClose = () => {
    if (!isEdit) resetAdd();
    onClose();
  };

  useScrollLock(show);

  return {
    isEdit,
    form: isEdit ? editForm : addForm,
    formErrors,
    handleChange: isEdit ? handleEditChange : handleAddChange,
    setAddField,
    setEditField,
    handleSubmit,
    handleClose,
  };
};