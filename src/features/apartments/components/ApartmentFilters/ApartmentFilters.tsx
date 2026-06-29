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
  const [isFocused, setIsFocused] = useState(false); // 💡 State to smoothly toggle active border frames

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFilterChange({ block: search.trim().toUpperCase() || undefined });
    }
  };

  const handleSearchBlur = () => {
    setIsFocused(false);
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
        {/* 💡 Replaced input-group with a custom controlled flex container wrapper */}
        <div
          className="d-flex align-items-center bg-white border rounded-2 px-3 text-secondary"
          style={{
            height: "46px",
            transition: "border-color 0.15s, box-shadow 0.15s",
            // Matches your application custom component focus layout perfectly!
            borderColor: isFocused ? "#a5b4fc" : "#e5e7eb",
            boxShadow: isFocused ? "0 0 0 3px rgba(26, 31, 54, 0.15)" : "none"
          }}
        >
          <i className="bi bi-search me-2 fs-6 text-muted" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="w-100 border-0 p-0 shadow-none bg-transparent text-dark"
            placeholder="Search by block (e.g. A, B)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleSearchBlur}
            style={{ fontSize: "0.875rem", outline: "none" }}
          />
        </div>
      </div>

      {/* Floor number */}
      <div className="col-6 col-md-2">
        <input
          type="number"
          className="form-control border-light-subtle shadow-none"
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
      <div className="col-6 col-md-2">
        <select
          className="form-select border-light-subtle shadow-none"
          value={filters.type ?? ""}
          onChange={handleTypeChange}
          style={{ height: "46px", fontSize: "0.875rem" }}
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