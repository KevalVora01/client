// src/features/residents/components/ResidentTable/RowActions.tsx

import { useState, useRef, useEffect } from "react";
import type { ResidentDetail } from "../../types/resident.types";

interface RowActionsProps {
  resident: ResidentDetail;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}

const RowActions = ({ resident, onView, onEdit, onDeactivate }: RowActionsProps) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const calculatePos = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: rect.right - 148,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (open) calculatePos();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  const handleOpen = () => {
    calculatePos();
    setOpen((p) => !p);
  };

  return (
    <div className="rt-actions" ref={ref}>
      <button
        ref={triggerRef}
        className="rt-actions__trigger"
        onClick={handleOpen}
        aria-label="Row actions"
      >
        <i className="bi bi-three-dots-vertical" />
      </button>

      {open && (
        <div
          className="rt-actions__menu"
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 1050 }}
        >
          <button className="rt-actions__item" onClick={() => { onView(); setOpen(false); }}>
            <i className="bi bi-eye" /> View details
          </button>
          <button className="rt-actions__item" onClick={() => { onEdit(); setOpen(false); }} disabled={!resident.isActive}>
            <i className="bi bi-pencil" /> Edit
          </button>
          <button className="rt-actions__item rt-actions__item--danger" onClick={() => { onDeactivate(); setOpen(false); }} disabled={!resident.isActive}>
            <i className="bi bi-person-x" /> Deactivate
          </button>
        </div>
      )}
    </div>
  );
};

export default RowActions;