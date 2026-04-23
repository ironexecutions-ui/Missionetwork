import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./modallogin.css";

export default function ModalLogin({ fechar }) {

    const navigate = useNavigate();

    const irParaPerfil = () => {
        fechar();
        navigate("/perfil");
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

                {/* 🔒 ÍCONE */}
                <div className="modalLogin-icone">
                    🔒
                </div>

                <h2 className="modalLogin-titulo">
                    Acesso necessário
                </h2>

                <p className="modalLogin-texto">
                    Você precisa estar logado para interagir com esta funcionalidade.
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
                        Fazer login
                    </button>

                </div>

            </div>

        </div>,
        document.body
    );
}