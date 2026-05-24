import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { supabase } from './lib/supabase';

async function bootstrap() {
  // getUser() validates the JWT server-side and refreshes it if expired.
  // getSession() only reads from localStorage and can return a stale token
  // where auth.uid() evaluates to NULL inside PostgreSQL.
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) console.error('Anonymous sign-in failed:', error.message);
    }
  } catch (err) {
    // Network error — app still mounts; file uploads will fail gracefully
    // with a user-visible warning rather than blocking the whole form.
    console.error('Auth bootstrap failed:', err);
  }

  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root element');

  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

bootstrap();
