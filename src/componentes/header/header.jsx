import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import logo from "../../logo.png";
//import
export default function Header() {

    const navigate = useNavigate();

    const irPerfil = () => {
        const user = localStorage.getItem("usuario");

        if (!user) {
            navigate("/perfil");
        } else {
            navigate("/perfilusuario");
        }
    };

    return (
        <header className="hdr-container-geral">

            {/* 🔥 ESQUERDA */}
            <div className="hdr-area-esquerda">
                <img
                    src={logo}
                    alt="logo"
                    className="hdr-logo-imagem"
                />
                <h1 className="hdr-titulo-principal">
                    MissioNetwork
                </h1>
            </div>

            {/* 🔥 DIREITA */}
            <div className="hdr-area-direita">

                <button
                    className="hdr-btn-nav hdr-btn-perfil"
                    onClick={irPerfil}
                >
                    Perfil
                </button>

                <button
                    className="hdr-btn-nav hdr-btn-missionario"
                    onClick={() => navigate("/meu-missionario/0")}
                >
                    Missionário
                </button>

                <button
                    className="hdr-btn-nav hdr-btn-direcao"
                    onClick={() => navigate("/direcao")}
                >
                    Direção
                </button>

                {/* 🔥 NOVO BOTÃO CONFIG */}
                <button
                    className="hdr-btn-nav hdr-btn-config"
                    onClick={() => navigate("/config")}
                >
                    Configurações
                </button>

            </div>

        </header>
    );
}