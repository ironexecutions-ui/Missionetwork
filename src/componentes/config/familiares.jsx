import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function FamiliaresConfig() {

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");
    const [lista, setLista] = useState([]);

    const user = JSON.parse(localStorage.getItem("usuario"));

    const TIPOS = [
        "pai", "mae", "irmao", "irma",
        "filho", "filha", "esposo", "esposa",
        "avo", "avoa", "tio", "tia",
        "primo", "prima"
    ];

    // 🔍 BUSCA
    useEffect(() => {
        if (busca.length < 2) {
            setResultados([]);
            return;
        }

        fetch(`${API_URL}/familiares/busca/${busca}`)
            .then(r => r.json())
            .then(setResultados)
            .catch(() => setResultados([]));

    }, [busca]);

    // 📥 LISTAR
    const carregar = () => {
        fetch(`${API_URL}/familiares/${user.id}`)
            .then(r => r.json())
            .then(setLista);
    };

    useEffect(() => {
        carregar();
    }, []);

    // ➕ ADICIONAR
    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        const res = await fetch(`${API_URL}/familiares`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: user.id,
                familiar_id: selecionado.id,
                tipo_familiar: tipo
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail);
            return;
        }

        setSelecionado(null);
        setTipo("");
        setBusca("");
        carregar();
    };

    // ❌ REMOVER
    const remover = async (id) => {
        await fetch(`${API_URL}/familiares/${id}`, {
            method: "DELETE"
        });
        carregar();
    };

    return (
        <div className="cfg-secao">

            <h2>Familiares</h2>

            {/* BUSCA */}
            {!selecionado && (
                <input
                    placeholder="Buscar familiar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            )}

            {/* RESULTADOS */}
            {resultados.map(r => (
                <div key={r.id} onClick={() => setSelecionado(r)}>
                    {r.nome_completo}
                </div>
            ))}

            {/* SELECIONADO */}
            {selecionado && (
                <div>
                    {selecionado.nome_completo}
                    <button onClick={() => setSelecionado(null)}>X</button>
                </div>
            )}

            {/* TIPO */}
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Tipo</option>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>

            <button onClick={adicionar}>Adicionar</button>

            {/* LISTA */}
            {lista.map(f => (
                <div key={f.id} className="cfg-item">

                    <div>
                        <strong>{f.nome_completo}</strong>
                        <div>{f.tipo_familiar}</div>
                    </div>

                    <button onClick={() => remover(f.id)}>
                        Remover
                    </button>

                </div>
            ))}

        </div>
    );
}