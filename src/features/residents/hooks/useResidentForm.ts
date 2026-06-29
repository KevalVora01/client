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
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  moveInDate: Yup.string().required("Move-in date is required"),
  apartmentId: Yup.number().min(1, "Please select an apartment").required("Please select an apartment"),
  isOwner: Yup.boolean(),
});

const editSchema = Yup.object({
  name: Yup.string().trim().required("Name cannot be empty"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
  apartmentId: Yup.number().optional(),
  isOwner: Yup.boolean().optional(),
  moveOutDate: Yup.string().optional(),
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
        apartmentId: resident?.apartmentId ?? 0,
        isOwner: resident?.isOwner ?? false,
        moveOutDate: resident?.moveOutDate ?? "",
      }
      : {
        name: "",
        email: "",
        phone: "",
        password: "",
        apartmentId: 0,
        isOwner: false,
        moveInDate: "",
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