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
    const [aceitouTermos, setAceitouTermos] = useState(false);

    useEffect(() => {
        const userLocal = localStorage.getItem("usuario");

        if (!userLocal) {
            setLogado(false);
            setAceitouTermos(false);
            return;
        }

        const user = JSON.parse(userLocal);

        setLogado(true);
        setAceitouTermos(user.termos === 1);
    }, [location.pathname]);

    const irPerfil = () => {
        const user = localStorage.getItem("usuario");

        if (!user) {
            navigate("/perfil");
        } else {
            navigate("/perfilusuario");
        }
    };

    // 🔥 SE NÃO ACEITOU, NÃO MOSTRA NADA
    // 🔥 só bloqueia se estiver logado E não aceitou
    if (logado && !aceitouTermos) {
        return null;
    }

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