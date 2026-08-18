import type { TableColumn } from "../../../components/AppTable/AppTable";
import AppTable from "../../../components/AppTable/AppTable";
import { StatusBadge } from "../../../components/StatusBadge/StatusBadge";
import type { Apartment } from "../types/apartment.types";
import { apartmentTypeLabels, formatArea, formatFloor } from "./apartmentTableHelpers";
import { useApartmentStore } from '../hooks/useApartmentStore';
import { highlightMatch } from "../../../utils/highlight";

interface ApartmentTableProps {
  apartments: Apartment[];
  loading: boolean;
  onView: (apartment: Apartment) => void;
}

const COL_WIDTH = '157px';

// ── Main component ───────────────────────────────────────────
const ApartmentTable = ({ apartments, loading, onView }: ApartmentTableProps) => {
  const { filters } = useApartmentStore();
  const searchVal = filters.search ?? '';

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
      render: (a) => (
        <StatusBadge variant={a.isOccupied ? 'success' : 'secondary'} label={a.isOccupied ? 'Occupied' : 'Vacant'} />
      ),
    },
    {
      key: "actions",
      label: "VIEW",
      width: COL_WIDTH,
      align: 'center',
      render: (a) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
          onClick={() => onView(a)}
          style={{ borderRadius: '6px', fontSize: '0.78rem' }}
          title="View Details"
        >
          <i className="bi bi-eye" />
        </button>
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