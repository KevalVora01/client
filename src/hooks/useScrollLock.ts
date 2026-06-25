import { useEffect } from "react";

let lockCount = 0;

export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    lockCount++;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const mainEl = document.querySelector('.dashboard-layout__main') as HTMLElement;

    if (mainEl) {
      mainEl.style.overflow = 'hidden';
      mainEl.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        if (mainEl) {
          mainEl.style.overflow = '';
          mainEl.style.paddingRight = '';
        } else {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      }
    };
  }, [active]);
};