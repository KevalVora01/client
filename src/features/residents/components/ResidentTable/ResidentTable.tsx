import { useState, useRef, useEffect } from "react";
import type { ResidentDetail } from "../../types/resident.types";
import './ResidentTable.css'

interface ResidentTableProps {
  residents: ResidentDetail[];
  loading: boolean;
  onView: (resident: ResidentDetail) => void;
  onEdit: (resident: ResidentDetail) => void;
  onDeactivate: (resident: ResidentDetail) => void;
}

const AVATAR_COLORS = [
  { bg: "#e8eaf6", color: "#3949ab" },
  { bg: "#e3f2fd", color: "#1565c0" },
  { bg: "#fce4ec", color: "#c62828" },
  { bg: "#e8f5e9", color: "#2e7d32" },
  { bg: "#fff3e0", color: "#e65100" },
  { bg: "#f3e5f5", color: "#6a1b9a" },
  { bg: "#e0f2f1", color: "#00695c" },
];

const getAvatarColor = (name: string) => {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Skeleton row ────────────────────────────────────────────
const SkeletonRow = () => (
  <tr>
    {[220, 140, 80, 100, 80, 60].map((w, i) => (
      <td key={i}>
        <div className="rt-skeleton" style={{ width: w, height: 13 }} />
      </td>
    ))}
  </tr>
);

// ── Row actions dropdown ────────────────────────────────────
const RowActions = ({ resident, onView, onEdit, onDeactivate }: {
  resident: ResidentDetail;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const calculatePos = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: rect.right - 148,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (open) calculatePos(); // recalculate on scroll
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  const handleOpen = () => {
    calculatePos();
    setOpen((p) => !p);
  };

  return (
    <div className="rt-actions" ref={ref}>
      <button
        ref={triggerRef}
        className="rt-actions__trigger"
        onClick={handleOpen}
        aria-label="Row actions"
      >
        <i className="bi bi-three-dots-vertical" />
      </button>

      {open && (
        <div
          className="rt-actions__menu"
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 1050,
          }}
        >
          <button className="rt-actions__item" onClick={() => { onView(); setOpen(false); }}>
            <i className="bi bi-eye" /> View details
          </button>
          <button className="rt-actions__item" onClick={() => { onEdit(); setOpen(false); }} disabled={!resident.isActive}>
            <i className="bi bi-pencil" /> Edit
          </button>
          <button className="rt-actions__item rt-actions__item--danger" onClick={() => { onDeactivate(); setOpen(false); }} disabled={!resident.isActive}>
            <i className="bi bi-person-x" /> Deactivate
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────
const ResidentTable = ({
  residents,
  loading,
  onView,
  onEdit,
  onDeactivate,
}: ResidentTableProps) => {

  const thead = (
    <thead>
      <tr>
        <th>Resident Name</th>
        <th>Apartment</th>
        <th>Type</th>
        <th>Move-in Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  if (loading) {
    return (
      <div className="rt-table-wrapper">
        <table className="rt-table">
          {thead}
          <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
        </table>
      </div>
    );
  }

  if (residents.length === 0) {
    return (
      <div className="rt-empty">
        <i className="bi bi-people rt-empty__icon" aria-hidden="true" />
        <p className="rt-empty__title">No residents found</p>
        <p className="rt-empty__sub">Try adjusting your filters or add a new resident.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="rt-table">
        {thead}
        <tbody>
          {residents.map((resident) => {
            const { bg, color } = getAvatarColor(resident.user.name);
            return (
              <tr key={resident.id}>

                {/* Name + email */}
                <td>
                  <div className="rt-resident">
                    <div className="rt-avatar" style={{ background: bg, color }}>
                      {getInitials(resident.user.name)}
                    </div>
                    <div>
                      <p className="rt-name">{resident.user.name}</p>
                      <p className="rt-email">{resident.user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Apartment */}
                <td>
                  {resident.apartment ? (
                    <>
                      <p className="rt-unit">Unit {resident.apartment.flateNumber}</p>
                      <p className="rt-floor">Floor {resident.apartment.block}</p>
                    </>
                  ) : (
                    <span className="rt-muted">—</span>
                  )}
                </td>

                {/* Type */}
                <td>
                  <span className={`rt-badge rt-badge--${resident.isOwner ? "owner" : "tenant"}`}>
                    {resident.isOwner ? "Owner" : "Tenant"}
                  </span>
                </td>

                {/* Move-in date */}
                <td className="rt-muted">{formatDate(resident.moveInDate)}</td>

                {/* Status */}
                <td>
                  <span className={`rt-badge rt-badge--${resident.isActive ? "active" : "inactive"}`}>
                    {resident.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <RowActions
                    resident={resident}
                    onView={() => onView(resident)}
                    onEdit={() => onEdit(resident)}
                    onDeactivate={() => onDeactivate(resident)}
                  />
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResidentTable;