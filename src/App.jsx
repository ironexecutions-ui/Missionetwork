import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./App.css";

// COMPONENTES
import Header from "./componentes/header/header";
import Inicio from "./componentes/inicio/inicio";
import Perfil from "./componentes/perfil/perfil";
import Missionario from "./componentes/missionario/missionario";
import PerfilUsuario from "./componentes/perfil/perfilusuario";
import Direcao from "./componentes/direcao/direcao";
import Config from "./componentes/configuracoes/config";
import Visita from "./componentes/visita/visita";
import Postagem from "./componentes/postagem/postagem";
import BottomNav from "./componentes/header/nav";
// LOADER
import Loader from "./loader";

// 🔥 LAYOUT COM HEADER
function LayoutComHeader({ children }) {
  return (
    <>
      <Header />
      {children}
      {/* ❌ REMOVE ISSO */}
      {/* <BottomNav /> */}
    </>
  );
}

// 🔥 CONTROLE DE ROTA + LOADER
function AppRoutes() {
  const location = useLocation();
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setCarregando(true);

    const timer = setTimeout(() => {
      setCarregando(false);
    }, 800); // tempo do loader

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {carregando && <Loader />}

      <Routes>

        {/* ROTAS COM HEADER */}
        <Route
          path="/"
          element={
            <LayoutComHeader>
              <Inicio />
            </LayoutComHeader>
          }
        />

        <Route
          path="/perfil"
          element={
            <LayoutComHeader>
              <Perfil />
            </LayoutComHeader>
          }
        />

        <Route
          path="/direcao"
          element={
            <LayoutComHeader>
              <Direcao />
            </LayoutComHeader>
          }
        />

        <Route
          path="/config"
          element={
            <LayoutComHeader>
              <Config />
            </LayoutComHeader>
          }
        />

        {/* SEM HEADER */}
        <Route path="/meu-missionario/:id" element={<Missionario />} />
        <Route path="/visita/:id" element={<Visita />} />
        <Route path="/postagem/:id" element={<Postagem />} />

        {/* DINÂMICA */}
        <Route path="/:nome" element={<PerfilUsuario />} />

      </Routes>
    </>
  );
}

// 🔥 APP PRINCIPAL
export default function App() {
  return (
    <GoogleOAuthProvider clientId="337060969671-u0kvppbs1bpl70f0i4cefghb6ev7v157.apps.googleusercontent.com">
      <BrowserRouter>
        <AppRoutes />
        <BottomNav />

      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}