import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

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
import Pedajo from "./componentes/verifica/verifica";
import Painel from "./componentes/painel/painel";
import Camera from "./componentes/painel/componentes/renderizar/camera/camera";
// LOADER
import Loader from "./loader";

// 🔥 LAYOUT COM HEADER
function LayoutComHeader({ children }) {

  return (
    <>
      <Header />
      {children}
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

    }, 800);

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
          path="/perfilusuario/pedajo"
          element={<Pedajo />}
        />
        <Route
          path="/camera-ctm/:token"
          element={<Camera />}
        />

        <Route
          path="/painel"
          element={<Painel />}
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
        <Route
          path="/meu-missionario/:id"
          element={<Missionario />}
        />

        <Route
          path="/visita/:id"
          element={<Visita />}
        />

        <Route
          path="/postagem/:id"
          element={<Postagem />}
        />

        {/* DINÂMICA */}
        <Route
          path="/:nome"
          element={<PerfilUsuario />}
        />

      </Routes>
    </>
  );
}

// 🔥 COMPONENTE DO NAV
function ControleNav() {

  const location = useLocation();

  const [mostrarNav, setMostrarNav] = useState(true);

  useEffect(() => {

    if (
      location.pathname === "/painel" ||
      location.pathname.startsWith("/camera-ctm/")
    ) {

      setMostrarNav(false);

    } else {

      setMostrarNav(true);

    }

  }, [location.pathname]);

  if (!mostrarNav) {

    return null;

  }

  return <BottomNav />;
}

// 🔥 APP PRINCIPAL
export default function App() {

  return (
    <GoogleOAuthProvider clientId="337060969671-u0kvppbs1bpl70f0i4cefghb6ev7v157.apps.googleusercontent.com">

      <BrowserRouter>

        <AppRoutes />

        <ControleNav />

      </BrowserRouter>

    </GoogleOAuthProvider>
  );
}