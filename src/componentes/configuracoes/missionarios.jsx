import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./missionarios.css";

export default function MissionarioConfig() {

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");
    const [lista, setLista] = useState([]);

    const token = localStorage.getItem("token");

    // 🔍 BUSCA (pública, pode continuar sem token)
    useEffect(() => {
        if (busca.length < 2) {
            setResultados([]);
            return;
        }

        fetch(`${API_URL}/missionarios-usuarios/busca/${busca}`)
            .then(r => r.json())
            .then(setResultados);

    }, [busca]);

    // 📥 LISTA (AGORA SEGURA)
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

    useEffect(() => {
        carregar();
    }, []);

    // ➕ ADICIONAR (SEM usuario_id)
    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        const res = await fetch(`${API_URL}/missionarios-usuarios`, {
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

        if (!res.ok) {
            alert("Erro ao adicionar");
            return;
        }

        setSelecionado(null);
        setTipo("");
        setBusca("");
        carregar();
    };

    // ❌ REMOVER (agora com token)
    const remover = async (id) => {
        await fetch(`${API_URL}/missionarios-usuarios/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            }
        });

        carregar();
    };

    return (
        <div className="msn-container">

            {/* 🔍 BUSCA */}
            {!selecionado && (
                <input
                    className="msn-input"
                    placeholder="Buscar missionário..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            )}

            {/* RESULTADOS */}
            <div className="msn-resultados">
                {resultados.map(r => (
                    <div
                        key={r.id}
                        className="msn-item-resultado"
                        onClick={() => setSelecionado(r)}
                    >
                        {r.nome}
                    </div>
                ))}
            </div>

            {/* SELECIONADO */}
            {selecionado && (
                <div className="msn-selecionado">
                    <span>{selecionado.nome}</span>

                    <button
                        className="msn-btn-remover"
                        onClick={() => setSelecionado(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* TIPO */}
            <input
                className="msn-input"
                placeholder="Tipo (amigo, filho, etc)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            />

            <button
                className="msn-btn-adicionar"
                onClick={adicionar}
            >
                Adicionar
            </button>

            {/* LISTA */}
            <div className="msn-lista">
                {lista.map(m => (
                    <div key={m.id} className="msn-item">

                        <div className="msn-info">
                            <strong>{m.nome}</strong>
                            <span>{m.tipo}</span>
                        </div>

                        <button
                            className="msn-btn-remover"
                            onClick={() => remover(m.id)}
                        >
                            Remover
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
}