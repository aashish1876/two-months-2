import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { initStorage } from './utils/storage';
import './index.css';

async function boot() {
  try { await initStorage(); } catch (e) { console.warn('Storage init error:', e); }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();
