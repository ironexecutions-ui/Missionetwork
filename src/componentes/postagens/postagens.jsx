import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./postagens.css";
import Reacoes from "./reacoes";
import Comentarios from "./comentarios";
import ReacoesComentario from "./reacoescomentarios";
import Postar from "./postar";
import { useNavigate } from "react-router-dom";

export default function Postagens() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        carregarPostsInicial();
    }, []);

    const carregarPostsInicial = async () => {
        try {
            const res = await fetch(`${API_URL}/postagens/feed`);
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
            const res = await fetch(`${API_URL}/postagens/feed`);
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.log("erro atualizar:", err);
        }
    };

    if (loading) {
        return <div className="postagens-loading">Carregando...</div>;
    }

    return (
        <div className="postagens-container">

            <Postar onPostado={atualizarPosts} />

            {posts.length === 0 && (
                <p className="postagens-vazio">Nenhuma postagem ainda</p>
            )}

            {posts.map((p) => (
                <div
                    key={p.id}
                    className="postagens-card"
                    onClick={() => navigate(`/postagem/${p.id}`)}
                >

                    {/* TOPO */}
                    <div className="postagens-topo">

                        {p.foto ? (
                            <img
                                src={p.foto}
                                className="postagens-foto"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div className="postagens-foto-placeholder">
                                {p.nome_completo?.charAt(0) || "?"}
                            </div>
                        )}

                        <div>
                            <span
                                className="postagens-nome"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/visita/${p.usuario_id}`);
                                }}
                            >
                                {p.nome_completo || "Usuário"}
                            </span>

                            {p.marcados?.length > 0 && (
                                <div className="postagens-marcados">
                                    {p.marcados.map((m, i) => (
                                        <span
                                            key={i}
                                            className="postagens-marcado"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            @{m.nome_completo}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TEXTO */}
                    {p.conteudo && (
                        <p
                            className="postagens-conteudo"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {p.conteudo}
                        </p>
                    )}

                    {/* IMAGENS */}
                    {p.arquivos?.length > 0 && (
                        <div className={`postagens-grid total-${p.arquivos.length}`}>

                            {p.arquivos.slice(0, 4).map((a, i) => {
                                const url = a.arquivo || "";
                                const restante = p.arquivos.length - 4;

                                if (i === 3 && restante > 0) {
                                    return (
                                        <div
                                            key={i}
                                            className="postagens-grid-item overlay"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/postagem/${p.id}`);
                                            }}
                                        >
                                            <img src={url} />
                                            <div className="overlay-text">+{restante}</div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={i}
                                        className="postagens-grid-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/postagem/${p.id}`);
                                        }}
                                    >
                                        <img src={url} />
                                    </div>
                                );
                            })}

                        </div>
                    )}

                    {/* REAÇÕES */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <Reacoes
                            postId={p.id}
                            curtidasInicial={p.curtidas}
                        />
                    </div>

                    {/* COMENTÁRIOS */}
                    <div
                        className="postagens-comentarios"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {p.comentarios?.map((c) => (
                            <div key={c.id} className="postagens-comentario">

                                <strong
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/visita/${c.usuario?.id}`);
                                    }}
                                >
                                    {c.usuario?.nome_completo}
                                </strong>

                                <p>{c.comentario}</p>

                                <ReacoesComentario
                                    comentarioId={c.id}
                                    curtidasInicial={c.curtidas}
                                />
                            </div>
                        ))}

                        <Comentarios
                            postId={p.id}
                            onAtualizar={atualizarPosts}
                        />

                    </div>

                </div>
            ))}

        </div>
    );
}