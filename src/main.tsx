import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ReadingListProvider } from './context/ReadingListContext';
import { applyThemeVariables, darkTheme, lightTheme } from './theme/theme';
import './index.css';

const savedThemeMode = localStorage.getItem('theme-mode');
const initialTheme = savedThemeMode === 'dark'
  ? darkTheme
  : savedThemeMode === 'light'
    ? lightTheme
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? darkTheme
      : lightTheme;

applyThemeVariables(initialTheme, document.documentElement);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReadingListProvider>
      <App />
    </ReadingListProvider>
  </StrictMode>
);
