import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { VisitorProvider } from './core/visitor/VisitorContext.tsx';
import { initMicrosoftClarity } from './site/tracking/clarity.ts';
import './index.css';

initMicrosoftClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <VisitorProvider>
        <App />
      </VisitorProvider>
    </BrowserRouter>
  </StrictMode>
);
