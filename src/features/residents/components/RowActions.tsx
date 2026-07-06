import { useEffect, useRef, useState } from "react";
import type { ResidentDetail } from "../../types/resident.types";

interface RowActionsProps {
  resident: ResidentDetail;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}

const RowActions = ({ resident, onView, onEdit, onDeactivate }: RowActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="position-relative d-inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="btn p-0 border-0 text-secondary bg-transparent d-flex align-items-center justify-content-center"
        style={{ width: "28px", height: "28px" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#212529")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
      >
        <i className="bi bi-three-dots-vertical fs-4" />
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu dropdown-menu-end shadow-sm border border-light-subtle rounded-3 p-1 show position-absolute"
          style={{ minWidth: "148px", zIndex: 1100, top: "100%", right: 0 }}
        >
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
              onClick={() => { onView(); setIsOpen(false); }}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-eye text-muted" /> View Details
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
              onClick={() => { onEdit(); setIsOpen(false); }}
              disabled={!resident.isActive}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-pencil text-muted" /> Edit
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small text-danger"
              onClick={() => { onDeactivate(); setIsOpen(false); }}
              disabled={!resident.isActive}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-person-x" /> Deactivate
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default RowActions;