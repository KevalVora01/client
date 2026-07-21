import { useEffect, useRef, useState } from "react";
import type { TableColumn } from "../../../components/AppTable/AppTable";
import AppTable from "../../../components/AppTable/AppTable";
import type { Apartment } from "../types/apartment.types";
import { apartmentTypeLabels, formatArea, formatFloor } from "./apartmentTableHelpers";

interface ApartmentTableProps {
  apartments: Apartment[];
  loading: boolean;
  onEdit: (apartment: Apartment) => void;
  onView: (apartment: Apartment) => void;
}

// ── Controlled Row Actions ─────────────────────────────────────
const RowActions = ({
  onView,
  onEdit,
}: {
  apartment: Apartment;
  onView: () => void;
  onEdit: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-menu")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuStyle(
        spaceBelow < 130
          ? { bottom: window.innerHeight - rect.top, left: rect.right - 148, zIndex: 9999, minWidth: "148px" }
          : { top: rect.bottom, left: rect.right - 148, zIndex: 9999, minWidth: "148px" }
      );
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleToggle}
        className="btn p-0 border-0 text-secondary bg-transparent d-flex align-items-center justify-content-center"
        style={{ width: "28px", height: "28px" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#212529")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
      >
        <i className="bi bi-three-dots-vertical fs-4" />
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu shadow-sm border border-light-subtle rounded-3 p-1 show position-fixed"
          style={menuStyle}
        >
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-eye text-muted" /> View Details
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded-2 small"
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              style={{ fontSize: "0.85rem" }}
            >
              <i className="bi bi-pencil text-muted" /> Edit Unit
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

import { useApartmentStore } from '../hooks/useApartmentStore';

const COL_WIDTH = '157px';

// ── Main component ───────────────────────────────────────────
const ApartmentTable = ({ apartments, loading, onEdit, onView }: ApartmentTableProps) => {
  const { filters } = useApartmentStore();
  const searchVal = filters.block ?? '';

  const highlightMatch = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    const cleanSearch = search.trim();
    const regex = new RegExp(`(${cleanSearch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark
              key={index}
              style={{
                backgroundColor: '#ffe066',
                color: '#1a1f36',
                padding: '0 2px',
                borderRadius: '3px',
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const columns: TableColumn<Apartment>[] = [
    {
      key: "block",
      label: "BLOCK",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <span className="fw-bold d-block py-2 text-dark" style={{ fontSize: "0.95rem" }}>
          Block {highlightMatch(a.block, searchVal)}
        </span>
      ),
    },
    {
      key: "floor",
      label: "FLOOR",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <span className="text-dark d-block py-2" style={{ fontSize: "0.95rem" }}>
          {formatFloor(a.floorNumber)}
        </span>
      ),
    },
    {
      key: "flateNumber",
      label: "FLAT NO.",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <span className="fw-bold d-block py-2 text-dark" style={{ fontSize: "0.95rem" }}>
          {highlightMatch(`${a.block}-${a.floorNumber}${a.unitNumber}`, searchVal)}
        </span>
      ),
    },
    {
      key: "type",
      label: "UNIT TYPE",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <span className="text-dark d-block py-2" style={{ fontSize: "0.95rem" }}>
          {apartmentTypeLabels[a.type] ?? a.type}
        </span>
      ),
    },
    {
      key: "area",
      label: "AREA (SQFT)",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <span className="text-dark d-block py-2" style={{ fontSize: "0.95rem" }}>
          {formatArea(a.areaSqft)}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => {
        let badgeStyle = { backgroundColor: "#e0e7ff", color: "#4338ca", borderColor: "#c7d2fe" }; // OCCUPIED
        let labelText = "OCCUPIED";

        if (!a.isOccupied) {
          badgeStyle = { backgroundColor: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }; // VACANT
          labelText = "VACANT";
        }

        return (
          <span
            className="d-inline-block fw-bold rounded-pill border text-center"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.6px",
              padding: "4px 14px",
              minWidth: "105px",
              ...badgeStyle
            }}
          >
            {labelText}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <div className="d-flex justify-content-center">
          <RowActions
            apartment={a}
            onView={() => onView(a)}
            onEdit={() => onEdit(a)}
          />
        </div>
      ),
    }
  ];

  return (
    <AppTable
      columns={columns}
      data={apartments}
      loading={loading}
      rowKey={(a) => a.id}
      emptyTitle="No apartments found"
      emptySubtitle="Try adjusting your filters or add a new apartment."
      emptyIcon="bi-building"
    />
  );
};

export default ApartmentTable;