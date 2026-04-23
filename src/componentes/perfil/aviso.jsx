import React from "react";
import "./aviso.css";

export default function Aviso() {
    return (
        <div className="aviso-container">

            <h1 className="aviso-titulo">
                Aviso Importante
            </h1>

            <p className="aviso-texto">
                Este site não é um canal oficial de
                <strong> A Igreja de Jesus Cristo dos Santos dos Últimos Dias</strong>.
                Trata-se de uma plataforma independente, criada com o objetivo de
                fortalecer a conexão entre membros e apoiar a comunidade.
            </p>

            <div className="aviso-bloco">

                <h2 className="aviso-subtitulo">
                    Propósito da Plataforma
                </h2>

                <ul className="aviso-lista">
                    <li>
                        Conectar membros entre si, fortalecendo amizades e apoio dentro da comunidade.
                    </li>
                    <li>
                        Facilitar a comunicação entre membros e missionários, aproximando experiências e aprendizados.
                    </li>
                    <li>
                        Ajudar membros a se conectarem com outros membros ao redor do mundo, promovendo união global.
                    </li>
                </ul>

            </div>

            <p className="aviso-rodape">
                Nosso objetivo é servir como uma ferramenta de apoio, sempre respeitando os princípios e valores ensinados pela Igreja.
            </p>

        </div>
    );
}