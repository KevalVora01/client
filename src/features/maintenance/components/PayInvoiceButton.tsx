import { useState } from 'react';
import { maintenanceApi } from '../api/maintenanceApi';
import StripeCheckoutModal from './StripeCheckoutModal';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError, showSuccess } from '../../../utils/toast';

interface PayInvoiceButtonProps {
  invoiceId: number;
  onPaymentSuccess: () => void;
}

const PayInvoiceButton = ({ invoiceId, onPaymentSuccess }: PayInvoiceButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{ clientSecret: string; amount: number } | null>(null);

  const handlePayClick = async () => {
    setLoading(true);
    try {
      const result = await maintenanceApi.createPaymentIntent(invoiceId);
      setCheckoutData(result);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to start payment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={handlePayClick}
        disabled={loading}
        style={{ borderRadius: '8px', fontSize: '0.9rem' }}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          'Pay Now'
        )}
      </button>

      {checkoutData && (
        <StripeCheckoutModal
          clientSecret={checkoutData.clientSecret}
          amount={checkoutData.amount}
          invoiceId={invoiceId}
          onClose={() => setCheckoutData(null)}
          onPaymentSuccess={async (paymentIntentId: string) => {
            try {
              await maintenanceApi.confirmPayment(invoiceId, paymentIntentId);
              showSuccess('Payment successful!');
            } catch {
              showError('Payment was processed but confirmation failed');
            }
            setCheckoutData(null);
            onPaymentSuccess();
          }}
        />
      )}
    </>
  );
};

export default PayInvoiceButton;