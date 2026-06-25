import { useApartmentSelect } from "../../hooks/useApartmentSelect";

interface ApartmentSelectProps {
  value: number;
  onChange: (val: number) => void;
  error?: string;
  showAll?: boolean;
}

const ApartmentSelect = ({ value, onChange, error }: ApartmentSelectProps) => {
  const { apartments, loading } = useApartmentSelect();

  return (
    <div>
      <select
        className={`form-select rfm-input ${error ? 'is-invalid' : ''}`}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={loading}
      >
        <option value="">
          {loading ? 'Loading apartments...' : 'Select apartment'}
        </option>
        {apartments.map((apt) => (
          <option key={apt.id} value={apt.id}>
            {apt.flateNumber} — Block {apt.block}, Floor {apt.floorNumber}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default ApartmentSelect;