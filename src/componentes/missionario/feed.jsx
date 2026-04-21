import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import ComentariosMissionario from "./comentarios";
import ReacoesMissionario from "./curtir";
import "./feed.css";

export default function FeedMissionario({ posts, loading, missionarioAtivo }) {

    const [postsLocal, setPostsLocal] = useState([]);

    useEffect(() => {
        setPostsLocal(posts);
    }, [posts]);

    const atualizarCurtidas = async (postId) => {
        try {
            const res = await fetch(`${API_URL}/curtidas-missionarios/${postId}`);
            const curtidas = await res.json();

            setPostsLocal(prev =>
                prev.map(p =>
                    p.id === postId
                        ? { ...p, curtidas }
                        : p
                )
            );
        } catch (err) {
            console.log("erro curtidas:", err);
        }
    };

    return (
        <div className="coluna-centro">

            {missionarioAtivo?.auth === 0 && (
                <p className="nao-autorizado">Aguardando autorização</p>
            )}

            {loading && (
                <p className="loading">Carregando...</p>
            )}

            {!loading && missionarioAtivo?.auth === 1 && postsLocal.length === 0 && (
                <p className="sem-posts">Nenhuma postagem encontrada</p>
            )}

            {!loading && missionarioAtivo?.auth === 1 && postsLocal.map((p) => (

                <div key={p.id} className="post-card">

                    <div className="post-header">
                        <img
                            src={p.foto_perfil || "https://i.imgur.com/6VBx3io.png"}
                            className="post-avatar"
                            onError={(e) => {
                                e.target.src = "https://i.imgur.com/6VBx3io.png";
                            }}
                        />
                        <span className="post-nome">{p.nome}</span>
                    </div>

                    {p.texto && (
                        <p className="post-texto">{p.texto}</p>
                    )}

                    {p.imagem_url && (
                        <div className="post-media">
                            <img
                                src={p.imagem_url}
                                className="post-img"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* 🔥 REAÇÕES AGORA SEPARADAS */}
                    <ReacoesMissionario
                        post={p}
                        atualizarCurtidas={atualizarCurtidas}
                    />

                    <ComentariosMissionario postId={p.id} />

                </div>

            ))}

        </div>
    );
}