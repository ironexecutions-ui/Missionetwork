import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import logo from "../../icon.png";

export default function Header() {

    const navigate = useNavigate();

    const [logado, setLogado] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("usuario");
        setLogado(!!user);
    }, []);

    const irPerfil = () => {
        if (!logado) {
            navigate("/perfil");
        } else {
            navigate("/perfilusuario");
        }
    };
    const [esconderLogo, setEsconderLogo] = useState(false);


    return (
        <header className="hdr-container-geral">

            {/* ESQUERDA (CLICÁVEL) */}
            <div
                className="hdr-area-esquerda"
                onClick={() => navigate("/")}
            >
                <a href="/">  <img
                    src={logo}
                    className={`hdr-logo-imagem ${esconderLogo ? "logo-hidden" : ""}`}
                />  </a>
                <h1 className="hdr-titulo-principal">
                    MissioNetwork
                </h1>
            </div>

            {/* DIREITA (SOME NO MOBILE) */}
            <div className="hdr-area-direita">

                <button
                    className="hdr-btn-nav hdr-btn-perfil"
                    onClick={irPerfil}
                >
                    Perfil
                </button>
                <button
                    className="hdr-btn-nav hdr-btn-direcao"
                    onClick={() => navigate("/direcao")}
                >
                    Direção
                </button>
                {logado && (
                    <>
                        <button
                            className="hdr-btn-nav hdr-btn-missionario"
                            onClick={() => navigate("/meu-missionario/0")}
                        >
                            Missionário
                        </button>



                        <button
                            className="hdr-btn-nav hdr-btn-config"
                            onClick={() => navigate("/config")}
                        >
                            Configurações
                        </button>
                    </>
                )}

            </div>

        </header>
    );
}