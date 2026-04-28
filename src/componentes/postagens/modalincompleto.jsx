import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./modallogin.css";

export default function ModalPerfilIncompleto({ fechar }) {

    const navigate = useNavigate();

    const irParaPerfil = () => {
        fechar();
        navigate("/config");
    };

    useEffect(() => {
        document.body.classList.add("modal-aberto");
        return () => document.body.classList.remove("modal-aberto");
    }, []);

    return createPortal(
        <div className="modalLogin-overlay" onClick={fechar}>

            <div
                className="modalLogin-box"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Ícone */}
                <div className="modalLogin-icone">⚠️</div>

                <h2 className="modalLogin-titulo">
                    Complete seu perfil
                </h2>

                <p className="modalLogin-texto">
                    Para continuar, preencha as informações abaixo:
                </p>

                {/* 🔥 DESTAQUE PRINCIPAL */}
                <div className="modalLogin-info-box">
                    <strong>
                        Ala, Estaca, Bispo, Chamado, Fotos de Capa e perfil
                    </strong>
                </div>

                <p
                    className="modalLogin-texto"
                    style={{ fontSize: "13px", marginTop: "10px", color: "#64748b" }}
                >
                    Usado apenas para organização e verificação interna.
                </p>

                <div className="modalLogin-botoes">

                    <button
                        className="modalLogin-btn cancelar"
                        onClick={fechar}
                    >
                        Agora não
                    </button>

                    <button
                        className="modalLogin-btn aceitar"
                        onClick={irParaPerfil}
                    >
                        Completar agora
                    </button>

                </div>

            </div>

        </div>,
        document.body
    );
}