import React, { useState } from "react";
import "./direcao.css";

// 🔥 IMPORTS CORRETOS
import fotoEnya from "./fotos/do.jpg";
import fotoAndy from "./fotos/ds.jpg";

import enya1 from "./enya/1.jpg";
import enya2 from "./enya/2.jpg";
import enya3 from "./enya/3.jpg";

import andy1 from "./andy/1.jpg";
import andy2 from "./andy/2.jpg";
import andy3 from "./andy/3.jpg";

export default function Direcao() {

    const [modalFotos, setModalFotos] = useState(false);
    const [perfilAtivo, setPerfilAtivo] = useState(null);

    const imagensEnya = [
        fotoEnya,
        enya1,
        enya2,
        enya3
    ];

    const imagensAndy = [
        fotoAndy,
        andy1,
        andy2,
        andy3
    ];

    const imagensAtuais =
        perfilAtivo === "enya"
            ? imagensEnya
            : perfilAtivo === "andy"
                ? imagensAndy
                : [];

    return (
        <div className="direcao-container">

            {/* HEADER */}
            <div className="direcao-header">
                <h1>Direção do Aplicativo</h1>
                <p>
                    Este não é um aplicativo oficial de A Igreja de Jesus Cristo dos Santos dos Últimos Dias
                </p>
            </div>

            {/* PROPÓSITO */}
            <div className="direcao-card">
                <h2>Propósito da Plataforma</h2>

                <p>
                    Este aplicativo foi concebido com o objetivo de fortalecer conexões reais e significativas.
                </p>

                <ul>
                    <li>Acompanhamento entre famílias e missionários</li>
                    <li>Comunicação organizada</li>
                    <li>Estrutura para apoio mútuo</li>
                </ul>
            </div>

            {/* ENYA */}
            <div className="direcao-perfil">

                <img
                    src={fotoEnya} // ✅ AQUI ESTAVA O ERRO
                    className="direcao-foto"
                    onClick={() => {
                        setPerfilAtivo("enya");
                        setModalFotos(true);
                    }}
                />

                <h3>Enya Valadares</h3>
                <p className="cargo">Diretora de Operações</p>

                <p>
                    Responsável pela gestão operacional do aplicativo e experiência dos usuários.
                </p>

                <p>
                    Atua na{" "}
                    <a href="https://www.tiktok.com/@missionary.store" target="_blank" rel="noreferrer">
                        Missionary Store Brasil
                    </a>
                </p>

            </div>

            {/* ANDY */}
            <div className="direcao-perfil">

                <img
                    src={fotoAndy} // ✅ CORRIGIDO
                    className="direcao-foto"
                    onClick={() => {
                        setPerfilAtivo("andy");
                        setModalFotos(true);
                    }}
                />

                <h3>Andy de Oliveira</h3>
                <p className="cargo">Diretor de Sistemas</p>

                <p>
                    Responsável pela arquitetura técnica e desenvolvimento da plataforma.
                </p>

                <p>
                    Diretor da{" "}
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                        Iron Executions
                    </a>
                </p>

            </div>

            {/* MODAL */}
            {modalFotos && (
                <div className="direcao-modal">

                    <button
                        className="direcao-fechar"
                        onClick={() => setModalFotos(false)}
                    >
                        ✕
                    </button>

                    <div className="direcao-galeria">
                        {imagensAtuais.map((img, i) => (
                            <img key={i} src={img} alt="foto" />
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}