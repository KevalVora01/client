import { useState } from "react";
import type { ApartmentFilters } from "../../types/apartment.types";
import { ApartmentType } from "../../types/apartment.types";

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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFilterChange({ block: search.trim().toUpperCase() || undefined });
    }
  };

  const handleSearchBlur = () => {
    onFilterChange({ block: search.trim().toUpperCase() || undefined });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ type: e.target.value || undefined });
  };

  const handleReset = () => {
    setSearch("");
    onFilterChange({ block: undefined, floorNumber: undefined, type: undefined });
  };

  const hasActiveFilters =
    !!filters.block || filters.floorNumber !== undefined || !!filters.type;

  return (
    <div className="row g-2 mb-0 align-items-center">

      {/* Block search */}
      <div className="col-12 col-md-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by block (e.g. A, B)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onBlur={handleSearchBlur}
          />
        </div>
      </div>

      {/* Floor number */}
      <div className="col-6 col-md-2">
        <input
          type="number"
          className="form-control"
          placeholder="Floor no."
          min={0}
          value={filters.floorNumber ?? ""}
          onChange={(e) =>
            onFilterChange({
              floorNumber: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      {/* Type */}
      <div className="col-6 col-md-2">
        <select
          className="form-select"
          value={filters.type ?? ""}
          onChange={handleTypeChange}
        >
          <option value="">All types</option>
          {Object.entries(apartmentTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="col-auto">
          <button className="btn btn-outline-secondary" onClick={handleReset}>
            <i className="bi bi-x-circle me-1"></i>
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
};

export default ApartmentFiltersComponent;