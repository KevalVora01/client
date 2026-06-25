import { useState, useRef, useEffect } from "react";
import AppTable from "../../../../components/AppTable/AppTable";
import type { TableColumn } from "../../../../components/AppTable/AppTable";
import type { Apartment } from "../../types/apartment.types";
import { formatArea, formatFloor, apartmentTypeLabels } from "./apartmentTableHelpers";
import "./ApartmentTable.css";

interface ApartmentTableProps {
  apartments: Apartment[];
  loading: boolean;
  onEdit: (apartment: Apartment) => void;
  onView: (apartment: Apartment) => void;
}

// ── Row actions dropdown ─────────────────────────────────────
const RowActions = ({
  onView,
  onEdit,
}: {
  apartment: Apartment;
  onView: () => void;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const calculatePos = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 148 });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleScrollOrResize = () => { if (open) calculatePos(); };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  return (
    <div className="at-actions" ref={ref}>
      <button
        ref={triggerRef}
        className="at-actions__trigger"
        onClick={() => { calculatePos(); setOpen((p) => !p); }}
        aria-label="Row actions"
      >
        <i className="bi bi-three-dots-vertical" />
      </button>

      {open && (
        <div
          className="at-actions__menu"
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 1050 }}
        >
          <button className="at-actions__item" onClick={() => { onView(); setOpen(false); }}>
            <i className="bi bi-eye" /> View details
          </button>
          <button className="at-actions__item" onClick={() => { onEdit(); setOpen(false); }}>
            <i className="bi bi-pencil" /> Edit
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────
const ApartmentTable = ({ apartments, loading, onEdit, onView }: ApartmentTableProps) => {

  const columns: TableColumn<Apartment>[] = [
    {
      key: "block",
      label: "Block",
      render: (a) => <span className="at-block">Block {a.block}</span>,
    },
    {
      key: "floor",
      label: "Floor",
      render: (a) => <span className="at-floor">{formatFloor(a.floorNumber)}</span>,
    },
    {
      key: "flateNumber",
      label: "Flat Number",
      render: (a) => <span className="at-flat">{a.flateNumber}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (a) => (
        <span className="at-badge at-badge--type">
          {apartmentTypeLabels[a.type] ?? a.type}
        </span>
      ),
    },
    {
      key: "area",
      label: "Area (sq ft)",
      render: (a) => <span className="at-area">{formatArea(a.areaSqft)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (a) => (
        <span className={`at-badge at-badge--${a.isOccupied ? "occupied" : "vacant"}`}>
          {a.isOccupied ? "Occupied" : "Vacant"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      render: (a) => (
        <RowActions
          apartment={a}
          onView={() => onView(a)}
          onEdit={() => onEdit(a)}
        />
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={apartments}
      loading={loading}
      rowKey={(a) => a.id}
      emptyTitle="No apartments found"
      emptySubtitle="Try adjusting your filters or add a new apartment."
    />
  );
};

export default ApartmentTable;