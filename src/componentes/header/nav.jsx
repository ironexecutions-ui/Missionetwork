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

        if (!userLocal || userLocal === "undefined" || userLocal === "null") {
            setLogado(false);
            setAceitouTermos(true);
            return;
        }

        try {
            const user = JSON.parse(userLocal);

            setLogado(true);

            // 🔥 CORREÇÃO: força número
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

    return (
        <div className="btm-container-geral">

            <button
                onClick={() => navigate("/")}
                className={location.pathname === "/" ? "btm-active" : ""}
            >
                <img src={inicio} alt="" />
                <span className="sub" >Inicio</span>
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
                <span className="sub" >Perfil</span>
            </button>
            <button
                onClick={() => navigate("/direcao")}
                className={location.pathname === "/direcao" ? "btm-active" : ""}
            >
                <img src={direcao} alt="" />
                <span className="sub" >Sistema</span>
            </button>
            {/* 🔥 só esconde as opções, não o componente inteiro */}
            {logado && aceitouTermos !== false && (
                <>
                    <button
                        onClick={() => navigate("/meu-missionario/0")}
                        className={location.pathname.includes("/meu-missionario") ? "btm-active" : ""}
                    >
                        <img src={missionario} alt="" />
                        <span className="sub" >Missionario</span>
                    </button>



                    <button
                        onClick={() => navigate("/config")}
                        className={location.pathname === "/config" ? "btm-active" : ""}
                    >
                        <img src={config} alt="" />
                        <span className="sub" >Configurações</span>
                    </button>
                </>
            )}

        </div>
    );
}