
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply theme from localStorage on initial load
const theme = localStorage.getItem('theme') || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Add the theme class to the document
if (theme === 'dark' || (theme === 'system' && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById("root")!).render(<App />);
