import { useState } from "react";
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload, ApartmentType } from "../types/apartment.types";

interface UseApartmentFormProps {
  mode: "add" | "edit";
  apartment?: Apartment | null;
  onSubmit: (payload: CreateApartmentPayload | UpdateApartmentPayload, id?: number) => Promise<boolean>;
  onClose: () => void;
}

const initialAddForm: CreateApartmentPayload = {
  block: "",
  floorNumber: 0,
  unitNumber: "",
  areaSqft: 0,
  type: "" as ApartmentType,
};

const getInitialEditForm = (apartment: Apartment | null | undefined): UpdateApartmentPayload => ({
  block: apartment?.block ?? "",
  floorNumber: apartment?.floorNumber ?? 0,
  flateNumber: apartment?.flateNumber ?? "",
  areaSqft: apartment?.areaSqft ?? 0,
  type: apartment?.type ?? "" as ApartmentType,
});

export const useApartmentForm = ({
  mode,
  apartment,
  onSubmit,
  onClose,
}: UseApartmentFormProps) => {
  const isEdit = mode === "edit";

  const [addForm, setAddForm] = useState<CreateApartmentPayload>(initialAddForm);
  const [editForm, setEditForm] = useState<UpdateApartmentPayload>(() => getInitialEditForm(apartment));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const form = isEdit ? editForm : addForm;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsed = name === "floorNumber" || name === "areaSqft" ? Number(value) : value;

    if (isEdit) {
      setEditForm((prev) => ({ ...prev, [name]: parsed }));
    } else {
      setAddForm((prev) => ({ ...prev, [name]: parsed }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAdd = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addForm.block.trim()) errors.block = "Block is required";
    if (!addForm.floorNumber) errors.floorNumber = "Floor number is required";
    if (!addForm.unitNumber.trim()) errors.unitNumber = "Unit number is required";
    if (!addForm.areaSqft) errors.areaSqft = "Area is required";
    if (!addForm.type) errors.type = "Type is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEdit = (): boolean => {
    const errors: Record<string, string> = {};
    if (editForm.floorNumber !== undefined && editForm.floorNumber < 0) {
      errors.floorNumber = "Floor number must be at least 0";
    }
    if (editForm.areaSqft !== undefined && editForm.areaSqft <= 0) {
      errors.areaSqft = "Area must be a positive number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      if (!apartment || !validateEdit()) return;
      const success = await onSubmit(editForm, apartment.id);
      if (success) onClose();
    } else {
      if (!validateAdd()) return;
      const success = await onSubmit(addForm);
      if (success) { setAddForm(initialAddForm); setFormErrors({}); onClose(); }
    }
  };

  const handleClose = () => {
    setAddForm(initialAddForm);
    setFormErrors({});
    onClose();
  };

  return {
    isEdit,
    form,
    addForm,
    editForm,
    formErrors,
    handleChange,
    handleSubmit,
    handleClose,
  };
};