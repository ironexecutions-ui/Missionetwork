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

    useEffect(() => {
        const userLocal = localStorage.getItem("usuario");

        // 🔥 NÃO LOGADO
        if (!userLocal || userLocal === "undefined" || userLocal === "null") {
            setLogado(false);
            setAceitouTermos(true);
            return;
        }

        try {
            const user = JSON.parse(userLocal);

            // 🔥 valida objeto
            if (!user || typeof user !== "object") {
                throw new Error("Usuário inválido");
            }

            setLogado(true);

            // 🔥 CORREÇÃO CRÍTICA AQUI
            const termos = Number(user?.termos);

            if (termos === 0) {
                setAceitouTermos(false);
            } else {
                setAceitouTermos(true);
            }

        } catch (err) {
            console.log("Erro ao ler localStorage:", err);

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

    // 🔥 BLOQUEIA SÓ SE LOGADO E NÃO ACEITOU
    if (logado && aceitouTermos === false) {
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