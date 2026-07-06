import { useState, useEffect } from "react";
import Select from "../../../components/Select/Select";
import { ApartmentType, type ApartmentFilters } from "../types/apartment.types";

interface ApartmentFiltersProps {
  filters: ApartmentFilters;
  onFilterChange: (filters: Partial<ApartmentFilters>) => void;
}

const apartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.STUDIO]: "Studio",
  [ApartmentType.ONE_BHK]: "1 BHK",
  [ApartmentType.TWO_BHK]: "2 BHK",
  [ApartmentType.THREE_BHK]: "3 BHK",
  [ApartmentType.FOUR_BHK]: "4 BHK",
};

const ApartmentFiltersComponent = ({ filters, onFilterChange }: ApartmentFiltersProps) => {
  const [search, setSearch] = useState(filters.block ?? "");

  // debounce — 300ms
  useEffect(() => {
    if (search === (filters.block ?? "")) return;

    const timer = setTimeout(() => {
      onFilterChange({ block: search.trim().toUpperCase() || undefined });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ type: e.target.value || undefined });
  };

  const handleOccupiedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      isOccupied: e.target.value === '' ? undefined : e.target.value === 'true',
    });
  };

  const handleReset = () => {
    setSearch("");
    onFilterChange({ block: undefined, floorNumber: undefined, type: undefined, isOccupied: undefined });
  };

  const hasActiveFilters =
    !!filters.block || filters.floorNumber !== undefined || !!filters.type || filters.isOccupied !== undefined;

  return (
    <div className="d-flex flex-md-row flex-column align-items-stretch align-items-md-center gap-2 w-100">

      {/* Block search */}
      <div className="flex-grow-1" style={{ maxWidth: "550px" }}>
        <div
          className="d-flex align-items-center bg-white border rounded-2 px-3 text-secondary search-wrapper"
          style={{ height: "46px", transition: "border-color 0.15s, box-shadow 0.15s" }}
        >
          <i className="bi bi-search me-2 fs-6 text-muted" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="w-100 border-0 p-0 bg-transparent text-dark"
            placeholder="Search by block (e.g. A, B)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "0.875rem", outline: "none" }}
          />
        </div>
      </div>

      {/* Floor number */}
      <div style={{ minWidth: "140px" }}>
        <input
          type="number"
          className="form-control border-light-subtle"
          placeholder="Floor no."
          min={0}
          value={filters.floorNumber ?? ""}
          onChange={(e) =>
            onFilterChange({
              floorNumber: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          style={{ height: "46px", fontSize: "0.875rem" }}
        />
      </div>

      {/* Type */}
      <div style={{ minWidth: "140px" }}>
        <Select
          options={Object.entries(apartmentTypeLabels).map(([value, label]) => ({ value, label }))}
          placeholder="All types"
          value={filters.type ?? ""}
          onChange={handleTypeChange}
          style={{ height: "46px" }}
        />
      </div>

      {/* Occupied / Vacant */}
      <div style={{ minWidth: "140px" }}>
        <Select
          options={[
            { value: 'true', label: 'Occupied' },
            { value: 'false', label: 'Vacant' },
          ]}
          placeholder="All status"
          value={filters.isOccupied === undefined ? '' : String(filters.isOccupied)}
          onChange={handleOccupiedChange}
          style={{ height: '46px' }}
        />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="col-auto">
          <button
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
            onClick={handleReset}
            style={{ height: "46px", fontSize: "0.85rem" }}
          >
            <i className="bi bi-x-circle me-2"></i>
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
};

export default ApartmentFiltersComponent;