import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import "./config.css";

export default function MissionarioConfig({ atualizarLista }) {

    const user = JSON.parse(localStorage.getItem("usuario"));

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");
    const [lista, setLista] = useState([]);

    useEffect(() => {
        if (busca.length < 2) return setResultados([]);

        fetch(`${API_URL}/missionarios-usuarios/busca/${busca}`)
            .then(res => res.json())
            .then(setResultados);
    }, [busca]);

    const carregar = async () => {
        const res = await fetch(`${API_URL}/missionarios-usuarios/${user.id}`);
        const data = await res.json();
        setLista(data);
    };

    useEffect(() => { carregar(); }, []);

    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        await fetch(`${API_URL}/missionarios-usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: user.id,
                missionario_id: selecionado.id,
                tipo
            })
        });

        setSelecionado(null);
        setBusca("");
        setTipo("");
        carregar();
        atualizarLista && atualizarLista();
    };

    return (
        <div className="config-container">

            <input
                className="config-input"
                placeholder="Buscar missionário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            {resultados.map(m => (
                <div key={m.id} className="config-item" onClick={() => setSelecionado(m)}>
                    {m.nome}
                </div>
            ))}

            {selecionado && (
                <>
                    <p>{selecionado.nome}</p>

                    <input
                        className="config-input"
                        placeholder="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />

                    <button className="config-botao" onClick={adicionar}>
                        Adicionar
                    </button>
                </>
            )}

            {lista.map(item => (
                <div key={item.id} className="config-item">
                    {item.nome} - {item.tipo}
                </div>
            ))}

        </div>
    );
}