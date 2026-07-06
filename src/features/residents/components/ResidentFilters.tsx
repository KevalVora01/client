import { useState, useEffect } from "react";
import Select from "../../../components/Select/Select";
import type { ResidentFiltersProps } from "../types/resident.types";

const ResidentFiltersComponent = ({
  filters,
  onFilterChange,
}: ResidentFiltersProps) => {

  const [search, setSearch] = useState(filters.search ?? "");

  // debounce 300ms
  useEffect(() => {
    if (search === (filters.search ?? "")) return;

    const timer = setTimeout(() => {
      onFilterChange({ search: search.trim() || undefined });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);


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
    <div className="d-flex flex-md-row flex-column align-items-stretch align-items-md-center gap-2 w-100">

      <div className="flex-grow-1" style={{ maxWidth: "550px" }}>
        <div
          className="d-flex align-items-center bg-white border rounded-2 px-3 text-secondary search-wrapper"
          style={{ height: "46px", transition: "border-color 0.15s, box-shadow 0.15s" }}
        >
          <i className="bi bi-search me-2 fs-6 text-muted" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="w-100 border-0 p-0 shadow-none bg-transparent text-dark"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "0.875rem", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ minWidth: "140px" }}>
        <Select
          options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]}
          placeholder="All status"
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) => onFilterChange({ isActive: e.target.value === "" ? undefined : e.target.value === "true" })}
          className="fw-medium text-secondary"
          style={{ height: "46px" }}
        />
      </div>

      <div style={{ minWidth: "140px" }}>
        <Select
          options={[{ value: "true", label: "Owner" }, { value: "false", label: "Tenant" }]}
          placeholder="All types"
          value={filters.isOwner === undefined ? "" : String(filters.isOwner)}
          onChange={(e) => onFilterChange({ isOwner: e.target.value === "" ? undefined : e.target.value === "true" })}
          className="fw-medium text-secondary"
          style={{ height: "46px" }}
        />
      </div>

      {hasActiveFilters && (
        <div className="col-auto">
          <button
            className="btn btn-outline-secondary border-light-subtle d-flex align-items-center justify-content-center px-3 w-100"
            onClick={handleReset}
            style={{ height: "46px", fontSize: "0.875rem" }}
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