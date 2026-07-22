import React from 'react';

export interface FailedImportItem {
  row: number;
  identifier: string;
  reason: string;
}

interface ImportResultsModalProps {
  show: boolean;
  onClose: () => void;
  successCount: number;
  failedCount: number;
  failedItems: FailedImportItem[];
  title: string;
}

const ImportResultsModal: React.FC<ImportResultsModalProps> = ({
  show,
  onClose,
  successCount,
  failedCount,
  failedItems,
  title,
}) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">
          
          {/* Modal Header */}
          <div className="modal-header border-bottom border-light p-3">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-spreadsheet-fill text-secondary" style={{ fontSize: '1.25rem' }} />
              {title}
            </h5>
            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 18, right: 20, width: 28, height: 28, border: '1px solid #e9ecef', background: '#fff', fontSize: '1.1rem', borderRadius: '6px' }}
              onClick={onClose}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            
            {/* Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="card bg-success-subtle border-0 rounded-3 p-3">
                  <div className="small fw-semibold text-success-emphasis text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                    Successfully Imported
                  </div>
                  <div className="fs-3 fw-bold text-success mt-1">
                    {successCount}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-warning-subtle border-0 rounded-3 p-3">
                  <div className="small fw-semibold text-warning-emphasis text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                    Skipped / Failed
                  </div>
                  <div className="fs-3 fw-bold text-warning mt-1">
                    {failedCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Failures List */}
            {failedItems.length > 0 ? (
              <div>
                <h6 className="fw-bold text-secondary mb-3 small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                  Skipped Rows & Details
                </h6>
                <div className="table-responsive border rounded-3" style={{ maxHeight: '250px' }}>
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.875rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-3" style={{ width: '80px' }}>Row</th>
                        <th scope="col">Identifier</th>
                        <th scope="col" className="pe-3">Reason / Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="ps-3 fw-bold text-muted">#{item.row}</td>
                          <td className="fw-semibold text-dark">{item.identifier}</td>
                          <td className="pe-3 text-secondary">
                            <span className="badge bg-danger-subtle text-danger text-wrap text-start fw-normal px-2 py-1.5" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
                              {item.reason}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-secondary">
                <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block" />
                <p className="mb-0 fw-semibold">All items from the Excel file were successfully added!</p>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top border-light p-3">
            <button type="button" className="btn btn-dark fw-semibold px-4" onClick={onClose} style={{ borderRadius: '8px', backgroundColor: '#1a1f36', borderColor: '#1a1f36' }}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImportResultsModal;
