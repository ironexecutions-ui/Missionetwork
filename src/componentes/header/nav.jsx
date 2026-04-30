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
    const [aceitouTermos, setAceitouTermos] = useState(true);

    const [foto, setFoto] = useState(null);
    const [nome, setNome] = useState("");

    useEffect(() => {
        const userLocal = localStorage.getItem("usuario");

        if (!userLocal || userLocal === "undefined" || userLocal === "null") {
            setLogado(false);
            setAceitouTermos(true);
            setFoto(null);
            setNome("");
            return;
        }

        try {
            const user = JSON.parse(userLocal);

            setLogado(true);
            setFoto(user?.foto || null);
            setNome(user?.nome_completo || "");

            const termos = Number(user?.termos);
            setAceitouTermos(termos !== 0);

        } catch {
            localStorage.removeItem("usuario");
            setLogado(false);
            setAceitouTermos(true);
        }

    }, [location.pathname]);

    const irPerfil = () => {
        const user = localStorage.getItem("usuario");

        if (!user || user === "undefined" || user === "null") {
            navigate("/perfil");
        } else {
            navigate("/perfilusuario");
        }
    };

    const inicial = nome ? nome.charAt(0).toUpperCase() : "";

    return (
        <div className="btm-container-geral">

            <button
                onClick={() => navigate("/")}
                className={location.pathname === "/" ? "btm-active" : ""}
            >
                <img src={inicio} alt="" className="btm-icon" />
                <span className="sub">Inicio</span>
            </button>

            <button
                onClick={irPerfil}
                className={
                    location.pathname === "/perfil" || location.pathname === "/perfilusuario"
                        ? "btm-active"
                        : ""
                }
            >
                {logado ? (
                    foto ? (
                        <img style={{ width: "40px", height: "40px" }} src={foto} alt="perfil" className="btm-icon" />
                    ) : (
                        <div className="btm-icon btm-avatar">
                            {inicial}
                        </div>
                    )
                ) : (
                    <img src={perfil} alt="" className="btm-icon" />
                )}

                <span style={{ paddingTop: "10px" }} className="sub">
                    {logado ? "Perfil" : "Login"}
                </span>
            </button>

            <button
                onClick={() => navigate("/direcao")}
                className={location.pathname === "/direcao" ? "btm-active" : ""}
            >
                <img src={direcao} alt="" className="btm-icon" />
                <span className="sub">Sistema</span>
            </button>

            {logado && aceitouTermos && (
                <>
                    <button
                        onClick={() => navigate("/meu-missionario/0")}
                        className={location.pathname.includes("/meu-missionario") ? "btm-active" : ""}
                    >
                        <img src={missionario} alt="" className="btm-icon" />
                        <span className="sub">Missionario</span>
                    </button>

                    <button
                        onClick={() => navigate("/config")}
                        className={location.pathname === "/config" ? "btm-active" : ""}
                    >
                        <img src={config} alt="" className="btm-icon" />
                        <span className="sub">Configurações</span>
                    </button>
                </>
            )}

        </div>
    );
}