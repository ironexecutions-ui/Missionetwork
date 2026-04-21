import React from "react";
import { API_URL } from "../../config";

// 🔥 IMPORTA AS IMAGENS
import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";
import "./curtir.css"
export default function ReacoesMissionario({ post, atualizarCurtidas }) {

    const reagir = async (tipo) => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

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

            <button
                className="btn-reacao like"
                onClick={() => reagir("like")}
            >
                <img src={likeImg} alt="like" className="icone-reacao" />
                <span>{post.curtidas?.like || 0}</span>
            </button>

            <button
                className="btn-reacao love"
                onClick={() => reagir("love")}
            >
                <img src={loveImg} alt="love" className="icone-reacao" />
                <span>{post.curtidas?.love || 0}</span>
            </button>

            <button
                className="btn-reacao sad"
                onClick={() => reagir("sad")}
            >
                <img src={sadImg} alt="sad" className="icone-reacao" />
                <span>{post.curtidas?.sad || 0}</span>
            </button>

        </div>
    );
}