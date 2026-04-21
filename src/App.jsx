import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Header from "./componentes/header/header";
import Inicio from "./componentes/inicio/inicio";
import Perfil from "./componentes/perfil/perfil";
import Missionario from "./componentes/missionario/missionario";
import PerfilUsuario from "./componentes/perfil/perfilusuario";
import Direcao from "./componentes/direcao/direcao";
import Config from "./componentes/config/config";
import Visita from "./componentes/visita/visita";
import Postagem from "./componentes/postagem/postagem";
export default function App() {
  return (
    <GoogleOAuthProvider clientId="337060969671-u0kvppbs1bpl70f0i4cefghb6ev7v157.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>

          {/* 🔥 INÍCIO COM HEADER */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Inicio />
              </>
            }
          />

          {/* 🔥 OUTRAS ROTAS SEM HEADER */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/meu-missionario/:id" element={<Missionario />} />
          <Route path="/direcao" element={<Direcao />} />
          <Route path="/config" element={<Config />} />
          <Route path="/visita/:id" element={<Visita />} />
          {/* 🔥 ROTA DINÂMICA */}
          <Route path="/:nome" element={<PerfilUsuario />} />
          <Route path="/postagem/:id" element={<Postagem />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}