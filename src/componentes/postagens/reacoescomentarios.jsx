import React, { useState } from "react";
import { API_URL } from "../../config";
import "./reacoescomentarios.css";

// 🔥 IMPORTA AS MESMAS IMAGENS
import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";

export default function ReacoesComentario({ comentarioId, curtidasInicial }) {

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

            <button
                className="reacao-comentario-btn"
                onClick={() => reagir("like")}
            >
                <img src={likeImg} alt="like" />
                <span>{curtidas.likes}</span>
            </button>

            <button
                className="reacao-comentario-btn"
                onClick={() => reagir("love")}
            >
                <img src={loveImg} alt="love" />
                <span>{curtidas.love}</span>
            </button>

            <button
                className="reacao-comentario-btn"
                onClick={() => reagir("sad")}
            >
                <img src={sadImg} alt="sad" />
                <span>{curtidas.sad}</span>
            </button>

        </div>
    );
}