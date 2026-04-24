import React from "react";
import "./carregando.css";
import logo from "./icon.png"; // ajusta o caminho

export default function LoaderPro({
    texto = "Carregando",
    subtitulo = "Preparando ambiente",
    tamanho = "md" // sm | md | lg
}) {
    return (
        <div className={`ldrpro-root ldrpro-${tamanho}`}>

            <div className="ldrpro-card">

                {/* LOGO */}
                <div className="ldrpro-logo-area">
                    <img src={logo} alt="logo" className="ldrpro-logo-img" />
                    <div className="ldrpro-logo-glow"></div>
                </div>

                {/* TEXTO */}
                <h2 className="ldrpro-texto">
                    {texto}
                    <span className="ldrpro-pontos">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </h2>

                <p className="ldrpro-subtexto">
                    {subtitulo}
                </p>

                {/* BARRA */}
                <div className="ldrpro-barra">
                    <div className="ldrpro-barra-fill"></div>
                </div>

            </div>

        </div>
    );
}