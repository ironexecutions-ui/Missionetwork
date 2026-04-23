import React from "react";
import "./loader.css";
import logo from "./logo.png";

export default function Loader() {
    return (
        <div className="ldr-root">

            <div className="ldr-card">

                {/* LOGO + MARCA */}
                <div className="ldr-brand">
                    <div className="ldr-logo-wrap">
                        <img src={logo} alt="MissioNetwork" className="ldr-logo" />
                        <div className="ldr-logo-glow"></div>
                    </div>

                    <h1 className="ldr-title">
                        Missio<span>Network</span>
                    </h1>
                </div>

                {/* TEXTO */}
                <p className="ldr-subtitle">
                    Inicializando ambiente
                </p>

                {/* BARRA */}
                <div className="ldr-progress">
                    <div className="ldr-progress-bar"></div>
                </div>

                {/* DOTS */}
                <div className="ldr-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

        </div>
    );
}