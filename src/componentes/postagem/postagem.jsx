import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import Reacoes from "../postagens/reacoes";
import Comentarios from "../postagens/comentarios";
import ReacoesComentario from "../postagens/reacoescomentarios";
import icon from "../../icon.png"
import "./postagem.css";

export default function Postagem() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [imagemAtual, setImagemAtual] = useState(0);
    const abrirModal = (index) => {
        setImagemAtual(index);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
    };

    const proxima = () => {
        setImagemAtual((prev) =>
            prev === post.arquivos.length - 1 ? 0 : prev + 1
        );
    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setModalAberto(false);
            }
        };

        if (modalAberto) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalAberto]);
    const anterior = () => {
        setImagemAtual((prev) =>
            prev === 0 ? post.arquivos.length - 1 : prev - 1
        );
    };
    useEffect(() => {
        carregarTudo();
    }, [id]);

    const carregarTudo = async () => {
        try {
            const resPost = await fetch(`${API_URL}/postagens/completo/${id}`);
            const dataPost = await resPost.json();
            setPost(dataPost);

            const resComentarios = await fetch(`${API_URL}/comentarios/${id}`);
            const dataComentarios = await resComentarios.json();

            console.log("COMENTARIOS:", dataComentarios);

            setComentarios(dataComentarios);

        } catch (err) {
            console.log("erro geral:", err);
        } finally {
            setLoading(false);
        }
    };

    const carregarComentarios = async () => {
        try {
            const res = await fetch(`${API_URL}/comentarios/${id}`);
            const data = await res.json();
            setComentarios(data);
        } catch (err) {
            console.log("erro comentarios:", err);
        }
    };

    if (loading) {
        return <div className="postagem-loading">Carregando...</div>;
    }

    if (!post) {
        return <div className="postagem-erro">Postagem não encontrada</div>;
    }

    return (
        <div className="postagem-container">
            <div className="postagem-header-empresa">

                <button
                    className="postagem-btn-voltar"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate("/");
                        }
                    }}                >
                    ←
                </button>

                <div
                    className="postagem-empresa-click"
                    onClick={() => navigate("/")}
                >
                    <img src={icon} className="postagem-logo-empresa" />

                    <span className="postagem-nome-empresa">
                        MissioNetwork
                    </span>
                </div>

            </div>
            {/* TOPO */}
            <div className="postagem-topo">
                {post.foto ? (
                    <img src={post.foto} className="postagem-foto" />
                ) : (
                    <div className="postagem-foto-placeholder">
                        {post.nome_completo?.charAt(0) || "?"}
                    </div>
                )}

                <span className="postagem-nome">
                    {post.nome_completo}
                </span>
            </div>

            {/* TEXTO */}
            {post.conteudo && (
                <p className="postagem-conteudo">
                    {post.conteudo}
                </p>
            )}

            {/* ARQUIVOS */}
            {post.arquivos?.length > 0 && (
                <div className="postagem-arquivos">
                    {post.arquivos.map((a, i) => {
                        const url = a.arquivo || "";

                        const isVideo =
                            url.includes(".mp4") ||
                            url.includes(".webm") ||
                            url.includes(".mov");

                        return isVideo ? (
                            <video key={i} src={url} controls className="postagem-video" />
                        ) : (
                            <img
                                key={i}
                                src={url}
                                className="postagem-img"
                                onClick={() => abrirModal(i)}
                            />
                        );
                    })}
                </div>
            )}

            {/* REAÇÕES */}
            <Reacoes
                postId={post.id}
                curtidasInicial={post.curtidas}
            />

            {/* COMENTÁRIOS */}
            <div className="postagem-comentarios">

                {comentarios.length === 0 && (
                    <p className="postagem-sem-comentario">
                        Sem comentários
                    </p>
                )}

                {comentarios.map((c) => (
                    <div key={c.id} className="postagem-comentario">

                        <strong>
                            {c.usuario?.nome_completo || "Usuário"}
                        </strong>

                        <p>{c.comentario}</p>

                        <ReacoesComentario
                            comentarioId={c.id}
                            curtidasInicial={c.curtidas}
                        />

                    </div>
                ))}

                {/* INPUT */}
                <Comentarios
                    postId={post.id}
                    onAtualizar={carregarComentarios}
                />

            </div>
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>

                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <img
                            src={post.arquivos[imagemAtual]?.arquivo}
                            className="modal-img"
                        />

                        {post.arquivos.length > 1 && (
                            <>
                                <button className="modal-btn left" onClick={anterior}>
                                    ‹
                                </button>

                                <button className="modal-btn right" onClick={proxima}>
                                    ›
                                </button>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}