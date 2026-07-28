import React, { useState } from 'react';
import type { LogWalkInPayload } from '../types/visitor.types';
import VisitorLookupSearch from '../components/VisitorLookupSearch';
import WalkInVisitorForm from '../components/WalkInVisitorForm';
import CurrentlyInsideList from '../components/CurrentlyInsideList';
import { useCurrentlyInside } from '../hooks/useCurrentlyInside';
import { useVisitorMutations } from '../hooks/useVisitorMutations';
import { UserCheck, UserPlus, LogIn } from 'lucide-react';

export const CheckInPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lookup' | 'walkin' | 'inside'>('lookup');
  const { visitors: currentlyInside, loading: loadingInside, refetch: fetchCurrentlyInside } = useCurrentlyInside();
  const { logWalkIn, checkOut } = useVisitorMutations();

  const [showWalkInModal, setShowWalkInModal] = useState(false);

  const handleLogWalkInSubmit = async (payload: LogWalkInPayload, photo?: File): Promise<boolean> => {
    const ok = await logWalkIn(payload, photo);
    if (ok) {
      setShowWalkInModal(false);
      fetchCurrentlyInside();
    }
    return ok;
  };

  const handleCheckOut = async (visitorId: number) => {
    await checkOut(visitorId);
    fetchCurrentlyInside();
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 fs-4" style={{ color: '#0f172a' }}>
            Security Gate — Visitor Check-In
          </h4>
          <p className="text-muted small mb-0">Verify expected pre-registrations or log unregistered walk-in visitors</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-primary rounded-2 d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-xs"
            onClick={() => setShowWalkInModal(true)}
          >
            <UserPlus size={18} />
            Log Walk-In Visitor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom">
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold px-3 py-2.5 d-flex align-items-center gap-2 ${
              activeTab === 'lookup' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'
            }`}
            onClick={() => setActiveTab('lookup')}
          >
            <UserCheck size={18} />
            Lookup Expected Visitor
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold px-3 py-2.5 d-flex align-items-center gap-2 ${
              activeTab === 'walkin' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'
            }`}
            onClick={() => setActiveTab('walkin')}
          >
            <UserPlus size={18} />
            Walk-In Registration
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 fw-semibold px-3 py-2.5 d-flex align-items-center gap-2 ${
              activeTab === 'inside' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'
            }`}
            onClick={() => {
              setActiveTab('inside');
              fetchCurrentlyInside();
            }}
          >
            <LogIn size={18} />
            Currently Inside ({currentlyInside.length})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'lookup' && (
        <div className="row">
          <div className="col-12 col-lg-8">
            <VisitorLookupSearch onCheckInSuccess={fetchCurrentlyInside} />
          </div>
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 bg-white p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 text-dark">Active Visitors Inside ({currentlyInside.length})</h6>
              </div>
              <CurrentlyInsideList visitors={currentlyInside} loading={loadingInside} onCheckOut={handleCheckOut} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'walkin' && (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <WalkInVisitorForm onSubmit={handleLogWalkInSubmit} />
          </div>
        </div>
      )}

      {activeTab === 'inside' && (
        <div className="row">
          <div className="col-12 col-lg-8">
            <CurrentlyInsideList visitors={currentlyInside} loading={loadingInside} onCheckOut={handleCheckOut} />
          </div>
        </div>
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-body p-0">
                <WalkInVisitorForm
                  onSubmit={handleLogWalkInSubmit}
                  onCancel={() => setShowWalkInModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInPage;
