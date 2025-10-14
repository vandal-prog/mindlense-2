import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { validateEnvironment } from './lib/env';
import './index.css';

// Validate environment variables
const envCheck = validateEnvironment();
if (!envCheck.isValid) {
  console.error('Environment validation failed:', envCheck.message);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
