import type { ResidentDetail } from "../../types/resident.types";

interface RowActionsProps {
  resident: ResidentDetail;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}

const RowActions = ({ resident, onView, onEdit, onDeactivate }: RowActionsProps) => {
  return (
    // position-relative keeps the dropdown aligned with the button context
    <div className="dropdown position-relative">
      <button
        className="btn btn-link link-secondary p-0 border-0 d-flex align-items-center justify-content-center m-auto shadow-none"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ width: "32px", height: "32px" }}
      >
        <i className="bi bi-three-dots-vertical fs-5" style={{ color: "#4b5563" }} />
      </button>

      {/* Popover card container matching your mockup design exactly */}
      <ul
        className="dropdown-menu dropdown-menu-end shadow border-0 p-2 m-0"
        style={{
          borderRadius: "12px",
          minWidth: "155px",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 fw-medium text-dark bg-transparent border-0"
            style={{ fontSize: "0.875rem" }}
            onClick={onView}
          >
            <i className="bi bi-eye text-muted fs-6" style={{ color: "#6b7280" }} /> View Details
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 fw-medium text-dark bg-transparent border-0"
            style={{ fontSize: "0.875rem" }}
            onClick={onEdit}
            disabled={!resident.isActive}
          >
            <i className="bi bi-pencil text-muted fs-6" style={{ color: "#6b7280" }} /> Edit Unit
          </button>
        </li>
        <li>
          <hr className="dropdown-divider my-1 border-light-subtle" />
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 fw-medium text-danger bg-transparent border-0"
            style={{ fontSize: "0.875rem" }}
            onClick={onDeactivate}
            disabled={!resident.isActive}
          >
            <i className="bi bi-person-x fs-6" /> Deactivate
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RowActions;