import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider, useAuth } from './lib/supabase/auth-context';
import { PreferencesProvider } from './lib/preferences-context';
import { startProgressSync } from './lib/supabase/progress-sync';
import './styles/index.css';
import './styles/academy.css';

// eslint-disable-next-line react-refresh/only-export-components
function AccountApp() {
  const { workspaceId, isLoading, user } = useAuth();
  const userId = user?.id;
  useEffect(() => startProgressSync(userId), [userId]);
  if (isLoading) return <p role="status">Đang mở không gian học tập…</p>;
  return <PreferencesProvider key={workspaceId}><App /></PreferencesProvider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AccountApp />
    </AuthProvider>
  </React.StrictMode>
);
