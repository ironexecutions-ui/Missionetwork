import React, { useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import Reacoes from "../postagens/reacoes";
import Comentarios from "../postagens/comentarios";
import ReacoesComentario from "../postagens/reacoescomentarios";
import "./cards.css";

export default function PostCard({ post, atualizar }) {

    const [comentariosVisiveis, setComentariosVisiveis] = useState(3);
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);
    const [novoConteudo, setNovoConteudo] = useState(post.conteudo);

    const carregarMais = () => {
        setComentariosVisiveis(prev => prev + 3);
    };

    const apagarPost = async () => {
        if (!window.confirm("Deseja apagar esta postagem?")) return;

        await fetch(`${API_URL}/postagens/completo/${post.id}`, {
            method: "DELETE"
        });

        atualizar();
    };

    const salvarEdicao = async () => {
        if (!novoConteudo.trim()) return;

        await fetch(`${API_URL}/postagens/atualizar/${post.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conteudo: novoConteudo,
                nivel: post.nivel
            })
        });

        setEditando(false);
        atualizar();
    };

    const cancelarEdicao = () => {
        setNovoConteudo(post.conteudo);
        setEditando(false);
    };

    const renderArquivos = () => {
        if (!post.arquivos || post.arquivos.length === 0) return null;

        return (
            <div
                className="preview-wrap"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/postagem/${post.id}`);
                }}
            >
                {/* PRIMEIRO ITEM */}
                {(() => {
                    const url = post.arquivos[0]?.arquivo || "";

                    const isVideo =
                        url.includes(".mp4") ||
                        url.includes(".webm") ||
                        url.includes(".mov");

                    return isVideo ? (
                        <video
                            src={url}
                            controls
                            className="FIX_VIDEO"
                            onClick={(e) => e.stopPropagation()} // 🔥 evita redirecionar ao dar play
                        />
                    ) : (
                        <img
                            src={url}
                            className="FIX_VIDEO"
                        />
                    );
                })()}

                {/* +X */}
                {post.arquivos.length > 1 && (
                    <div className="preview-overlay">
                        +{post.arquivos.length - 1}
                    </div>
                )}
            </div>
        );
    };




    return (
        <div className="postagens-card">

            {/* HEADER */}
            <div className="post-header">

                <div className="post-acoes">
                    {!editando && (
                        <>
                            <button onClick={() => setEditando(true)}>Editar</button>
                            <button onClick={apagarPost}>Apagar</button>
                        </>
                    )}
                </div>

            </div>

            {/* TEXTO / EDIÇÃO */}
            {!editando ? (
                <p className="postagens-conteudo">
                    {post.conteudo}
                </p>
            ) : (
                <div className="post-editar-area">

                    <textarea
                        className="post-textarea"
                        value={novoConteudo}
                        onChange={(e) => setNovoConteudo(e.target.value)}
                    />

                    <div className="post-editar-botoes">
                        <button onClick={salvarEdicao}>
                            Confirmar
                        </button>

                        <button onClick={cancelarEdicao}>
                            Cancelar
                        </button>
                    </div>

                </div>
            )}

            {/* ARQUIVOS */}
            {renderArquivos()}

            {/* REAÇÕES */}
            <Reacoes postId={post.id} curtidasInicial={post.curtidas} />

            {/* COMENTÁRIOS */}
            <div className="comentarios-area">

                {post.comentarios
                    ?.slice(0, comentariosVisiveis)
                    .map(c => (
                        <div key={c.id} className="comentario-item">

                            <strong>{c.usuario?.nome_completo}</strong>
                            <p>{c.comentario}</p>

                            <ReacoesComentario
                                comentarioId={c.id}
                                curtidasInicial={c.curtidas}
                            />
                        </div>
                    ))}

                {post.comentarios?.length > comentariosVisiveis && (
                    <button className="ver-mais" onClick={carregarMais}>
                        Ver mais comentários
                    </button>
                )}

            </div>

            <Comentarios postId={post.id} onAtualizar={atualizar} />

        </div>
    );
}