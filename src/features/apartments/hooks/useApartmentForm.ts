import { useFormik } from "formik";
import * as Yup from "yup";
import type { Apartment, CreateApartmentPayload, UpdateApartmentPayload, ApartmentType } from "../types/apartment.types";
import { ApartmentType as ApartmentTypeEnum } from "../types/apartment.types";

interface UseApartmentFormProps {
  mode: "add" | "edit";
  apartment?: Apartment | null;
  onSubmit: (payload: CreateApartmentPayload | UpdateApartmentPayload, id?: number) => Promise<boolean>;
  onClose: () => void;
}

// ── Validation schemas ─────────────────────────────────────────────

const addSchema = Yup.object({
  block: Yup.string()
    .trim()
    .length(1, "Block must be a single character")
    .matches(/^[A-Z]$/, "Block must be a letter")
    .required("Block is required"),
  floorNumber: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? undefined : value)
    .min(1, "Floor number must be at least 1")
    .required("Floor number is required")
    .typeError("Floor number is required"),
  unitNumber: Yup.string().trim().required("Unit number is required"),
  areaSqft: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? undefined : value)
    .positive("Area must be a positive number")
    .required("Area is required")
    .typeError("Area is required"),
  type: Yup.string()
    .oneOf(Object.values(ApartmentTypeEnum), "Please select a valid type")
    .required("Type is required"),
});

const editSchema = Yup.object({
  block: Yup.string().trim().optional(),
  floorNumber: Yup.number().min(0, "Floor number must be at least 0").optional(),
  flateNumber: Yup.string().trim().optional(),
  areaSqft: Yup.number().positive("Area must be a positive number").optional(),
  type: Yup.string()
    .oneOf(Object.values(ApartmentTypeEnum), "Please select a valid type")
    .optional(),
});

// ── Hook ──────────────────────────────────────────────────────────

export const useApartmentForm = ({
  mode,
  apartment,
  onSubmit,
  onClose,
}: UseApartmentFormProps) => {
  const isEdit = mode === "edit";

  const formik = useFormik({
    initialValues: isEdit
      ? {
        block: apartment?.block ?? "",
        floorNumber: apartment?.floorNumber ?? "",
        flateNumber: apartment?.flateNumber ?? "",
        areaSqft: apartment?.areaSqft ?? 0,
        type: apartment?.type ?? ("" as ApartmentType),
      }
      : {
        block: "",
        floorNumber: "",
        unitNumber: "",
        areaSqft: 0,
        type: "" as ApartmentType,
      },

    validationSchema: isEdit ? editSchema : addSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, { resetForm }) => {
      if (isEdit) {
        const success = await onSubmit(values as UpdateApartmentPayload, apartment?.id);
        if (success) onClose();
      } else {
        const success = await onSubmit(values as CreateApartmentPayload);
        if (success) { resetForm(); onClose(); }
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return {
    isEdit,
    formik,
    handleClose,
  };
};