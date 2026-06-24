import { useEffect } from "react";

let lockCount = 0;

export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    lockCount++;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };
  }, [active]);
};