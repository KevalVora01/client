import { useState, useEffect, useRef } from "react";

export interface CreatedResidentEmailItem {
  userId: number;
  name: string;
  email: string;
  unit: string;
  temporaryPassword?: string;
}

export type EmailDeliveryStatus = "pending" | "sending" | "sent" | "failed";

export interface ResidentEmailStatusItem extends CreatedResidentEmailItem {
  status: EmailDeliveryStatus;
  error?: string;
}

export interface EmailStatusModalProps {
  show: boolean;
  items: CreatedResidentEmailItem[];
  onClose: () => void;
  onSendEmailApi: (item: CreatedResidentEmailItem) => Promise<boolean>;
}

const EmailStatusModal = ({ show, items, onClose, onSendEmailApi }: EmailStatusModalProps) => {
  const [statusItems, setStatusItems] = useState<ResidentEmailStatusItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (show && items.length > 0 && !isStartedRef.current) {
      isStartedRef.current = true;
      const initial: ResidentEmailStatusItem[] = items.map((it) => ({
        ...it,
        status: "pending",
      }));
      setStatusItems(initial);
      setIsProcessing(true);
      setIsFinished(false);

      const processEmails = async () => {
        for (let i = 0; i < initial.length; i++) {
          // 1. Set current item to sending
          setStatusItems((prev) =>
            prev.map((item, idx) => (idx === i ? { ...item, status: "sending" } : item))
          );

          // 2. Execute email API call
          let success = false;
          try {
            success = await onSendEmailApi(initial[i]);
          } catch {
            success = false;
          }

          // 3. Update status to sent or failed
          setStatusItems((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: success ? "sent" : "failed" } : item
            )
          );

          // 4. Short delay for smooth UI transition
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        setIsProcessing(false);
        setIsFinished(true);
      };

      processEmails();
    }

    if (!show) {
      isStartedRef.current = false;
      setStatusItems([]);
      setIsProcessing(false);
      setIsFinished(false);
    }
  }, [show, items, onSendEmailApi]);

  if (!show) return null;

  const totalCount = statusItems.length;
  const sentCount = statusItems.filter((i) => i.status === "sent").length;
  const failedCount = statusItems.filter((i) => i.status === "failed").length;
  const processedCount = sentCount + failedCount;
  const progressPercent = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ backdropFilter: "blur(4px)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          {/* ── Modal Header ── */}
          <div className="modal-header d-flex align-items-start justify-content-between border-bottom border-light-subtle px-4 py-4 position-relative">
            <div>
              <h5 className="modal-title fw-bold m-0 text-dark" style={{ fontSize: "1rem", color: "#1a1f36" }}>
                Sending Welcome Emails & Credentials
              </h5>
              <p className="text-muted m-0 small" style={{ fontSize: "0.8rem" }}>
                Real-time status of credentials emails being dispatched to residents.
              </p>
            </div>

            <button
              type="button"
              className="btn position-absolute d-flex align-items-center justify-content-center p-0 text-secondary"
              style={{ top: 22, right: 22, width: 28, height: 28, border: "1px solid #e9ecef", background: "#fff", fontSize: "1.1rem", borderRadius: "6px" }}
              onClick={onClose}
              disabled={isProcessing}
              aria-label="Close"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          {/* ── Modal Body ── */}
          <div className="modal-body px-4 py-3">

            {/* Progress Card */}
            <div className="card bg-light border-0 rounded-3 p-3 mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-semibold text-dark small">
                  {isFinished
                    ? "Email Delivery Finished"
                    : `Delivering Emails... (${processedCount} of ${totalCount})`}
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary fw-bold" style={{ fontSize: "0.8rem" }}>
                  {progressPercent}%
                </span>
              </div>

              <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                <div
                  className={`progress-bar ${isProcessing ? "progress-bar-striped progress-bar-animated bg-primary" : "bg-success"}`}
                  role="progressbar"
                  style={{ width: `${progressPercent}%`, transition: "width 0.3s ease" }}
                />
              </div>

              <div className="d-flex align-items-center gap-3 mt-3 pt-2 border-top border-light-subtle">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  <strong>Total:</strong> {totalCount}
                </small>
                <small className="text-success fw-medium" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-check-circle-fill me-1" />
                  <strong>Sent:</strong> {sentCount}
                </small>
                {failedCount > 0 && (
                  <small className="text-danger fw-medium" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-x-circle-fill me-1" />
                    <strong>Failed:</strong> {failedCount}
                  </small>
                )}
              </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="table-responsive border border-light-subtle rounded-3" style={{ maxHeight: "360px", overflowY: "auto" }}>
              <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.875rem" }}>
                <thead className="table-light sticky-top" style={{ zIndex: 2 }}>
                  <tr>
                    <th scope="col" className="ps-3" style={{ width: "60px" }}>Row</th>
                    <th scope="col">Resident Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Unit</th>
                    <th scope="col" className="pe-3 text-center" style={{ width: "130px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statusItems.map((item, idx) => (
                    <tr key={item.userId || idx} className={item.status === "sending" ? "table-primary bg-opacity-10" : ""}>
                      <td className="ps-3 fw-bold text-muted">#{idx + 1}</td>
                      <td className="fw-semibold text-dark">{item.name}</td>
                      <td className="text-secondary">{item.email}</td>
                      <td>
                        <span className="badge bg-light text-dark border border-light-subtle px-2 py-1">{item.unit}</span>
                      </td>
                      <td className="pe-3 text-center">
                        {item.status === "pending" && (
                          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
                            <i className="bi bi-clock me-1" />
                            Pending
                          </span>
                        )}
                        {item.status === "sending" && (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                            <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: "0.75rem", height: "0.75rem" }} />
                            Sending...
                          </span>
                        )}
                        {item.status === "sent" && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            <i className="bi bi-check-circle-fill me-1" />
                            Sent
                          </span>
                        )}
                        {item.status === "failed" && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                            <i className="bi bi-x-circle-fill me-1" />
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ── Modal Footer ── */}
          <div className="modal-footer border-top border-light-subtle px-4 py-3 d-flex align-items-center justify-content-between">
            <span className="small text-muted" style={{ fontSize: "0.8rem" }}>
              {isProcessing
                ? "Please wait while welcome emails are being delivered..."
                : "All welcome credentials emails processed."}
            </span>

            <button
              type="button"
              className="btn btn-dark fw-medium px-3 d-inline-flex align-items-center"
              onClick={onClose}
              disabled={isProcessing}
              style={{
                height: "38px",
                fontSize: "0.875rem",
                borderRadius: "8px",
                backgroundColor: "#1a1f36",
                borderColor: "#1a1f36",
                opacity: isProcessing ? 0.55 : 1,
              }}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Processing...
                </>
              ) : (
                "Done"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmailStatusModal;
