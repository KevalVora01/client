import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../../components/Select/Select";
import type { FamilyMember, CreateFamilyMemberPayload, UpdateFamilyMemberPayload, FamilyRelation } from "../types/familyMember.types";

const RELATIONS: FamilyRelation[] = ["Spouse", "Child", "Parent", "Sibling", "Other"];

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Min 2 characters").required("Name is required"),
  relation: Yup.string().oneOf(RELATIONS, "Invalid relation").required("Relation is required"),
  age: Yup.number().integer().min(0).max(120).nullable().optional(),
});

interface FamilyMemberFormProps {
  member?: FamilyMember | null;
  loading: boolean;
  onSubmit: (payload: CreateFamilyMemberPayload | UpdateFamilyMemberPayload) => Promise<boolean>;
  onCancel: () => void;
}

const FamilyMemberForm = ({ member, loading, onSubmit, onCancel }: FamilyMemberFormProps) => {
  const isEdit = !!member;

  const formik = useFormik({
    initialValues: {
      name: member?.name ?? "",
      relation: member?.relation ?? "" as FamilyRelation,
      age: member?.age ?? "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        name: values.name,
        relation: values.relation as FamilyRelation,
        age: values.age !== "" && values.age != null ? Number(values.age) : null,
      };
      const success = await onSubmit(payload);
      if (success) resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-3">

        {/* Name */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium text-secondary small mb-1">
            Full name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="name"
            className={`form-control shadow-none ${formik.touched.name && formik.errors.name ? "is-invalid" : "border-light-subtle"}`}
            placeholder="Enter full name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>

        {/* Relation */}
        <div className="col-12 col-md-4">
          <Select
            label="Relation"
            name="relation"
            required
            options={RELATIONS}
            placeholder="Select relation"
            value={formik.values.relation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.relation}
            touched={formik.touched.relation}
            className="shadow-none"
          />
        </div>

        {/* Age */}
        <div className="col-12 col-md-2">
          <label className="form-label fw-medium text-secondary small mb-1">Age</label>
          <input
            type="number"
            name="age"
            className="form-control border-light-subtle shadow-none"
            placeholder="Age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min={0}
            max={120}
            style={{ fontSize: "0.875rem", height: "40px" }}
          />
        </div>

        {/* Actions */}
        <div className="col-12">
          <div className="d-flex gap-2 justify-content-end">
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
              className="btn btn-dark d-flex align-items-center justify-content-center gap-1"
              disabled={loading}
              style={{ fontSize: "0.875rem", height: "40px", borderRadius: "8px", backgroundColor: "#1a1f36", borderColor: "#1a1f36" }}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm" />
                : <><i className={`bi ${isEdit ? "bi-check-lg" : "bi-plus-lg"}`} /> {isEdit ? "Save" : "Add"}</>
              }
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};

export default FamilyMemberForm;