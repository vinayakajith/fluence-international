import { useRef, useState } from 'react';
import { Icon } from '../icons';
import { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from '../data';
import { fmtFileSize } from '../utils/format';

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  label: string;
  hint?: string;
  error?: string;
}

export function FileUpload({ value, onChange, label, hint, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState('');
  const has = !!value;

  const handle = (file: File | null) => {
    if (!file) { onChange(null); return; }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setLocalError('Only PDF, JPG or PNG files are accepted.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setLocalError(`File is too large (${fmtFileSize(file.size)}). Max ${fmtFileSize(MAX_FILE_BYTES)}.`);
      return;
    }
    setLocalError('');
    onChange(file);
  };

  const shownError = localError || error;

  return (
    <>
      <div
        className={`upload ${has ? 'has' : ''} ${shownError ? 'err' : ''}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
      >
        <div className="upload-info">
          <span className="upload-icon">
            {has ? <Icon.Check size={18} /> : <Icon.Upload size={18} />}
          </span>
          <div className="upload-text">
            <strong>{has && value ? value.name : label}</strong>
            <span>{has && value ? `${fmtFileSize(value.size)} · uploaded` : hint}</span>
          </div>
        </div>
        <span className="upload-action">{has ? 'Replace' : 'Choose file →'}</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          style={{ display: 'none' }}
          onChange={(e) => handle(e.target.files?.[0] ?? null)}
        />
      </div>
      {shownError && <div className="field-error" style={{ marginTop: 6 }}>{shownError}</div>}
    </>
  );
}
