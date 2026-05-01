import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import ComentariosMissionario from "./comentarios";
import ReacoesMissionario from "./curtir";
import "./feed.css";

export default function FeedMissionario({ posts, loading, missionarioAtivo }) {

    const [postsLocal, setPostsLocal] = useState([]);

    useEffect(() => {
        setPostsLocal(Array.isArray(posts) ? posts : []);
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

    const formatarImagem = (url) => {
        if (!url) return "https://i.imgur.com/6VBx3io.png";

        try {
            if (url.includes("googleusercontent.com/d/")) {
                const id = url.split("/d/")[1].split("/")[0];
                return `https://lh3.googleusercontent.com/d/${id}=s400`;
            }

            if (url.includes("/d/")) {
                const id = url.split("/d/")[1].split("/")[0];
                return `https://lh3.googleusercontent.com/d/${id}=s400`;
            }

            if (url.includes("id=")) {
                const id = url.split("id=")[1].split("&")[0];
                return `https://lh3.googleusercontent.com/d/${id}=s400`;
            }

            return url;

        } catch {
            return "https://i.imgur.com/6VBx3io.png";
        }
    };

    return (
        <div className="coluna-centro">

            {/* 🔥 loading */}
            {loading && (
                <p className="loading">Carregando...</p>
            )}

            {/* 🔥 sem missionário */}
            {!missionarioAtivo && !loading && (
                <p className="sem-posts">Selecione um missionário</p>
            )}

            {/* 🔥 sem posts */}
            {!loading && missionarioAtivo && postsLocal.length === 0 && (
                <p className="sem-posts">Nenhuma postagem encontrada</p>
            )}

            {/* 🔥 LISTA */}
            {!loading && missionarioAtivo && postsLocal.map((p) => (

                <div key={p.id} className="post-card">

                    <div className="post-header">
                        <img
                            src={formatarImagem(p.foto_perfil)}
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