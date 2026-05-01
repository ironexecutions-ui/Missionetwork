import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "./familiares.css";

export default function FamiliaresSidebar() {

    const [lista, setLista] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [logado, setLogado] = useState(true);
    const [abrirConfig, setAbrirConfig] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const userLocal = localStorage.getItem("usuario");

            if (!userLocal) {
                setLogado(false);
                setCarregando(false);
                return;
            }

            const user = JSON.parse(userLocal);

            const res = await fetch(`${API_URL}/familiares`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }); const data = await res.json();

            setLista(data || []);
        } catch (err) {
            console.log("Erro ao carregar familiares:", err);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="sidebar-bloco">

            <h3 className="sidebar-titulo">Familiares</h3>

            {!logado && (
                <div className="sidebar-vazio">
                    Aqui estarão as informações dos seus familiares vinculados.
                </div>
            )}

            {logado && carregando && (
                <div className="sidebar-vazio">Carregando...</div>
            )}

            {logado && !carregando && lista.length === 0 && (
                <div className="sidebar-vazio">
                    Nenhum familiar vinculado no momento.
                </div>
            )}

            {logado && !carregando && lista.map(f => (
                <div
                    key={f.id}
                    className="sidebar-item"
                    onClick={() => navigate(`/visita/${f.familiar_id}`)}
                >

                    {f.foto ? (
                        <img
                            src={f.foto}
                            className="sidebar-avatar"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}

                    <div
                        className="sidebar-avatar-fake"
                        style={{ display: f.foto ? "none" : "flex" }}
                    >
                        {f.nome_completo?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="sidebar-info">
                        <div className="sidebar-nome">{f.nome_completo}</div>
                        <div className="sidebar-tipo">{f.tipo_familiar}</div>
                    </div>

                </div>
            ))}

            {/* 🔥 BOTÃO */}
            {logado && (
                <button
                    className="sidebar-add-btn"
                    onClick={() => setAbrirConfig(!abrirConfig)}
                >
                    {abrirConfig ? "Fechar" : "+ Adicionar familiar"}
                </button>
            )}

            {/* 🔥 FORM INLINE */}
            {abrirConfig && (
                <FamiliaresForm
                    fechar={() => {
                        setAbrirConfig(false);
                        carregar();
                    }}
                />
            )}

        </div>
    );
}

/* 🔥 FORMULÁRIO EMBUTIDO */
function FamiliaresForm({ fechar }) {

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");

    const user = JSON.parse(localStorage.getItem("usuario"));

    const TIPOS = [
        "pai", "mae", "irmao", "irma",
        "filho", "filha", "esposo", "esposa",
        "avo", "avoa", "tio", "tia",
        "primo", "prima"
    ];

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

    const adicionar = async () => {

        if (!selecionado || !tipo) return;

        const res = await fetch(`${API_URL}/familiares`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                familiar_id: selecionado.id,
                tipo_familiar: tipo
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail);
            return;
        }

        setSelecionado(null);
        setTipo("");
        setBusca("");

        fechar(); // 🔥 fecha automaticamente
    };

    return (
        <div className="sidebar-config-box">

            <input
                className="cfg-inputt"
                placeholder="Buscar familiar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            {resultados.map(r => (
                <div
                    key={r.id}
                    className="cfg-result"
                    onClick={() => setSelecionado(r)}
                >

                    {r.foto ? (
                        <img
                            src={r.foto}
                            className="cfg-avatar"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}

                    <div
                        className="cfg-avatar-fake"
                        style={{ display: r.foto ? "none" : "flex" }}
                    >
                        {r.nome_completo?.charAt(0)?.toUpperCase()}
                    </div>

                    <span className="cfg-nome">
                        {r.nome_completo}
                    </span>

                </div>
            ))}

            {selecionado && (
                <div className="cfg-selected">
                    {selecionado.nome_completo}
                    <button onClick={() => setSelecionado(null)}>X</button>
                </div>
            )}

            <input
                className="cfg-inputt cfg-tipo-input"
                list="tipos-familia"
                placeholder="Escolha o tipo (ex: pai, mãe...)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            />

            <datalist id="tipos-familia">
                {TIPOS.map(t => (
                    <option key={t} value={t} />
                ))}
            </datalist>

            <button className="cfg-btn" onClick={adicionar}>
                Adicionar
            </button>

        </div>
    );
}