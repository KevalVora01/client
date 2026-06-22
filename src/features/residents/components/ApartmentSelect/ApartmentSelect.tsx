import { useState, useRef, useEffect } from "react";
import "./ApartmentSelect.css";

interface ApartmentOption {
  value: number;
  label: string;
  floor?: string;
  block?: string;
}

interface ApartmentSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: ApartmentOption[];
  error?: string;
  placeholder?: string;
}

const ApartmentSelect = ({
  value,
  onChange,
  options,
  error,
  placeholder = "Select apartment",
}: ApartmentSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    `${o.label} ${o.floor ?? ""} ${o.block ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (val: number) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={`apt-select ${error ? "apt-select--error" : ""}`} ref={wrapperRef}>

      {/* ── Trigger ── */}
      <button
        type="button"
        className="apt-select__trigger"
        onClick={() => setOpen((p) => !p)}
      >
        {selected ? (
          <div className="apt-select__selected">
            <span className="apt-select__selected-label">{selected.label}</span>
            {(selected.floor || selected.block) && (
              <span className="apt-select__selected-sub">
                {[selected.floor, selected.block].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        ) : (
          <span className="apt-select__placeholder">{placeholder}</span>
        )}
        <i className={`bi bi-chevron-down apt-select__chevron ${open ? "apt-select__chevron--open" : ""}`} />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="apt-select__dropdown">

          {/* Search */}
          <div className="apt-select__search">
            <i className="bi bi-search apt-select__search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="apt-select__search-input"
              placeholder="Search unit or block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="apt-select__search-clear" onClick={() => setSearch("")}>
                <i className="bi bi-x" />
              </button>
            )}
          </div>

          {/* Options */}
          <ul className="apt-select__list">
            {filtered.length === 0 ? (
              <li className="apt-select__empty">No apartments found</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  className={`apt-select__option ${opt.value === value ? "apt-select__option--selected" : ""}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <div>
                    <p className="apt-select__option-label">{opt.label}</p>
                    {(opt.floor || opt.block) && (
                      <p className="apt-select__option-sub">
                        {[opt.floor, opt.block].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  {opt.value === value && (
                    <i className="bi bi-check2 apt-select__check" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="apt-select__error-msg">{error}</p>}
    </div>
  );
};

export default ApartmentSelect;