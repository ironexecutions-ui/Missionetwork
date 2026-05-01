import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import "./config.css";

export default function MissionarioConfig({ atualizarLista }) {

    const token = localStorage.getItem("token");

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");
    const [lista, setLista] = useState([]);

    // 🔍 BUSCA (continua pública)
    useEffect(() => {
        if (busca.length < 2) return setResultados([]);

        fetch(`${API_URL}/missionarios-usuarios/busca/${busca}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => res.json())
            .then(setResultados);
    }, [busca]);

    // 📥 LISTA (CORRIGIDO)
    const carregar = async () => {
        try {
            const res = await fetch(`${API_URL}/missionarios-usuarios`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await res.json();
            setLista(data);

        } catch (err) {
            console.log("erro lista:", err);
        }
    };

    useEffect(() => { carregar(); }, []);

    // ➕ ADICIONAR (SEM usuario_id)
    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        await fetch(`${API_URL}/missionarios-usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
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
        <div className="cfgd-container">

            <input
                className="cfgd-input"
                placeholder="Buscar missionário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            <div className="cfgd-resultados">
                {resultados.map(m => (
                    <div
                        key={m.id}
                        className="cfgd-item-resultado"
                        onClick={() => setSelecionado(m)}
                    >
                        {m.nome}
                    </div>
                ))}
            </div>

            {selecionado && (
                <div className="cfgd-selecao">

                    <div className="cfgd-selecionado">
                        {selecionado.nome}
                    </div>

                    <input
                        className="cfgd-input"
                        placeholder="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />

                    <button
                        className="cfgd-botao-adicionar"
                        onClick={adicionar}
                    >
                        Adicionar
                    </button>

                </div>
            )}

            <div className="cfgd-lista">
                {lista.map(item => (
                    <div key={item.id} className="cfgd-item-lista">
                        <span className="cfgd-nome">{item.nome}</span>
                        <span className="cfgd-tipo">{item.tipo}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}