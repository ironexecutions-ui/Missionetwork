import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./familiares.css"
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
        <div className="fam-container">


            {/* 🔍 BUSCA */}
            {!selecionado && (
                <input
                    className="fam-input"
                    placeholder="Buscar familiar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            )}

            {/* RESULTADOS */}
            <div className="fam-resultados">
                {resultados.map(r => (
                    <div
                        key={r.id}
                        className="fam-item-resultado"
                        onClick={() => setSelecionado(r)}
                    >
                        {r.nome_completo}
                    </div>
                ))}
            </div>

            {/* SELECIONADO */}
            {selecionado && (
                <div className="fam-selecionado">
                    <span>{selecionado.nome_completo}</span>

                    <button
                        className="fam-btn-remover"
                        onClick={() => setSelecionado(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* TIPO */}
            <select
                className="fam-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            >
                <option value="">Tipo de vínculo</option>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>

            <button className="fam-btn-adicionar" onClick={adicionar}>
                Adicionar
            </button>

            {/* LISTA */}
            <div className="fam-lista">
                {lista.map(f => (
                    <div key={f.id} className="fam-item">

                        <div className="fam-info">
                            <strong>{f.nome_completo}</strong>
                            <span>{f.tipo_familiar}</span>
                        </div>

                        <button
                            className="fam-btn-remover"
                            onClick={() => remover(f.id)}
                        >
                            Remover
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
}