interface LoginFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  isTouched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function LoginField({
  id,
  name,
  label,
  type,
  value,
  error,
  isTouched,
  onChange,
  onBlur,
}: LoginFieldProps) {
  return (
    <div className="login-field">
      <label className="login-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="login-input"
        id={id}
        name={name}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
      {isTouched && error && (
        <p className="login-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
