import React from "react";

import fotoAndy from "./fotos/ds.jpg";
import andy1 from "./andy/1.jpg";
import andy2 from "./andy/2.jpg";
import andy3 from "./andy/3.jpg";

export default function Andy({ abrirModal }) {

    const imagens = [
        fotoAndy,
        andy1,
        andy2,
        andy3
    ];

    return (
        <div className="direcao-perfil">

            {/* FOTO */}
            <img
                src={fotoAndy}
                className="direcao-foto"
                onClick={() => abrirModal(imagens)}
                alt="Andy de Oliveira"
            />

            {/* IDENTIDADE */}
            <h3 className="direcao-nome">Andy de Oliveira</h3>
            <p className="direcao-cargo">Diretor de Sistemas</p>

            <div className="direcao-divider"></div>

            {/* RESPONSABILIDADE */}
            <p className="direcao-label">Responsabilidades</p>

            <p className="direcao-texto">
                Responsável por toda a arquitetura técnica do aplicativo, desenvolvimento de funcionalidades,
                segurança dos dados e evolução contínua da plataforma.
            </p>

            <p className="direcao-texto">
                Atua na criação de soluções escaláveis e na implementação de tecnologias modernas.
            </p>

            {/* ATUAÇÃO */}
            <p className="direcao-label">Atuação Profissional</p>

            <p className="direcao-texto">
                Atualmente é diretor da{" "}
                <a
                    href="https://www.facebook.com/profile.php?id=61580492555279"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Iron Executions
                </a>
                , empresa especializada no desenvolvimento de sites, aplicativos e sistemas personalizados,
                além de oferecer formação prática em programação para novos profissionais.
            </p>

            {/* SERVIÇO */}
            <p className="direcao-label">Servi em</p>

            <p className="direcao-texto">
                Na Missão Brasil Recife Norte entre 2021 e 2023, período em que vivi experiências marcantes
                e de grande crescimento pessoal e espiritual.
            </p>

            <p className="direcao-texto">
                Durante esse tempo, tive a oportunidade de servir sob a liderança do{" "}
                <a
                    href="https://www.facebook.com/chris.nordfelt.2025"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Presidente Chris Nordfelt
                </a>
                , juntamente com{" "}
                <a
                    href="https://www.facebook.com/mandy.nordfelt.2025"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Sister Mandy Nordfelt
                </a>
                , cujo apoio e exemplo foram fundamentais ao longo desse período.
            </p>

        </div>
    );
}