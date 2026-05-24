import { useState } from 'react';
import { FluenceWordmark } from '../icons';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">

        <div className="login-brand">
          <FluenceWordmark height={36} />
          <div className="login-brand-text">
            <span className="login-brand-name">Fluence International</span>
            <span className="login-brand-sub">Admissions dashboard</span>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-head">
          <h1 className="login-title">Sign in</h1>
          <p className="login-sub">Admin access only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-pw">Password</label>
            <input
              id="login-pw"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

      </div>
    </div>
  );
}
