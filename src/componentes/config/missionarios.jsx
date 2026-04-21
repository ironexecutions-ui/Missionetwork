import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function MissionarioConfig() {

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");
    const [lista, setLista] = useState([]);

    const user = JSON.parse(localStorage.getItem("usuario"));

    // 🔍 BUSCA
    useEffect(() => {
        if (busca.length < 2) {
            setResultados([]);
            return;
        }

        fetch(`${API_URL}/missionarios-usuarios/busca/${busca}`)
            .then(r => r.json())
            .then(setResultados);

    }, [busca]);

    // 📥 LISTA
    const carregar = () => {
        fetch(`${API_URL}/missionarios-usuarios/${user.id}`)
            .then(r => r.json())
            .then(setLista);
    };

    useEffect(() => {
        carregar();
    }, []);

    // ➕ ADICIONAR
    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        const res = await fetch(`${API_URL}/missionarios-usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: user.id,
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

    // ❌ REMOVER
    const remover = async (id) => {
        await fetch(`${API_URL}/missionarios-usuarios/${id}`, {
            method: "DELETE"
        });
        carregar();
    };

    return (
        <div className="cfg-secao">

            <h2>Missionários</h2>

            {!selecionado && (
                <input
                    placeholder="Buscar missionário..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            )}

            {resultados.map(r => (
                <div key={r.id} onClick={() => setSelecionado(r)}>
                    {r.nome}
                </div>
            ))}

            {selecionado && (
                <div>
                    {selecionado.nome}
                    <button onClick={() => setSelecionado(null)}>X</button>
                </div>
            )}

            <input
                placeholder="Tipo (amigo, filho, etc)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            />

            <button onClick={adicionar}>Adicionar</button>

            {lista.map(m => (
                <div key={m.id} className="cfg-item">

                    <div>
                        <strong>{m.nome}</strong>
                        <div>{m.tipo}</div>
                    </div>

                    <button onClick={() => remover(m.id)}>
                        Remover
                    </button>

                </div>
            ))}

        </div>
    );
}