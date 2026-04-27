import React, { useState } from "react";
import { API_URL } from "../../config";
import "./reacoescomentarios.css";

import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";

export default function ReacoesComentario({ comentarioId, curtidasInicial }) {

    const [selecionado, setSelecionado] = useState(null);
    const [animando, setAnimando] = useState(null);

    const [curtidas, setCurtidas] = useState({
        likes: curtidasInicial?.likes || 0,
        love: curtidasInicial?.love || 0,
        sad: curtidasInicial?.sad || 0
    });

    const reagir = async (tipo) => {
        try {
            const userLocal = localStorage.getItem("usuario");

            if (!userLocal) {
                alert("Faça login");
                return;
            }

            const user = JSON.parse(userLocal);

            // 🔥 ativa efeito visual
            setSelecionado(tipo);
            setAnimando(tipo);
            setTimeout(() => setAnimando(null), 600);

            await fetch(`${API_URL}/curtidas_comentarios/reagir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comentario_id: comentarioId,
                    usuario_id: user.id,
                    tipo
                })
            });

            const res = await fetch(`${API_URL}/curtidas_comentarios/${comentarioId}`);
            const data = await res.json();

            setCurtidas(data);

        } catch (err) {
            console.log("erro curtida comentario:", err);
        }
    };

    return (
        <div className="reacoes-comentario-container">

            {/* LIKE */}
            <button
                className={`reacao-comentario-btn 
                    ${animando === "like" ? "animar" : ""} 
                    ${selecionado === "like" ? "ativo" : ""}`}
                onClick={() => reagir("like")}
            >
                <img src={likeImg} alt="like" />
                <span>{curtidas.likes}</span>
            </button>

            {/* LOVE */}
            <button
                className={`reacao-comentario-btn 
                    ${animando === "love" ? "animar" : ""} 
                    ${selecionado === "love" ? "ativo" : ""}`}
                onClick={() => reagir("love")}
            >
                <img src={loveImg} alt="love" />
                <span>{curtidas.love}</span>
            </button>

            {/* SAD */}
            <button
                className={`reacao-comentario-btn 
                    ${animando === "sad" ? "animar" : ""} 
                    ${selecionado === "sad" ? "ativo" : ""}`}
                onClick={() => reagir("sad")}
            >
                <img src={sadImg} alt="sad" />
                <span>{curtidas.sad}</span>
            </button>

        </div>
    );
}