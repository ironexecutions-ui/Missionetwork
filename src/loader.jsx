import React from "react";
import "./loader.css";
import logo from "./icon.png";

export default function Loader() {
    return (
        <div className="ldr-root">

            <div className="ldr-card">

                {/* BRAND */}
                <div className="ldr-brand">

                    <div className="ldr-logo-wrap">
                        <img
                            src={logo}
                            alt="MissioNetwork"
                            className="ldr-logo-img"
                        />
                        <div className="ldr-logo-glow"></div>
                    </div>

                    <h1 className="ldr-title">
                        Missio<span className="ldr-title-highlight">Network</span>
                    </h1>

                </div>

                {/* TEXTO */}
                <p className="ldr-subtitle">
                    Inicializando ambiente
                </p>

                {/* PROGRESS */}
                <div className="ldr-progress">
                    <div className="ldr-progress-track">
                        <div className="ldr-progress-bar"></div>
                    </div>
                </div>

                {/* DOTS */}
                <div className="ldr-dots">
                    <span className="ldr-dot"></span>
                    <span className="ldr-dot"></span>
                    <span className="ldr-dot"></span>
                </div>

            </div>

        </div>
    );
}