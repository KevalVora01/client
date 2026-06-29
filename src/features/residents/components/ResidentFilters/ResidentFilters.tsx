import { useState } from "react";
import type { ResidentFiltersProps } from "../../types/resident.types";

const ResidentFiltersComponent = ({
  filters,
  onFilterChange,
}: ResidentFiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      onFilterChange({ search: search.trim() || undefined });
    }
  };

  const handleSearchBlur = () => {
    setIsFocused(false);
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
    /* Bootstrap horizontal flex flow matching old CSS layout settings gap rules */
    <div className="d-flex flex-md-row flex-column align-items-stretch align-items-md-center gap-2 w-100">
      
      {/* Search Input Container Box Wrapper */}
      <div className="flex-grow-1" style={{ minWidth: "280px" }}>
        <div 
          className="d-flex align-items-center bg-white border rounded-2 px-3 text-secondary"
          style={{ 
            height: "42px",
            transition: "border-color 0.15s, box-shadow 0.15s",
            borderColor: isFocused ? "#a5b4fc" : "#e5e7eb",
            boxShadow: isFocused ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : "none"
          }}
        >
          <i className="bi bi-search me-2 fs-6 text-muted" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="w-100 border-0 p-0 shadow-none bg-transparent text-dark"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleSearchBlur}
            style={{ fontSize: "0.875rem", outline: "none" }}
          />
        </div>
      </div>

      {/* Select Status Filters */}
      <div style={{ minWidth: "140px" }}>
        <select
          className="form-select border-light-subtle shadow-none fw-medium text-secondary"
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) =>
            onFilterChange({
              isActive:
                e.target.value === ""
                  ? undefined
                  : e.target.value === "true",
            })
          }
          style={{ height: "42px", fontSize: "0.875rem" }}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Select Ownership Type Filters */}
      <div style={{ minWidth: "140px" }}>
        <select
          className="form-select border-light-subtle shadow-none fw-medium text-secondary"
          value={filters.isOwner === undefined ? "" : String(filters.isOwner)}
          onChange={(e) =>
            onFilterChange({
              isOwner:
                e.target.value === ""
                  ? undefined
                  : e.target.value === "true",
            })
          }
          style={{ height: "42px", fontSize: "0.875rem" }}
        >
          <option value="">All types</option>
          <option value="true">Owner</option>
          <option value="false">Tenant</option>
        </select>
      </div>

      {/* Clear Active Filters Action Button */}
      {hasActiveFilters && (
        <div className="col-auto">
          <button
            className="btn btn-outline-secondary border-light-subtle d-flex align-items-center justify-content-center px-3 w-100"
            onClick={handleReset}
            style={{ height: "42px", fontSize: "0.875rem" }}
          >
            <i className="bi bi-x-circle me-2" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ResidentFiltersComponent;