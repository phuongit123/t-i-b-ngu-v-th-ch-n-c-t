import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './lib/supabase/auth-context';
import { PreferencesProvider } from './lib/preferences-context';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </AuthProvider>
  </React.StrictMode>
);
