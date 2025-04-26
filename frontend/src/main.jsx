// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoute from './routes/AppRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  </StrictMode>
);
