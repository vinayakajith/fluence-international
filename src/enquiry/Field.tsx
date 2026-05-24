import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {error
        ? <div className="field-error">{error}</div>
        : (hint && <div className="hint">{hint}</div>)}
    </div>
  );
}
