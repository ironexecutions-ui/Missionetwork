import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../../config";
import "./relato.css";

export default function Relato() {

    const [dados, setDados] = useState({
        usuarios: 0,
        postagens: 0,
        missionarios: 0
    });

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        try {
            setCarregando(true);

            const res = await fetch(`${API_URL}/relatorio/resumo`);
            const data = await res.json();

            setDados(data);
        } catch (err) {
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="relato-container">
            <div className="relato-botao-area">
                <button
                    onClick={buscarDados}
                    disabled={carregando}
                    className="relato-botao-atualizar"
                >
                    {carregando ? "Atualizando..." : "Atualizar dados"}
                </button>
            </div><br />
            <div className="relato-grid">

                <div className="relato-card usuarios">
                    <h3>Usuários</h3>
                    <span>{dados.usuarios}</span>
                </div>

                <div className="relato-card postagens">
                    <h3>Postagens</h3>
                    <span>{dados.postagens}</span>
                </div>

                <div className="relato-card missionarios">
                    <h3>Missionários</h3>
                    <span>{dados.missionarios}</span>
                </div>

            </div>
            <br />


        </div>
    );
}