import { useState } from 'react';
import { UpiPaymentModal } from './UpiPaymentModal';

interface PayInvoiceButtonProps {
  invoiceId: number;
  amount?: number;
  onPaymentSuccess: () => void;
}

const PayInvoiceButton = ({ invoiceId, amount = 0, onPaymentSuccess }: PayInvoiceButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-sm btn-primary fw-medium d-inline-flex align-items-center gap-1"
        onClick={() => setModalOpen(true)}
        style={{ borderRadius: '6px', fontSize: '0.78rem' }}
      >
        <i className="bi bi-qr-code-scan" /> Pay via UPI
      </button>

      {modalOpen && (
        <UpiPaymentModal
          invoiceId={invoiceId}
          amount={amount}
          onClose={() => setModalOpen(false)}
          onPaymentSuccess={() => {
            onPaymentSuccess();
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default PayInvoiceButton;