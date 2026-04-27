import React, { useState } from "react";
import { API_URL } from "../../config";
import "./reacoes.css";

// 🔥 IMAGENS
import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";
import shareImg from "../imagens/emojis/compartilhar.png";
import ModalLogin from "./modallogin";

export default function Reacoes({ postId, curtidasInicial }) {

    const [selecionado, setSelecionado] = useState(null);
    const [abrirModalLogin, setAbrirModalLogin] = useState(false);
    const [animando, setAnimando] = useState(null);

    const [curtidas, setCurtidas] = useState({
        likes: curtidasInicial?.likes || 0,
        love: curtidasInicial?.love || 0,
        sad: curtidasInicial?.sad || 0
    });

    // =========================
    // 🔥 COMPARTILHAR
    // =========================
    const compartilhar = async () => {
        try {
            const url = `${window.location.origin}/postagem/${postId}`;

            if (navigator.share) {
                await navigator.share({
                    title: "Veja esta postagem",
                    url
                });
            } else {
                await navigator.clipboard.writeText(url);
                alert("Link copiado!");
            }

        } catch (err) {
            console.log("erro compartilhar:", err);
        }
    };

    // =========================
    // 🔥 REAGIR
    // =========================
    const reagir = async (tipo) => {
        try {
            const userLocal = localStorage.getItem("usuario");

            if (!userLocal) {
                setAbrirModalLogin(true);
                return;
            }

            const user = JSON.parse(userLocal);

            // 🔥 animação + estado visual
            setAnimando(tipo);
            setSelecionado(tipo);

            setTimeout(() => setAnimando(null), 600);

            await fetch(`${API_URL}/curtidas/reagir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postagem_id: postId,
                    usuario_id: user.id,
                    tipo
                })
            });

            const res = await fetch(`${API_URL}/curtidas/${postId}`);
            const data = await res.json();

            setCurtidas(data);

        } catch (err) {
            console.log("erro reagir:", err);
        }
    };

    return (
        <div className="reacoes-container">

            {/* LIKE */}
            <button
                className={`reacao-btn 
                    ${animando === "like" ? "animar" : ""} 
                    ${selecionado === "like" ? "ativo" : ""}`}
                onClick={() => reagir("like")}
            >
                <img src={likeImg} alt="like" className="reacao-img" />
                <span>{curtidas.likes}</span>
            </button>

            {/* LOVE */}
            <button
                className={`reacao-btn 
                    ${animando === "love" ? "animar" : ""} 
                    ${selecionado === "love" ? "ativo" : ""}`}
                onClick={() => reagir("love")}
            >
                <img src={loveImg} alt="love" className="reacao-img" />
                <span>{curtidas.love}</span>
            </button>

            {/* SAD */}
            <button
                className={`reacao-btn 
                    ${animando === "sad" ? "animar" : ""} 
                    ${selecionado === "sad" ? "ativo" : ""}`}
                onClick={() => reagir("sad")}
            >
                <img src={sadImg} alt="sad" className="reacao-img" />
                <span>{curtidas.sad}</span>
            </button>

            {/* SHARE */}
            <button
                className="reacao-btn"
                onClick={compartilhar}
            >
                <img src={shareImg} alt="share" className="reacao-img" />
            </button>

            {abrirModalLogin && (
                <ModalLogin fechar={() => setAbrirModalLogin(false)} />
            )}

        </div>
    );
}