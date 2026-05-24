import { Icon } from '../icons';
import { CITY_COLOR } from '../data';
import type { Partner } from '../data';

interface CollegePickerProps {
  selected: string;
  universities: Partner[];
  hasProgram: boolean;
  onPick: (name: string) => void;
}

export function CollegePicker({ selected, universities, hasProgram, onPick }: CollegePickerProps) {
  return (
    <div className="college-picker">
      <div className="college-picker-head">
        <div>
          <div className="picker-label">Choose a college</div>
          <div className="picker-meta">
            {!hasProgram
              ? 'Pick a program above to see matching partner universities.'
              : `${universities.length} partner ${universities.length === 1 ? 'university matches' : 'universities match'} your filters.`}
          </div>
        </div>
        {selected && (
          <button type="button" className="picker-clear" onClick={() => onPick('')}>
            Clear selection
          </button>
        )}
      </div>

      <button
        type="button"
        className={`pick-card pick-recommend ${!selected ? 'active' : ''}`}
        onClick={() => onPick('')}
        aria-pressed={!selected}
      >
        <div className="pick-recommend-icon"><Icon.Check size={16} /></div>
        <div>
          <div className="pick-card-title">Recommend the best fit for me</div>
          <div className="pick-card-sub">Our counsellor will match you to the right partner based on your profile.</div>
        </div>
      </button>

      {!hasProgram ? (
        <div className="pick-empty">Pick a program above to start.</div>
      ) : universities.length === 0 ? (
        <div className="pick-empty">No partner universities match this combination. Try removing the city filter or pick a different program.</div>
      ) : (
        <div className="pick-grid">
          {universities.map(u => {
            const isOn = selected === u.name;
            const color = CITY_COLOR[u.city];
            return (
              <button
                type="button"
                key={u.name}
                className={`pick-card ${isOn ? 'active' : ''}`}
                style={{ '--city-color': color } as React.CSSProperties}
                onClick={() => onPick(isOn ? '' : u.name)}
                aria-pressed={isOn}
              >
                <div className="pick-card-loc">{u.city}</div>
                <div className="pick-card-title">{u.name}</div>
                <div className="pick-card-progs">
                  {u.programs.slice(0, 3).map(pr => (
                    <span className="prog-tag" key={pr}>{pr}</span>
                  ))}
                  {u.programs.length > 3 && (
                    <span className="prog-tag">+{u.programs.length - 3}</span>
                  )}
                </div>
                <div className="pick-card-check"><Icon.Check size={14} /></div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
