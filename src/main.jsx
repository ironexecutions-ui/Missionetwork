import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./authcontext";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>

    <GoogleOAuthProvider
      clientId="337060969671-u0kvppbs1bpl70f0i4cefghb6ev7v157.apps.googleusercontent.com"
    >

      <AuthProvider>
        <App />
      </AuthProvider>

    </GoogleOAuthProvider>

  </StrictMode>
);