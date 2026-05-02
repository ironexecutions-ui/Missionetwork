import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./postagens.css";
import Reacoes from "./reacoes";
import Comentarios from "./comentarios";
import ReacoesComentario from "./reacoescomentarios";
import Postar from "./postar";
import { useNavigate } from "react-router-dom";
import Denuncia from "./denuncia";

export default function Postagens() {

    const [menuAberto, setMenuAberto] = useState(null);
    const [editandoPost, setEditandoPost] = useState(null);
    const [textoEdit, setTextoEdit] = useState("");
    const [denunciaPostId, setDenunciaPostId] = useState(null);
    const [pagina, setPagina] = useState(1);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);

    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    const navigate = useNavigate();

    // 🔥 URL INTELIGENTE (SEM UNDEFINED)
    const getUrlFeed = (pagina) => {
        const user = JSON.parse(localStorage.getItem("usuario"));

        if (user?.id) {
            return `${API_URL}/postagens/feed?usuario_id=${user.id}&pagina=${pagina}`;
        }

        return `${API_URL}/postagens/feed?pagina=${pagina}`;
    };

    useEffect(() => {
        carregarPostsInicial();
    }, []);

    const deletarPost = async (id) => {
        const confirmar = confirm("Apagar postagem?");
        if (!confirmar) return;

        try {
            await fetch(`${API_URL}/postagens/deletar/${id}`, {
                method: "DELETE"
            });

            atualizarPosts();

        } catch (err) {
            console.log("erro deletar:", err);
        }
    };

    const carregarPostsInicial = async () => {
        try {
            const res = await fetch(getUrlFeed(1));
            const data = await res.json();
            setPosts(data);

        } catch (err) {
            console.log("erro posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const atualizarPosts = async () => {
        try {
            const res = await fetch(getUrlFeed(1));
            const data = await res.json();
            setPosts(data);

        } catch (err) {
            console.log("erro atualizar:", err);
        }
    };

    const salvarEdicao = async (postId) => {
        try {
            await fetch(`${API_URL}/postagens/atualizar/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conteudo: textoEdit,
                    nivel: 1
                })
            });

            setEditandoPost(null);
            atualizarPosts();

        } catch (err) {
            console.log("erro editar:", err);
        }
    };

    const abrirDenunciaPost = (id) => {
        setDenunciaPostId(id);
    };

    const carregarMais = async () => {
        if (carregandoMais) return;

        setCarregandoMais(true);

        try {
            const novaPagina = pagina + 1;

            const res = await fetch(getUrlFeed(novaPagina));
            const data = await res.json();

            setPosts((prev) => [...prev, ...data]);
            setPagina(novaPagina);

        } catch (err) {
            console.log("erro carregar mais:", err);
        } finally {
            setCarregandoMais(false);
        }
    };

    if (loading) {
        return <div className="postagens-loading">Carregando...</div>;
    }
    return (
        <div className="postagens-container">

            <Postar onPostado={atualizarPosts} />

            {posts.map((p) => (

                <div
                    key={p.id}
                    className="postagens-card"
                    onClick={() => navigate(`/postagem/${p.id}`)}
                >

                    {/* TOPO */}
                    <div className="postagens-topo">

                        {/* FOTO */}
                        {p.foto ? (
                            <img
                                src={p.foto}
                                className="postagens-foto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/visita/${p.usuario_id}`);
                                }}
                            />
                        ) : (
                            <div
                                className="postagens-foto-placeholder"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/visita/${p.usuario_id}`);
                                }}
                            >
                                {p.nome_completo?.charAt(0) || "?"}
                            </div>
                        )}

                        {/* NOME */}
                        <div>
                            <span
                                className="postagens-nome"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/visita/${p.usuario_id}`);
                                }}
                            >
                                {p.nome_completo}
                            </span>

                        </div>
                        <div className="postagens-data">
                            {p.data_formatada}
                        </div>
                        {/* MENU */}
                        <div
                            className="postagens-menu-container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="postagens-menu-btn"
                                onClick={() =>
                                    setMenuAberto(menuAberto === p.id ? null : p.id)
                                }
                            >
                                ⋮
                            </button>

                            {menuAberto === p.id && (
                                <div className="postagens-menu-box">

                                    {Number(usuarioLogado?.id) === Number(p.usuario_id) ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditandoPost(p.id);
                                                    setTextoEdit(p.conteudo);
                                                    setMenuAberto(null);
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => {
                                                    deletarPost(p.id);
                                                    setMenuAberto(null);
                                                }}
                                            >
                                                Apagar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                abrirDenunciaPost(p.id);
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


                    {editandoPost === p.id ? (
                        <div
                            className="postagens-editar-box"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <textarea
                                value={textoEdit}
                                onChange={(e) => setTextoEdit(e.target.value)}
                            />
                            <button onClick={() => salvarEdicao(p.id)}>Salvar</button>
                        </div>
                    ) : (
                        p.conteudo && (
                            <>
                                <p className="postagens-conteudoo">
                                    {p.conteudo?.split("\n").map((linha, i) => (
                                        <span key={i}>
                                            {linha}
                                            <br />
                                        </span>
                                    ))}
                                </p>

                                {p.marcados?.length > 0 && (
                                    <div className="postagens-marcados">
                                        {p.marcados.map(m => (
                                            <span
                                                key={m.id}
                                                className="postagens-marcado-item"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/visita/${m.id}`);
                                                }}
                                            >
                                                @{m.nome_completo}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )
                    )}

                    {p.arquivos?.length > 0 && (
                        <div
                            className="preview-wrap"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/postagem/${p.id}`);
                            }}
                        >
                            {/* PRIMEIRO ITEM */}
                            {(() => {
                                const url = p.arquivos[0]?.arquivo || "";
                                const isVideo =
                                    url.includes(".mp4") ||
                                    url.includes(".webm") ||
                                    url.includes(".mov");

                                return isVideo ? (
                                    <video src={url} controls className="FIX_VIDEO" />
                                ) : (
                                    <img src={url} className="FIX_VIDEO" />
                                );
                            })()}

                            {/* +X */}
                            {p.arquivos.length > 1 && (
                                <div className="preview-overlay">
                                    +{p.arquivos.length - 1}
                                </div>
                            )}
                        </div>
                    )}

                    {/* REAÇÕES */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <Reacoes postId={p.id} curtidasInicial={p.curtidas} />
                    </div>

                    {/* COMENTÁRIOS */}
                    <div
                        className="postagens-comentarios"
                        onClick={(e) => e.stopPropagation()}
                    >



                        <Comentarios
                            postId={p.id}
                            onAtualizar={atualizarPosts}
                        />

                    </div>

                </div>
            ))}

            {/* MODAL DENUNCIA */}
            {denunciaPostId && (
                <Denuncia
                    tipo="post"
                    id={denunciaPostId}
                    fechar={() => setDenunciaPostId(null)}
                />
            )}
            <button onClick={carregarMais} className="postagens-loadmore">
                Carregar mais
            </button>
        </div>
    );
}