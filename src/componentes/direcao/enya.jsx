import React from "react";

import fotoEnya from "./fotos/do.jpg";
import enya1 from "./enya/1.jpg";
import enya2 from "./enya/2.jpg";
import enya3 from "./enya/3.jpg";
import "./estilo.css"
export default function Enya({ abrirModal }) {

    const imagens = [
        fotoEnya,
        enya1,
        enya2,
        enya3
    ];

    return (
        <div className="direcao-perfil">

            {/* FOTO */}
            <img
                src={fotoEnya}
                className="direcao-foto"
                onClick={() => abrirModal(imagens)}
                alt="Enya Valadares"
            />

            {/* IDENTIDADE */}
            <h3 className="direcao-nome">Enya Valadares</h3>
            <p className="direcao-cargo">Diretora de Operações</p>

            <div className="direcao-divider"></div>

            {/* RESPONSABILIDADE */}
            <p className="direcao-label">Responsabilidades</p>

            <p className="direcao-texto">
                Responsável pela gestão operacional do aplicativo, organização dos processos internos
                e acompanhamento da experiência dos usuários.
            </p>

            <p className="direcao-texto">
                Atua diretamente na estruturação, eficiência e crescimento sustentável da plataforma.
            </p>

            {/* ATUAÇÃO */}
            <p className="direcao-label">Atuação Profissional</p>

            <p className="direcao-texto">
                Atua na{" "}
                <a
                    href="https://www.tiktok.com/@missionary.store"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Missionary Store Brasil
                </a>
                , empresa reconhecida pela excelência na produção de itens voltados aos missionários.
            </p>

            {/* SERVIÇO */}
            <p className="direcao-label">Servi em</p>

            <p className="direcao-texto">
                Na Missão Brasil São Paulo Oeste, servindo no Centro de Visitantes entre 2022 e 2023, período marcado por experiências significativas de aprendizado, serviço e fortalecimento espiritual.
            </p>

            <p className="direcao-texto">
                Durante esse tempo, tive a oportunidade de servir sob a liderança do{" "}
                <a
                    href="https://www.facebook.com/david.hunt.697043"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Presidente David Hunt
                </a>
                , juntamente com{" "}
                <a
                    href="https://www.facebook.com/amy.f.hunt.37"
                    target="_blank"
                    rel="noreferrer"
                    className="direcao-link"
                >
                    Sister Amy Hunt
                </a>
                , cujo exemplo, dedicação e orientação foram essenciais durante esse período.
            </p>

        </div>
    );
}