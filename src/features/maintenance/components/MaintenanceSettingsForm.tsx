import { useState } from 'react';

interface MaintenanceSettingsFormProps {
  currentAmount: number | undefined;
  updating: boolean;
  onSubmit: (amount: number) => Promise<boolean>;
}

const MaintenanceSettingsForm = ({ currentAmount, updating, onSubmit }: MaintenanceSettingsFormProps) => {
  const [amount, setAmount] = useState<string>(currentAmount !== undefined ? String(currentAmount) : '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const ok = await onSubmit(parsed);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-end gap-2">
      <div className="flex-grow-1" style={{ maxWidth: '200px' }}>
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>
          Monthly Maintenance Amount (₹)
        </label>
        <input
          type="number"
          className="form-control shadow-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={updating}
        style={{ borderRadius: '8px', fontSize: '0.875rem', height: '38px' }}
      >
        {updating ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          'Save'
        )}
      </button>

      {error && <span className="text-danger" style={{ fontSize: '0.8rem' }}>{error}</span>}
      {success && <span className="text-success" style={{ fontSize: '0.8rem' }}><i className="bi bi-check-circle me-1" />Saved</span>}
    </form>
  );
};

export default MaintenanceSettingsForm;