import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./comentarios.css";
import ReacoesComentario from "./reacoescomentarios";
import Denuncia from "./denuncia";

// 🔥 IMPORTA MODAIS
import ModalLogin from "./modallogin";
import ModalPerfilIncompleto from "./modalincompleto";

export default function Comentarios({ postId, onAtualizar }) {
    const [limite, setLimite] = useState(3);
    const [texto, setTexto] = useState("");
    const [loading, setLoading] = useState(false);
    const [comentarios, setComentarios] = useState([]);

    const [menuAberto, setMenuAberto] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [textoEdit, setTextoEdit] = useState("");

    const [denunciaComentarioId, setDenunciaComentarioId] = useState(null);

    // 🔥 MODAIS
    const [abrirModalLogin, setAbrirModalLogin] = useState(false);
    const [abrirModalPerfil, setAbrirModalPerfil] = useState(false);

    // 🔥 CARREGAR
    const carregarComentarios = async () => {
        try {
            const res = await fetch(`${API_URL}/comentarios/${postId}`);
            const data = await res.json();
            setComentarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("erro carregar:", err);
        }
    };

    useEffect(() => {
        carregarComentarios();
    }, [postId]);

    // 🔥 CRIAR COM VALIDAÇÃO PROFISSIONAL
    const enviarComentario = async () => {
        try {
            if (!texto.trim()) return;

            // 🔥 VALIDA PRIMEIRO
            if (!validarUsuario()) return;

            const user = JSON.parse(localStorage.getItem("usuario"));

            setLoading(true);

            await fetch(`${API_URL}/comentarios/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postagem_id: postId,
                    usuario_id: user.id,
                    comentario: texto
                })
            });

            setTexto("");
            carregarComentarios();
            onAtualizar();

        } catch (err) {
            console.log("erro comentar:", err);
        } finally {
            setLoading(false);
        }
    };
    const validarUsuario = () => {
        const userLocal = localStorage.getItem("usuario");

        // ❌ NÃO LOGADO
        if (!userLocal) {
            setAbrirModalLogin(true);
            return false;
        }

        const user = JSON.parse(userLocal);

        // ⚠️ PERFIL INCOMPLETO
        if (
            !user.ala ||
            !user.estaca ||
            !user.bispo ||
            !user.chamado
        ) {
            setAbrirModalPerfil(true);
            return false;
        }

        return true;
    };
    // 🔥 EDITAR
    const salvarEdicao = async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            await fetch(`${API_URL}/comentarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comentario: textoEdit,
                    usuario_id: user.id
                })
            });

            setEditandoId(null);
            carregarComentarios();

        } catch (err) {
            console.log("erro editar:", err);
        }
    };

    // 🔥 APAGAR
    const deletarComentario = async (id) => {
        const confirmar = confirm("Apagar comentário?");
        if (!confirmar) return;

        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            await fetch(`${API_URL}/comentarios/${id}?usuario_id=${user.id}`, {
                method: "DELETE"
            });

            carregarComentarios();

        } catch (err) {
            console.log("erro deletar:", err);
        }
    };

    return (
        <div className="comentarios-container">

            {/* 🔥 LISTA */}
            {comentarios.slice(0, limite).map((c) => (
                <div key={c.id} className="postagens-comentario">

                    {/* TOPO */}
                    <div className="comentario-topo">

                        <strong>{c.usuario?.nome_completo}</strong>

                        <div className="comentario-menu">

                            <button
                                onClick={() =>
                                    setMenuAberto(menuAberto === c.id ? null : c.id)
                                }
                            >
                                ⋮
                            </button>

                            {menuAberto === c.id && (
                                <div className="comentario-dropdown">

                                    {Number(JSON.parse(localStorage.getItem("usuario"))?.id) === Number(c.usuario?.id) ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditandoId(c.id);
                                                    setTextoEdit(c.comentario);
                                                    setMenuAberto(null);
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => {
                                                    deletarComentario(c.id);
                                                    setMenuAberto(null);
                                                }}
                                            >
                                                Apagar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setDenunciaComentarioId(c.id);
                                                setMenuAberto(null);
                                            }}
                                        >
                                            Denunciar
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {/* TEXTO */}
                    {editandoId === c.id ? (
                        <div className="comentario-editar">
                            <input
                                value={textoEdit}
                                onChange={(e) => setTextoEdit(e.target.value)}
                            />
                            <button onClick={() => salvarEdicao(c.id)}>
                                Salvar
                            </button>
                        </div>
                    ) : (
                        <p>{c.comentario}</p>
                    )}

                    {/* REAÇÕES */}
                    <ReacoesComentario
                        comentarioId={c.id}
                        curtidasInicial={c.curtidas}
                    />

                </div>
            ))}
            {comentarios.length > limite && (
                <button
                    className="comentarios-ver-mais"
                    onClick={() => setLimite(limite + 3)}
                >
                    Ver mais comentários
                </button>
            )}
            {/* INPUT */}
            <div className="comentarios-input-area">

                <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={texto}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();

                            if (!validarUsuario()) return;
                            enviarComentario();
                        }
                    }}
                    onFocus={(e) => {
                        if (!validarUsuario()) {
                            e.target.blur();
                        }
                    }}
                    onChange={(e) => setTexto(e.target.value)}
                    className="comentarios-input"
                />

                <button
                    onClick={() => {
                        if (!validarUsuario()) return;
                        enviarComentario();
                    }}
                    className="comentarios-botao"
                    disabled={loading}
                >
                    {loading ? "..." : "Enviar"}
                </button>

            </div>

            {/* MODAL DENUNCIA */}
            {denunciaComentarioId && (
                <Denuncia
                    tipo="comentario"
                    id={denunciaComentarioId}
                    fechar={() => setDenunciaComentarioId(null)}
                />
            )}

            {/* 🔥 MODAIS NOVOS */}
            {abrirModalLogin && (
                <ModalLogin fechar={() => setAbrirModalLogin(false)} />
            )}

            {abrirModalPerfil && (
                <ModalPerfilIncompleto fechar={() => setAbrirModalPerfil(false)} />
            )}

        </div>
    );
}