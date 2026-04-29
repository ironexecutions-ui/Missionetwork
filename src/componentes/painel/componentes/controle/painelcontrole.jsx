import React, { useState } from "react";
import Relatorio from "../renderizar/relato/relato";
import Usuarios from "../renderizar/usuarios/usuarios";

import "./painelcontrole.css";

export default function Painelcontrole() {

    const [abaAtiva, setAbaAtiva] = useState("relatorio");

    const renderConteudo = () => {
        switch (abaAtiva) {
            case "relatorio":
                return <Relatorio />;

            case "usuarios": // 🔥 NOVO
                return <Usuarios />;

            default:
                return <h2>Selecione uma opção</h2>;
        }
    };

    return (
        <div className="painel-container">

            {/* HEADER */}
            <div className="painel-header">

                <button
                    className={`painel-btn ${abaAtiva === "relatorio" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("relatorio")}
                >
                    Relatório
                </button>

                <button
                    className={`painel-btn ${abaAtiva === "usuarios" ? "ativo" : ""}`}
                    onClick={() => setAbaAtiva("usuarios")}
                >
                    Usuários
                </button>

            </div>

            {/* CONTEÚDO */}
            <div className="painel-conteudo">
                {renderConteudo()}
            </div>

        </div>
    );
}