import { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { Enquiry } from './enquiry/Enquiry';
import { Admin } from './admin/Admin';
import type { ProgramKey } from './data';

export type View = 'home' | 'enquiry' | 'admin';

const VIEWS: ReadonlyArray<View> = ['home', 'enquiry', 'admin'];

export interface GoOptions {
  university?: string;
  program?: ProgramKey;
}

export type Go = (view: View, opts?: GoOptions) => void;

function readHashView(): View {
  const h = window.location.hash.replace('#', '') as View;
  return (VIEWS as readonly string[]).includes(h) ? h : 'home';
}

export function App() {
  const [view, setView] = useState<View>(readHashView);
  const [preselectUniversity, setPreselectUniversity] = useState('');
  const [preselectProgram, setPreselectProgram] = useState<ProgramKey | ''>('');

  const go: Go = (v, opts = {}) => {
    const target: View = (VIEWS as readonly string[]).includes(v) ? v : 'home';
    if (opts.university !== undefined) setPreselectUniversity(opts.university);
    if (opts.program !== undefined)    setPreselectProgram(opts.program);
    // Clear residual preselects when explicitly going home so a fresh visit
    // doesn't pick up the last user's choice.
    if (target === 'home') {
      setPreselectUniversity('');
      setPreselectProgram('');
    }
    setView(target);
    window.location.hash = target === 'home' ? '' : target;
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onHash = () => setView(readHashView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (view === 'admin')   return <Admin go={go} />;
  if (view === 'enquiry') return <Enquiry go={go} preselectUniversity={preselectUniversity} preselectProgram={preselectProgram} />;
  return <Landing go={go} />;
}
