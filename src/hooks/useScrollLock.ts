import { useEffect } from "react";

let lockCount = 0;

export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    lockCount++;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
  }, [active]);
};