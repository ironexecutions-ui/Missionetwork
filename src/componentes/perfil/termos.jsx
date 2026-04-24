import React from "react";
import "./termos.css";

export default function ModalTermos({ abrir, fechar, aceitar }) {

    if (!abrir) return null;

    return (
        <div className="modal-termos-overlay">

            <div className="modal-termos-card">

                <h2 className="modal-termos-titulo">
                    Termos de Uso
                </h2>

                <div className="modal-termos-texto">
                    <p>
                        Aqui você coloca seus termos reais depois.
                        Pode ser longo, com scroll, regras da plataforma,
                        uso de dados, etc.
                    </p>
                </div>

                <button
                    className="modal-termos-btn-aceitar"
                    onClick={aceitar}
                >
                    Aceitar termos
                </button>

                <button
                    className="modal-termos-btn-fechar"
                    onClick={fechar}
                >
                    Cancelar
                </button>

            </div>

        </div>
    );
}