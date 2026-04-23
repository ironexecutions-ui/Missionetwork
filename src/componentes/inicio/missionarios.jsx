import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "./missionarios.css";

export default function MissionariosSidebar() {

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

            const res = await fetch(`${API_URL}/missionario/missionario-usuarios/${user.id}`);
            const data = await res.json();

            setLista(data || []);
        } catch (err) {
            console.log("erro sidebar:", err);
        } finally {
            setCarregando(false);
        }
    };
    return (
        <div className="sidebar-bloco">

            <h3 className="sidebar-titulo">Missionários</h3>

            {!logado && (
                <div className="sidebar-vazio">
                    Aqui estarão os missionários vinculados à sua conta.
                </div>
            )}

            {logado && carregando && (
                <div className="sidebar-vazio">Carregando...</div>
            )}

            {logado && !carregando && lista.length === 0 && (
                <div className="sidebar-vazio">
                    Nenhum missionário vinculado no momento.
                </div>
            )}

            {logado && !carregando && lista.map(m => {

                const idReal = m.missionario_id || m.id;

                return (
                    <div
                        key={m.id}
                        className="sidebar-item"
                        onClick={() => navigate(`/meu-missionario/${idReal}`)}
                    >

                        {(m.foto || m.foto_perfil) ? (
                            <img
                                src={m.foto || m.foto_perfil}
                                className="sidebar-avatar"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}

                        <div
                            className="sidebar-avatar-fake"
                            style={{ display: (m.foto || m.foto_perfil) ? "none" : "flex" }}
                        >
                            {m.nome?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="sidebar-info">
                            <div className="sidebar-nome">{m.nome}</div>
                            <div className="sidebar-tipo">
                                {m.tipo}

                                {Number(m.auth) === 0 && (
                                    <span className="status-pendente">
                                        • Pendente
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                );
            })}

            {/* BOTÃO */}
            {logado && (
                <button
                    className="sidebar-add-btn"
                    onClick={() => setAbrirConfig(!abrirConfig)}
                >
                    {abrirConfig ? "Fechar" : "+ Adicionar missionário"}
                </button>
            )}

            {/* FORM INLINE */}
            {abrirConfig && (
                <MissionarioForm
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
function MissionarioForm({ fechar }) {

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [tipo, setTipo] = useState("");

    const user = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        if (busca.length < 2) {
            setResultados([]);
            return;
        }

        fetch(`${API_URL}/missionarios-usuarios/busca/${busca}`)
            .then(r => r.json())
            .then(setResultados)
            .catch(() => setResultados([]));
    }, [busca]);

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

        // limpa e fecha
        setSelecionado(null);
        setTipo("");
        setBusca("");

        fechar();
    };

    return (
        <div className="sidebar-config-box">

            {/* BUSCA */}
            <input
                className="cfg-inputt"
                placeholder="Buscar missionário..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            {/* RESULTADOS */}
            {resultados.map(r => (
                <div
                    key={r.id}
                    className="cfg-result"
                    onClick={() => setSelecionado(r)}
                >

                    {(r.foto || r.foto_perfil) ? (
                        <img
                            src={r.foto || r.foto_perfil}
                            className="cfg-avatar"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}

                    <div
                        className="cfg-avatar-fake"
                        style={{ display: (r.foto || r.foto_perfil) ? "none" : "flex" }}
                    >
                        {r.nome?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <span className="cfg-nome">{r.nome}</span>

                </div>
            ))}

            {/* SELECIONADO */}
            {selecionado && (
                <div className="cfg-selected">
                    {selecionado.nome}
                    <button onClick={() => setSelecionado(null)}>X</button>
                </div>
            )}

            {/* TIPO */}
            <input
                className="cfg-inputt"
                placeholder="Tipo (ex: amigo, filho...)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            />

            {/* BOTÃO */}
            <button className="cfg-btn" onClick={adicionar}>
                Adicionar
            </button>

        </div>
    );
}