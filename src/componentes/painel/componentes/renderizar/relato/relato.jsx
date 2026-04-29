import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../../config";
import "./relato.css";

export default function Relato() {

    const [dados, setDados] = useState({
        usuarios: 0,
        postagens: 0,
        missionarios: 0
    });

    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        try {
            const res = await fetch(`${API_URL}/relatorio/resumo`);
            const data = await res.json();

            setDados(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
    );
}