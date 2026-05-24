import { useState, useRef, useEffect, useId } from 'react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

interface StateSelectProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function StateSelect({ value, onChange, error }: StateSelectProps) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const [cursor, setCursor] = useState(-1);
  const containerRef        = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);
  const listRef             = useRef<HTMLUListElement>(null);
  const id                  = useId();

  const filtered = query.trim()
    ? STATES.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : STATES;

  const select = (state: string) => {
    onChange(state);
    setQuery('');
    setOpen(false);
    setCursor(-1);
  };

  const handleFocus = () => { setOpen(true); setCursor(-1); };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setQuery('');
      setCursor(-1);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true); return; }
    if (e.key === 'Escape') { setOpen(false); setQuery(''); setCursor(-1); inputRef.current?.blur(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && cursor >= 0 && filtered[cursor]) { e.preventDefault(); select(filtered[cursor]); }
  };

  // Scroll the highlighted item into view
  useEffect(() => {
    if (cursor >= 0 && listRef.current) {
      const item = listRef.current.children[cursor] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [cursor]);

  const displayValue = open ? query : (value || '');

  return (
    <div
      ref={containerRef}
      className={`state-select ${open ? 'open' : ''} ${error ? 'has-err' : ''}`}
      onBlur={handleBlur}
    >
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        placeholder={value || 'Type to search…'}
        value={displayValue}
        onChange={e => { setQuery(e.target.value); setOpen(true); setCursor(-1); }}
        onFocus={handleFocus}
        onKeyDown={handleKey}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        aria-activedescendant={cursor >= 0 ? `${id}-opt-${cursor}` : undefined}
        role="combobox"
      />
      {value && !open && (
        <button
          type="button"
          className="state-clear"
          tabIndex={-1}
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Clear state"
        >✕</button>
      )}
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          className="state-dropdown"
          role="listbox"
        >
          {filtered.map((s, i) => (
            <li
              key={s}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={s === value}
              className={`state-opt ${s === value ? 'sel' : ''} ${i === cursor ? 'cur' : ''}`}
              onMouseDown={e => { e.preventDefault(); select(s); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="state-dropdown state-empty">No match</div>
      )}
    </div>
  );
}
