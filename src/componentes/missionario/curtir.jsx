import React, { useState } from "react";
import { API_URL } from "../../config";

import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";

import "./curtir.css";

export default function ReacoesMissionario({ post, atualizarCurtidas }) {

    const [selecionado, setSelecionado] = useState(null);
    const [animando, setAnimando] = useState(null);

    const reagir = async (tipo) => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            // 🔥 efeito visual
            setSelecionado(tipo);
            setAnimando(tipo);
            setTimeout(() => setAnimando(null), 600);

            await fetch(`${API_URL}/curtidas-missionarios/reagir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postagem_id: post.id,
                    usuario_id: user.id,
                    tipo
                })
            });

            // 🔥 atualiza só esse post
            atualizarCurtidas(post.id);

        } catch (err) {
            console.log("erro reagir:", err);
        }
    };

    return (
        <div className="post-reacoes">

            {/* LIKE */}
            <button
                className={`btn-reacao like 
                    ${selecionado === "like" ? "ativo" : ""} 
                    ${animando === "like" ? "animar" : ""}`}
                onClick={() => reagir("like")}
            >
                <img src={likeImg} alt="like" className="icone-reacao" />
                <span>{post.curtidas?.like || 0}</span>
            </button>

            {/* LOVE */}
            <button
                className={`btn-reacao love 
                    ${selecionado === "love" ? "ativo" : ""} 
                    ${animando === "love" ? "animar" : ""}`}
                onClick={() => reagir("love")}
            >
                <img src={loveImg} alt="love" className="icone-reacao" />
                <span>{post.curtidas?.love || 0}</span>
            </button>

            {/* SAD */}
            <button
                className={`btn-reacao sad 
                    ${selecionado === "sad" ? "ativo" : ""} 
                    ${animando === "sad" ? "animar" : ""}`}
                onClick={() => reagir("sad")}
            >
                <img src={sadImg} alt="sad" className="icone-reacao" />
                <span>{post.curtidas?.sad || 0}</span>
            </button>

        </div>
    );
}