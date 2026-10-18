export interface FormOptionalLabelProps {
  label: string;
  optionalText?: string;
}

export const FormOptionalLabel = ({
  label,
  optionalText = '(Optional)',
}: FormOptionalLabelProps) => (
  <span className="text-label text-foreground-subtle">
    <span className="font-medium text-surface-foreground">{label}</span>{' '}
    <span className="font-normal text-foreground-subtle">{optionalText}</span>
  </span>
);
