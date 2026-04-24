import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./nav.css";

import inicio from "./emojis/inicio.png";
import perfil from "./emojis/login.png";
import missionario from "./emojis/missao.png";
import direcao from "./emojis/direcao.png";
import config from "./emojis/config.png";

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const [logado, setLogado] = useState(false);

    // 🔥 SEMPRE ATUALIZA AO MUDAR ROTA
    useEffect(() => {
        const user = localStorage.getItem("usuario");
        setLogado(!!user);
    }, [location.pathname]);

    const irPerfil = () => {
        const user = localStorage.getItem("usuario");

        if (!user) {
            navigate("/perfil");
        } else {
            navigate("/perfilusuario");
        }
    };

    return (
        <div className="btm-container-geral">

            <button
                onClick={() => navigate("/")}
                className={location.pathname === "/" ? "btm-active" : ""}
            >
                <img src={inicio} alt="" />
            </button>

            <button
                onClick={irPerfil}
                className={
                    location.pathname === "/perfil" || location.pathname === "/perfilusuario"
                        ? "btm-active"
                        : ""
                }
            >
                <img src={perfil} alt="" />
            </button>

            {logado && (
                <>
                    <button
                        onClick={() => navigate("/meu-missionario/0")}
                        className={location.pathname.includes("/meu-missionario") ? "btm-active" : ""}
                    >
                        <img src={missionario} alt="" />
                    </button>

                    <button
                        onClick={() => navigate("/direcao")}
                        className={location.pathname === "/direcao" ? "btm-active" : ""}
                    >
                        <img src={direcao} alt="" />
                    </button>

                    <button
                        onClick={() => navigate("/config")}
                        className={location.pathname === "/config" ? "btm-active" : ""}
                    >
                        <img src={config} alt="" />
                    </button>
                </>
            )}

        </div>
    );
}