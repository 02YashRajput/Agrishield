import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/Theme.jsx";
import i18n from "./utils/i18.js";
import { I18nextProvider } from "react-i18next";
import { LanguageProvider } from "./context/LanguageContext.js";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </I18nextProvider>
  </BrowserRouter>
);
