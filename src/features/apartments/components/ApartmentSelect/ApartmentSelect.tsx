import { useState, useRef, useEffect, useMemo } from "react";
import { useApartmentSelect } from "../../hooks/useApartmentSelect";

interface ApartmentSelectProps {
  value: number;
  onChange: (val: number) => void;
  error?: string;
  onBlur?: () => void;
  showAll?: boolean;
}

const ApartmentSelect = ({ value, onChange, onBlur, error }: ApartmentSelectProps) => {
  const { apartments, loading } = useApartmentSelect();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isEmpty = !loading && apartments.length === 0;

  const selectedApartment = useMemo(() => {
    return apartments.find((apt) => apt.id === value);
  }, [apartments, value]);

  const filteredApartments = useMemo(() => {
    if (!search.trim()) return apartments;
    const term = search.toLowerCase();
    return apartments.filter((apt) =>
      apt.flateNumber.toLowerCase().includes(term) ||
      apt.block.toLowerCase().includes(term)
    );
  }, [apartments, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const handleToggle = () => {
    if (loading || isEmpty) return;
    setIsOpen((prev) => !prev);
    setSearch("");
  };

  const handleSelect = (id: number) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="position-relative w-100" ref={containerRef}>

      {/* ── Dropdown Trigger Button ── */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading || isEmpty}
        className={`btn w-100 bg-white d-flex align-items-center justify-content-between px-3 border rounded-2 shadow-none text-start ${error ? "border-danger" : "border-light-subtle"
          }`}
        style={{
          height: "42px",
          boxShadow: isOpen ? "0 0 0 3px rgba(26, 31, 54, 0.15)" : "none",
          borderColor: isOpen ? "#a5b4fc" : ""
        }}
      >
        <div className="d-flex flex-column min-w-0" style={{ gap: "1px" }}>
          {loading ? (
            <span className="text-muted small">
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Loading units...
            </span>
          ) : isEmpty ? (
            <span className="text-muted small">No vacant apartments available</span>
          ) : selectedApartment ? (
            <>
              <span
                className="fw-medium text-truncate"
                style={{ fontSize: "0.875rem", color: "#1a1f36", lineHeight: 1.2 }}
              >
                Flat {selectedApartment.flateNumber}
              </span>
              <span className="text-muted" style={{ fontSize: "0.72rem", lineHeight: 1 }}>
                Block {selectedApartment.block} • Floor {selectedApartment.floorNumber}
              </span>
            </>
          ) : (
            <span className="text-muted" style={{ fontSize: "0.875rem" }}>Select apartment unit</span>
          )}
        </div>

        {/* Chevron Icon with Rotation Transition */}
        <i
          className="bi bi-chevron-down text-muted"
          style={{
            fontSize: "0.75rem",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}
        />
      </button>

      {/* ── Custom Dropdown Menu Floating Card ── */}
      {isOpen && (
        <div
          className="position-absolute w-100 bg-white border border-light-subtle rounded-3 shadow-lg overflow-hidden"
          style={{ top: "calc(100% + 5px)", zIndex: 200 }}
        >

          {/* Inner Search Box Wrapper */}
          <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom border-light-subtle">
            <i className="bi bi-search text-muted small" style={{ fontSize: "0.8rem" }} />
            <input
              type="text"
              className="form-control border-0 p-0 shadow-none text-dark bg-transparent"
              placeholder="Search by flat number or block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{ fontSize: "0.8rem" }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="btn p-0 border-0 bg-transparent text-muted link-dark"
              >
                <i className="bi bi-x-circle-fill" />
              </button>
            )}
          </div>

          {/* List Box Container */}
          <ul
            className="list-unstyled m-0 p-1 overflow-y-auto"
            style={{ maxHeight: "200px" }}
          >
            {filteredApartments.length === 0 ? (
              <div className="text-center py-3 text-muted" style={{ fontSize: "0.8rem" }}>
                No matching units found
              </div>
            ) : (
              filteredApartments.map((apt) => {
                const isSelected = apt.id === value;
                return (
                  <li
                    key={apt.id}
                    onClick={() => handleSelect(apt.id)}
                    className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2"
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#eef2ff" : "transparent",
                      transition: "background-color 0.1s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#e0e7ff" : "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#eef2ff" : "transparent")}
                  >
                    <div>
                      <p className="fw-medium m-0" style={{ fontSize: "0.875rem", color: "#1a1f36", lineHeight: 1.2 }}>
                        Flat {apt.flateNumber}
                      </p>
                      <p className="text-muted m-0" style={{ fontSize: "0.75rem" }}>
                        Block {apt.block}, Floor {apt.floorNumber}
                      </p>
                    </div>
                    {isSelected && (
                      <i className="bi bi-check-lg" style={{ color: "#4f46e5", fontSize: "0.9rem" }} />
                    )}
                  </li>
                );
              })
            )}
          </ul>

        </div>
      )}

      {/* Validation Error Message block */}
      {error && (
        <p className="text-danger m-0 mt-1" style={{ fontSize: "0.75rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ApartmentSelect;