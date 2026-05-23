import React, { useState } from "react";

import Relatorio from "../renderizar/relato/relato";
import Usuarios from "../renderizar/usuarios/usuarios";
import Camera from "../renderizar/camera/camera";
import Imagens from "../imagens/imagens";
import "./painelcontrole.css";

export default function Painelcontrole() {

    const [abaAtiva, setAbaAtiva] = useState("relatorio");

    const [menuAberto, setMenuAberto] = useState(false);

    const abas = [
        {
            id: "relatorio",
            nome: "Relatório"
        },

        {
            id: "usuarios",
            nome: "Usuários"
        },

        {
            id: "camera",
            nome: "Câmera"
        },
        {
            id: "imagens",
            nome: "imagens"
        }

        // 🔥 aqui você pode adicionar quantos quiser
    ];

    const renderConteudo = () => {

        switch (abaAtiva) {

            case "relatorio":
                return <Relatorio />;

            case "usuarios":
                return <Usuarios />;

            case "camera":
                return <Camera />;

            case "imagens":
                return <Imagens />;

            default:
                return <h2>Selecione uma opção</h2>;
        }
    };

    const selecionarAba = (id) => {

        setAbaAtiva(id);

        setMenuAberto(false);
    };

    return (
        <div className="painel-container">

            {/* HEADER NORMAL (DESKTOP) */}
            <div className="painel-header">

                {abas.map((aba) => (
                    <button
                        key={aba.id}
                        className={`painel-btn ${abaAtiva === aba.id ? "ativo" : ""}`}
                        onClick={() => selecionarAba(aba.id)}
                    >
                        {aba.nome}
                    </button>
                ))}

            </div>

            {/* MENU MOBILE */}
            <div className="painel-fab-area">

                <button
                    className="painel-fab"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    {menuAberto ? "✕" : "☰"}
                </button>

                {menuAberto && (
                    <div className="painel-fab-menu">

                        {abas.map((aba) => (
                            <button
                                key={aba.id}
                                className={`painel-fab-item ${abaAtiva === aba.id ? "ativo" : ""}`}
                                onClick={() => selecionarAba(aba.id)}
                            >
                                {aba.nome}
                            </button>
                        ))}

                    </div>
                )}

            </div>

            {/* CONTEÚDO */}
            <div className="painel-conteudo">
                {renderConteudo()}
            </div>

        </div>
    );
}