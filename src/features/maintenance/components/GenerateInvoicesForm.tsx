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
  const [extraCharges, setExtraCharges] = useState<{ label: string; amount: string }[]>([]);
  const [errors, setErrors] = useState<{ dueDate?: string; extraCharges?: { label?: string; amount?: string }[] }>({});
  const [touched, setTouched] = useState<{ dueDate?: boolean; extraCharges?: { label?: boolean; amount?: boolean }[] }>({});

  const handleDueDateBlur = () => {
    setTouched(prev => ({ ...prev, dueDate: true }));
    setErrors(prev => ({ ...prev, dueDate: dueDate ? undefined : 'Due date is required' }));
  };

  const handleChargeBlur = (index: number, field: 'label' | 'amount', value: string) => {
    const updatedTouched = [...(touched.extraCharges ?? [])];
    updatedTouched[index] = { ...(updatedTouched[index] ?? {}), [field]: true };
    setTouched(prev => ({ ...prev, extraCharges: updatedTouched }));

    const charge = extraCharges[index];
    const labelVal = field === 'label' ? value : charge.label;
    const amountVal = field === 'amount' ? value : charge.amount;

    const chargeErr: { label?: string; amount?: string } = {};
    const trimmedLabel = labelVal.trim();
    const trimmedAmount = amountVal.trim();

    if (trimmedLabel !== '' || trimmedAmount !== '') {
      if (trimmedLabel === '') {
        chargeErr.label = 'Description is required';
      }
      if (trimmedAmount === '') {
        chargeErr.amount = 'Amount is required';
      } else {
        const val = Number(trimmedAmount);
        if (isNaN(val) || val <= 0) {
          chargeErr.amount = 'Amount must be greater than 0';
        }
      }
    }

    const updatedErrors = [...(errors.extraCharges ?? [])];
    updatedErrors[index] = chargeErr;
    setErrors(prev => ({ ...prev, extraCharges: updatedErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTouchedExtra = extraCharges.map(() => ({ label: true, amount: true }));
    setTouched({ dueDate: true, extraCharges: newTouchedExtra });

    const dueDateErr = dueDate ? undefined : 'Due date is required';

    const extraChargesErrors: { label?: string; amount?: string }[] = [];
    let hasExtraError = false;

    extraCharges.forEach((charge, index) => {
      const chargeErr: { label?: string; amount?: string } = {};
      const trimmedLabel = charge.label.trim();
      const trimmedAmount = charge.amount.trim();

      if (trimmedLabel !== '' || trimmedAmount !== '') {
        if (trimmedLabel === '') {
          chargeErr.label = 'Description is required';
          hasExtraError = true;
        }
        if (trimmedAmount === '') {
          chargeErr.amount = 'Amount is required';
          hasExtraError = true;
        } else {
          const val = Number(trimmedAmount);
          if (isNaN(val) || val <= 0) {
            chargeErr.amount = 'Amount must be greater than 0';
            hasExtraError = true;
          }
        }
      }
      extraChargesErrors[index] = chargeErr;
    });

    setErrors({ dueDate: dueDateErr, extraCharges: extraChargesErrors });

    if (dueDateErr || hasExtraError) {
      return;
    }

    const validatedExtraCharges = extraCharges
      .filter((c) => c.label.trim() !== '' && c.amount.trim() !== '')
      .map((c) => ({
        label: c.label.trim(),
        amount: Number(c.amount),
      }));

    const success = await onSubmit({
      month,
      year,
      dueDate,
      extraCharges: validatedExtraCharges.length > 0 ? validatedExtraCharges : undefined,
    });
    
    if (success) {
      setExtraCharges([]);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>

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

      <div className="mb-3">
        <label className="form-label fw-medium text-secondary small mb-1">Due Date <span className="text-danger">*</span></label>
        <input
          type="date"
          className={`form-control shadow-none rounded-2 text-dark ${touched.dueDate && errors.dueDate ? 'is-invalid' : ''}`}
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (touched.dueDate) {
              setErrors(prev => ({ ...prev, dueDate: e.target.value ? undefined : 'Due date is required' }));
            }
          }}
          onBlur={handleDueDateBlur}
          style={{
            borderRadius: '8px',
            fontSize: '0.9rem',
            borderColor: touched.dueDate && errors.dueDate ? '#dc3545' : '#e5e7eb'
          }}
        />
        {touched.dueDate && errors.dueDate && (
          <div className="invalid-feedback d-block text-danger mt-1" style={{ fontSize: '0.8rem' }}>
            {errors.dueDate}
          </div>
        )}
      </div>

      {/* ── Extra Charges Section ── */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <label className="form-label fw-medium mb-0" style={{ fontSize: '0.85rem' }}>
            Extra Charges (Optional)
          </label>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 py-1 px-2"
            onClick={() => {
              setExtraCharges([...extraCharges, { label: '', amount: '' }]);
              const newTouched = [...(touched.extraCharges ?? []), { label: false, amount: false }];
              setTouched(prev => ({ ...prev, extraCharges: newTouched }));
            }}
            style={{ fontSize: '0.78rem', borderRadius: '6px' }}
          >
            <i className="bi bi-plus-lg" /> Add Charge
          </button>
        </div>

        {extraCharges.length > 0 && (
          <div className="d-flex flex-column gap-3 pe-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {extraCharges.map((charge, index) => {
              const chargeError = errors.extraCharges?.[index];
              const chargeTouched = touched.extraCharges?.[index];

              return (
                <div key={index} className="d-flex flex-column gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        placeholder="Description (e.g. Water, Late Fee)"
                        className={`form-control form-control-sm shadow-none ${chargeTouched?.label && chargeError?.label ? 'is-invalid' : ''}`}
                        value={charge.label}
                        onChange={(e) => {
                          const updated = [...extraCharges];
                          updated[index].label = e.target.value;
                          setExtraCharges(updated);
                          if (chargeTouched?.label) {
                            handleChargeBlur(index, 'label', e.target.value);
                          }
                        }}
                        onBlur={(e) => handleChargeBlur(index, 'label', e.target.value)}
                        style={{
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          borderColor: chargeTouched?.label && chargeError?.label ? '#dc3545' : '#e5e7eb'
                        }}
                      />
                    </div>
                    <div style={{ width: '130px' }}>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-light-subtle" style={{ fontSize: '0.8rem' }}>₹</span>
                        <input
                          type="number"
                          placeholder="Amount"
                          className={`form-control shadow-none ${chargeTouched?.amount && chargeError?.amount ? 'is-invalid' : ''}`}
                          value={charge.amount}
                          onChange={(e) => {
                            const updated = [...extraCharges];
                            updated[index].amount = e.target.value;
                            setExtraCharges(updated);
                            if (chargeTouched?.amount) {
                              handleChargeBlur(index, 'amount', e.target.value);
                            }
                          }}
                          onBlur={(e) => handleChargeBlur(index, 'amount', e.target.value)}
                          style={{
                            borderRadius: '0 6px 6px 0',
                            fontSize: '0.8rem',
                            borderColor: chargeTouched?.amount && chargeError?.amount ? '#dc3545' : '#e5e7eb'
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger border-0 rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                      onClick={() => {
                        setExtraCharges(extraCharges.filter((_, i) => i !== index));
                        if (errors.extraCharges) {
                          setErrors(prev => ({
                            ...prev,
                            extraCharges: prev.extraCharges?.filter((_, i) => i !== index)
                          }));
                        }
                        if (touched.extraCharges) {
                          setTouched(prev => ({
                            ...prev,
                            extraCharges: prev.extraCharges?.filter((_, i) => i !== index)
                          }));
                        }
                      }}
                      style={{ width: '28px', height: '28px' }}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                  {((chargeTouched?.label && chargeError?.label) || (chargeTouched?.amount && chargeError?.amount)) && (
                    <div className="d-flex flex-column gap-1 ps-1">
                      {chargeTouched?.label && chargeError?.label && (
                        <div className="text-danger small" style={{ fontSize: '0.75rem' }}>{chargeError.label}</div>
                      )}
                      {chargeTouched?.amount && chargeError?.amount && (
                        <div className="text-danger small" style={{ fontSize: '0.75rem' }}>{chargeError.amount}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="d-flex gap-2 justify-content-end border-top border-light-subtle pt-3">
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
          className="btn btn-primary d-flex align-items-center gap-1"
          disabled={loading}
          style={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            'Generate Invoices'
          )}
        </button>
      </div>

    </form>
  );
};

export default GenerateInvoicesForm;