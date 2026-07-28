import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import { useSidebar } from '../../../hooks/useSidebar';

const DashboardLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isOpen]);

  return (
    <>
      <style>{`
        .sidebar-wrapper {
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .sidebar-wrapper.open {
            transform: translateX(0);
          }
        }
        @media (min-width: 768px) {
          .sidebar-wrapper {
            transform: none !important;
            position: relative !important;
            z-index: auto !important;
          }
        }
      `}</style>
      <div className="d-flex min-vh-100 position-relative">

        {isOpen && (
          <div
            className="position-fixed"
            style={{ inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
            onClick={close}
          />
        )}

        <div className={`sidebar-wrapper ${isOpen ? 'open' : ''}`}>
          <Sidebar onClose={close} />
        </div>

        <div className="d-flex flex-column flex-grow-1 vh-100 overflow-hidden" style={{ background: '#f3f4f6' }}>
          <Topbar onMenuClick={toggle} />
          <main className="flex-grow-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: 0 }}>
            <Outlet />
          </main>
        </div>

      </div>
    </>
  );
};

export default DashboardLayout;
