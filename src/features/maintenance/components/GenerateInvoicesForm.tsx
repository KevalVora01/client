import { useState } from 'react';
import type { GenerateInvoicesPayload } from '../types/maintenance.types';

interface GenerateInvoicesFormProps {
  loading: boolean;
  onSubmit: (payload: GenerateInvoicesPayload) => Promise<boolean>;
  onCancel: () => void;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString('en-IN', { month: 'long' }),
}));

const GenerateInvoicesForm = ({ loading, onSubmit, onCancel }: GenerateInvoicesFormProps) => {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [dueDate, setDueDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    const success = await onSubmit({ month, year, dueDate });
    if (!success) return;
  };

  return (
    <form onSubmit={handleSubmit}>

      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="alert alert-warning py-2 px-3 mb-3" style={{ fontSize: '0.8rem', borderRadius: '8px' }}>
        <i className="bi bi-info-circle me-1" />
        This will generate an invoice for every active resident. Duplicate invoices for the same month are not automatically prevented.
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Month</label>
          <select
            className="form-select shadow-none"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="col-6">
          <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Year</label>
          <input
            type="number"
            className="form-control shadow-none"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-medium" style={{ fontSize: '0.85rem' }}>Due Date</label>
        <input
          type="date"
          className="form-control shadow-none"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ borderRadius: '8px', fontSize: '0.9rem' }}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          {loading ? 'Generating...' : 'Generate Invoices'}
        </button>
      </div>

    </form>
  );
};

export default GenerateInvoicesForm;