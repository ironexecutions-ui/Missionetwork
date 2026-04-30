import React, { useState } from "react";
import "./direcao.css";

import Enya from "./enya";
import Andy from "./andy";

export default function Direcao() {

    const [modalFotos, setModalFotos] = useState(false);
    const [imagensModal, setImagensModal] = useState([]);

    const abrirModal = (imagens) => {
        setImagensModal(imagens);
        setModalFotos(true);
    };

    return (
        <div className="direcao-container">
            <div className="direcao-header">
                <h1>Direção da Plataforma</h1>
                <p>Conectando missionários, famílias e propósito em um só lugar</p>            </div>

            {/* HEADER */}
            <div className="direcao-header">
                <p>
                    <b> Esta Plataforma não é oficial de A Igreja de Jesus Cristo dos Santos dos Últimos Dias </b>
                </p>
            </div>

            {/* PROPÓSITO */}
            <div className="direcao-card">
                <h2>Visão da Plataforma</h2>

                <p>
                    Tornar-se uma referência digital no apoio a missionários e suas famílias,
                    proporcionando uma experiência organizada, segura e centrada em princípios.
                </p>

                <p>
                    A plataforma busca evoluir continuamente, incorporando novas funcionalidades
                    que facilitem a comunicação e fortaleçam os laços entre todos os envolvidos.
                </p>
            </div>
            <div className="direcao-card">
                <h2>Princípios e Valores</h2>

                <ul>
                    <li>Respeito e integridade em todas as interações</li>
                    <li>Proteção e privacidade dos dados dos usuários</li>
                    <li>Foco em edificação espiritual e apoio mútuo</li>
                    <li>Simplicidade e clareza na comunicação</li>
                </ul>
            </div>
            <div className="direcao-card">
                <h2>Segurança e Privacidade</h2>

                <p>
                    Todos os dados são tratados com responsabilidade e protegidos por boas práticas
                    de desenvolvimento e armazenamento seguro.
                </p>

                <p>
                    O acesso às informações é controlado e limitado, garantindo que cada usuário
                    visualize apenas o que é necessário.
                </p>
            </div>

            {/* 🔥 PERFIS */}
            <Enya abrirModal={abrirModal} />
            <Andy abrirModal={abrirModal} />

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
                        {imagensModal.map((img, i) => (
                            <img key={i} src={img} alt="foto" />
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}