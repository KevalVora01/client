import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { showError } from '../../../utils/toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutModalProps {
  clientSecret: string;
  amount: number;
  invoiceId: number;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

const CheckoutForm = ({ amount, invoiceId, onClose, onPaymentSuccess }: Omit<StripeCheckoutModalProps, 'clientSecret'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { paymentIntent, error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/maintenance?invoice_id=${invoiceId}`,
      },
    });

    if (stripeError) {
      showError(stripeError.message ?? 'Payment failed');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onPaymentSuccess(paymentIntent!.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="fw-medium mb-3" style={{ fontSize: '1rem', color: '#1a1f36' }}>
        Amount to pay: ₹{amount.toFixed(2)}
      </p>

      <PaymentElement />

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={submitting}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!stripe || submitting}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

const StripeCheckoutModal = ({ clientSecret, amount, invoiceId, onClose, onPaymentSuccess }: StripeCheckoutModalProps) => {
  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-3 shadow-lg bg-white">

          <div className="modal-header border-bottom border-light-subtle px-4 pt-4 pb-3 position-relative">
            <h5 className="modal-title fw-bold fs-6" style={{ color: '#1a1f36' }}>
              Pay Maintenance
            </h5>
            <button
              className="btn btn-outline-light border border-light-subtle text-secondary rounded-2 p-0 d-flex align-items-center justify-content-center position-absolute"
              onClick={onClose}
              aria-label="Close"
              style={{ width: '30px', height: '30px', top: '1.2rem', right: '1.2rem' }}
            >
              <i className="bi bi-x fs-5" />
            </button>
          </div>

          <div className="modal-body p-4">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={amount} invoiceId={invoiceId} onClose={onClose} onPaymentSuccess={onPaymentSuccess} />
            </Elements>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutModal;