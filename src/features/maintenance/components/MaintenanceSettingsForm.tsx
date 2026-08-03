import { useState } from 'react';
import { showError, showSuccess } from '../../../utils/toast';

interface MaintenanceSettingsFormProps {
  currentAmount: number | undefined;
  updating: boolean;
  onSubmit: (amount: number) => Promise<boolean>;
}

const MaintenanceSettingsForm = ({ currentAmount, updating, onSubmit }: MaintenanceSettingsFormProps) => {
  const [amount, setAmount] = useState<string>(currentAmount !== undefined ? String(currentAmount) : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      showError('Amount must be greater than 0');
      return;
    }

    const ok = await onSubmit(parsed);
    if (ok) {
      showSuccess('Saved');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-end gap-2">
      <div className="flex-grow-1" style={{ minWidth: '160px', maxWidth: '200px' }}>
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
        style={{ borderRadius: '8px', fontSize: '0.875rem', height: '38px', whiteSpace: 'nowrap' }}
      >
        {updating ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          'Save'
        )}
      </button>
    </form>
  );
};

export default MaintenanceSettingsForm;