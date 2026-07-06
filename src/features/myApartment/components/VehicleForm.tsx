import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../../components/Select/Select";
import type { CreateVehiclePayload, FuelType, UpdateVehiclePayload, Vehicle, VehicleType } from "../types/vehicle.types";

const VEHICLE_TYPES: VehicleType[] = ["Car", "Bike", "Scooter", "Other"];
const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const schema = Yup.object({
  plateNumber: Yup.string().trim().required("Plate number is required"),
  type: Yup.string().oneOf(VEHICLE_TYPES, "Invalid type").required("Type is required"),
  brandName: Yup.string().trim().required("Brand name is required"),
  model: Yup.string().trim().required("Model is required"),
  color: Yup.string().trim().required("Color is required"),
  fuelType: Yup.string().oneOf(FUEL_TYPES, "Invalid fuel type").required("Fuel type is required"),
});

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  loading: boolean;
  onSubmit: (payload: CreateVehiclePayload | UpdateVehiclePayload) => Promise<boolean>;
  onCancel: () => void;
}

const VehicleForm = ({ vehicle, loading, onSubmit, onCancel }: VehicleFormProps) => {
  const isEdit = !!vehicle;

  const formik = useFormik({
    initialValues: {
      plateNumber: vehicle?.plateNumber ?? "",
      type: vehicle?.type ?? "" as VehicleType,
      brandName: vehicle?.brandName ?? "",
      model: vehicle?.model ?? "",
      color: vehicle?.color ?? "",
      fuelType: vehicle?.fuelType ?? "" as FuelType,
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const success = await onSubmit(values);
      if (success) resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-3">

        {/* Plate Number */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium text-secondary small mb-1">
            Plate Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="plateNumber"
            className={`form-control border-light-subtle shadow-none ${formik.touched.plateNumber && formik.errors.plateNumber ? "is-invalid" : ""}`}
            placeholder="e.g. GJ 01 AB 1234"
            value={formik.values.plateNumber}
            onChange={(e) => formik.setFieldValue("plateNumber", e.target.value.toUpperCase())}
            onBlur={formik.handleBlur}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
          {formik.touched.plateNumber && formik.errors.plateNumber && (
            <div className="invalid-feedback">{formik.errors.plateNumber}</div>
          )}
        </div>

        {/* Type */}
        <div className="col-12 col-md-4">
          <Select
            label="Type"
            name="type"
            required
            options={VEHICLE_TYPES}
            placeholder="Select type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.type}
            touched={formik.touched.type}
            className="shadow-none"
          />
        </div>

        {/* Fuel Type */}
        <div className="col-12 col-md-4">
          <Select
            label="Fuel Type"
            name="fuelType"
            required
            options={FUEL_TYPES}
            placeholder="Select fuel type"
            value={formik.values.fuelType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.fuelType}
            touched={formik.touched.fuelType}
            className="shadow-none"
          />
        </div>

        {/* Brand Name */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium text-secondary small mb-1">
            Brand Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="brandName"
            className={`form-control border-light-subtle shadow-none ${formik.touched.brandName && formik.errors.brandName ? "is-invalid" : ""}`}
            placeholder="e.g. Maruti, Honda"
            value={formik.values.brandName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
          {formik.touched.brandName && formik.errors.brandName && (
            <div className="invalid-feedback">{formik.errors.brandName}</div>
          )}
        </div>

        {/* Model */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium text-secondary small mb-1">
            Model <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="model"
            className={`form-control border-light-subtle shadow-none ${formik.touched.model && formik.errors.model ? "is-invalid" : ""}`}
            placeholder="e.g. Swift, Activa"
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
          {formik.touched.model && formik.errors.model && (
            <div className="invalid-feedback">{formik.errors.model}</div>
          )}
        </div>

        {/* Color */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium text-secondary small mb-1">
            Color <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="color"
            className={`form-control border-light-subtle shadow-none ${formik.touched.color && formik.errors.color ? "is-invalid" : ""}`}
            placeholder="e.g. White, Black"
            value={formik.values.color}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
          {formik.touched.color && formik.errors.color && (
            <div className="invalid-feedback">{formik.errors.color}</div>
          )}
        </div>

        {/* Actions */}
        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={loading}
            style={{ fontSize: "0.875rem", height: "40px", borderRadius: "8px" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-dark d-flex align-items-center gap-1"
            disabled={loading}
            style={{ fontSize: "0.875rem", height: "40px", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm" />
              : <><i className={`bi ${isEdit ? "bi-check-lg" : "bi-plus-lg"}`} /> {isEdit ? "Save" : "Add Vehicle"}</>
            }
          </button>
        </div>

      </div>
    </form>
  );
};

export default VehicleForm;