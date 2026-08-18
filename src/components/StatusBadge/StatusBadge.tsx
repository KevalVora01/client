export type StatusVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'secondary'
  | 'info'
  | 'primary';

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-success-subtle text-success border-success-subtle',
  danger: 'bg-danger-subtle text-danger border-danger-subtle',
  warning: 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
  secondary: 'bg-secondary-subtle text-secondary border-secondary-subtle',
  info: 'bg-info-subtle text-info border-info-subtle',
  primary: 'bg-primary-subtle text-primary border-primary-subtle',
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ variant, label, size = 'md' }: StatusBadgeProps) => (
  <span
    className={`badge rounded-pill ${VARIANT_CLASSES[variant]} d-inline-flex align-items-center text-nowrap ${
      size === 'sm' ? 'px-2 py-1' : 'px-3 py-2'
    }`}
    style={{ fontSize: size === 'sm' ? '0.7rem' : '0.72rem', fontWeight: 600, borderWidth: 1 }}
  >
    {label}
  </span>
);

export default StatusBadge;
