import { useFormik } from "formik";
import * as Yup from "yup";
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

// ── Yup Schemas ───────────────────────────────────────────────
const addSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").required("Name is required"),
  email: Yup.string().trim().email("Please provide a valid email").required("Email is required"),
  phone: Yup.string().trim().length(10, "Phone must be exactly 10 digits").matches(/^\d+$/, "Phone must contain only numbers").required("Phone is required"),
  apartmentId: Yup.number().typeError("Apartment ID must be a number").min(1, "Please select an apartment").required("Apartment ID is required"),
});

const editSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").required("Name is required"),
  phone: Yup.string().trim().length(10, "Phone must be exactly 10 digits").matches(/^\d+$/, "Phone must contain only numbers").required("Phone is required"),
  apartmentId: Yup.number().typeError("Apartment ID must be a number").min(1, "Please select an apartment").required("Apartment ID is required"),
  isOwner: Yup.boolean().optional(),
  moveOutDate: Yup.date().typeError("Move out date must be a valid date").max(new Date(), "Move out date cannot be in the future").optional().nullable(),
});

// ── Hook ─────────────────────────────────────────────────────
export const useResidentForm = ({ show, mode, resident, onSubmit, onClose }: UseResidentFormProps) => {
  const isEdit = mode === "edit";

  useScrollLock(show);

  const formik = useFormik({
    initialValues: isEdit
      ? {
        name: resident?.user.name ?? "",
        phone: resident?.user.phone ?? "",
        apartmentId: resident?.apartment?.id ?? 0,
        isOwner: resident?.isOwner ?? false,
        moveOutDate: resident?.moveOutDate ?? "",
      }
      : {
        name: "",
        email: "",
        phone: "",
        apartmentId: 0,
      },
    validationSchema: isEdit ? editSchema : addSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (isEdit) {
        if (!resident) return;
        const success = await onSubmit(values as UpdateResidentPayload, resident.id);
        if (success) onClose();
      } else {
        const success = await onSubmit(values as CreateResidentPayload);
        if (success) { resetForm(); onClose(); }
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // ── ApartmentSelect helper ────────────────────────────────
  const setApartmentId = (val: number) => {
    formik.setFieldValue("apartmentId", val);
  };

  return {
    isEdit,
    formik,
    handleClose,
    setApartmentId,
  };
};