import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';  
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@emotion/react';
import theme from './theme/Theme.jsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>

      <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
