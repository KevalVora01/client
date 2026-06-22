import { useState } from "react";
import type { ResidentFilters } from "../../types/resident.types";
import "./ResidentFilters.css";

interface ResidentFiltersProps {
  filters: ResidentFilters;
  onFilterChange: (filters: Partial<ResidentFilters>) => void;
}

const ResidentFiltersComponent = ({
  filters,
  onFilterChange,
}: ResidentFiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? "");

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      onFilterChange({ search: search.trim() || undefined });
    }
  };

  const handleSearchBlur = () => {
    onFilterChange({ search: search.trim() || undefined });
  };

  const handleReset = () => {
    setSearch("");

    onFilterChange({
      search: undefined,
      isActive: undefined,
      isOwner: undefined,
      apartmentId: undefined,
    });
  };

  const hasActiveFilters =
    !!filters.search ||
    filters.isActive !== undefined ||
    filters.isOwner !== undefined ||
    filters.apartmentId !== undefined;

  return (
    <div className="resident-filters">
      <div className="resident-filters__search">
        <i className="bi bi-search" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={handleSearchBlur}
        />
      </div>

      <select
        className="resident-filters__select"
        value={filters.isActive === undefined ? "" : String(filters.isActive)}
        onChange={(e) =>
          onFilterChange({
            isActive:
              e.target.value === ""
                ? undefined
                : e.target.value === "true",
          })
        }
      >
        <option value="">All status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <select
        className="resident-filters__select"
        value={filters.isOwner === undefined ? "" : String(filters.isOwner)}
        onChange={(e) =>
          onFilterChange({
            isOwner:
              e.target.value === ""
                ? undefined
                : e.target.value === "true",
          })
        }
      >
        <option value="">All types</option>
        <option value="true">Owner</option>
        <option value="false">Tenant</option>
      </select>

      {hasActiveFilters && (
        <button
          className="resident-filters__clear"
          onClick={handleReset}
        >
          <i className="bi bi-x-circle" />
          Clear
        </button>
      )}
    </div>
  );
};

export default ResidentFiltersComponent;