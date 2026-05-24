import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './lib/auth';
import { supabase } from './lib/supabase';

async function bootstrap() {
  // Guarantee auth.uid() is non-null before any component mounts.
  // Without this, RLS policies that check auth.uid() = user_id fail silently.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) console.error('Anonymous sign-in failed:', error.message);
  }

  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root element');

  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}

bootstrap();
