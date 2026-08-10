interface PerfilFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  isTouched?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function PerfilField({
  id,
  name,
  label,
  value,
  error,
  isTouched,
  disabled,
  onChange,
  onBlur,
}: PerfilFieldProps) {
  return (
    <div className="perfil-field">
      <label className="perfil-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="perfil-input"
        id={id}
        name={name}
        type="text"
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
      {isTouched && error && (
        <p className="perfil-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
