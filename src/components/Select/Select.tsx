import { useState, useRef, useEffect, useMemo } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  containerClassName?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  dropdownWidth?: string | number;
}

const Select = ({
  label,
  options,
  placeholder = "Select...",
  required = false,
  error,
  touched,
  containerClassName,
  name = "",
  value,
  onChange,
  onBlur,
  disabled = false,
  className,
  style,
  dropdownWidth,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const showError = touched && error;

  const normalizedOptions: SelectOption[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
      ),
    [options]
  );

  const selectedOption = useMemo(
    () => normalizedOptions.find((opt) => opt.value === value),
    [normalizedOptions, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (selected && listRef.current) {
        listRef.current.scrollTop = selected.offsetTop - listRef.current.offsetTop;
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < 200);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (opt: SelectOption) => {
    const synthetic = {
      target: { name, value: opt.value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(synthetic);
    setIsOpen(false);
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="form-label fw-medium text-secondary small mb-1">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <div className="position-relative w-100" ref={containerRef}>
        {/* ── Trigger ── */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          onBlur={() => {
            const synthetic = { target: { name } } as React.FocusEvent<HTMLSelectElement>;
            onBlur?.(synthetic);
          }}
          className={`form-select bg-white d-flex align-items-center justify-content-between text-start${showError ? " border-danger" : " border-light-subtle"
            }${className ? ` ${className}` : ""}`}
          style={{
            height: "40px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            backgroundImage: "none",
            paddingRight: "0.75rem",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.65 : 1,
            width: "100%",
            ...style,
          }}
        >
          <span
            className={`text-truncate${selectedOption ? " text-dark" : " text-muted"}`}
            style={{ lineHeight: 1.3 }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <i
            className="bi bi-chevron-down text-muted flex-shrink-0"
            style={{
              fontSize: "0.75rem",
              marginLeft: "8px",
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* ── Dropdown ── */}
        {isOpen && (
          <div
            className="position-absolute bg-white border border-light-subtle rounded-3 shadow-lg overflow-hidden"
            style={{
              zIndex: 9999,
              width: dropdownWidth ? `${dropdownWidth}px` : 'auto',
              minWidth: dropdownWidth ? `${dropdownWidth}px` : '100%',
              ...(openUp
                ? { bottom: "calc(100% + 5px)" }
                : { top: "calc(100% + 5px)" })
            }}
          >
            <ul
              ref={listRef}
              className="list-unstyled m-0 p-1 overflow-y-auto"
              style={{ maxHeight: "220px" }}
            >
              {normalizedOptions.length === 0 ? (
                <li className="text-center py-3 text-muted" style={{ fontSize: "0.8rem" }}>
                  No options available
                </li>
              ) : (
                normalizedOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <li
                      key={opt.value}
                      data-selected={isSelected}
                      onClick={() => handleSelect(opt)}
                      className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2"
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#eef2ff" : "transparent",
                        transition: "background-color 0.1s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected
                          ? "#e0e7ff"
                          : "#f3f4f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected
                          ? "#eef2ff"
                          : "transparent";
                      }}
                    >
                      <span
                        className="fw-medium"
                        style={{
                          fontSize: "0.875rem",
                          color: "#1a1f36",
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <i
                          className="bi bi-check-lg flex-shrink-0"
                          style={{
                            color: "#4f46e5",
                            fontSize: "0.9rem",
                            marginLeft: "8px",
                          }}
                        />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {showError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
};

export default Select;
