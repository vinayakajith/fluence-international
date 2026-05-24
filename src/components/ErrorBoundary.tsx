import { Component } from 'react';
import type { ReactNode } from 'react';
import { CONTACT } from '../data';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled render error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '40px 20px', background: 'var(--paper)',
        }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ color: 'var(--ink-2)', marginBottom: 24, lineHeight: 1.6 }}>
              An unexpected error occurred. Please reload the page. If the problem persists,
              contact us at <a href={CONTACT.emailHref}>{CONTACT.email}</a>.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
