import React, { useState } from "react";
import { API_URL } from "../../config";
import "./reacoescomentarios.css";

import likeImg from "../imagens/emojis/like.png";
import loveImg from "../imagens/emojis/love.png";
import sadImg from "../imagens/emojis/sad.png";
import ModalLogin from "./modallogin";

export default function ReacoesComentario({ comentarioId, curtidasInicial }) {

    const [selecionado, setSelecionado] = useState(null);
    const [animando, setAnimando] = useState(null);
    const [abrirModalLogin, setAbrirModalLogin] = useState(false);
    const [loadingTipo, setLoadingTipo] = useState(null); // 🔥 NOVO

    const [curtidas, setCurtidas] = useState({
        likes: curtidasInicial?.likes || 0,
        love: curtidasInicial?.love || 0,
        sad: curtidasInicial?.sad || 0
    });

    const reagir = async (tipo) => {
        try {
            const userLocal = localStorage.getItem("usuario");

            if (!userLocal) {
                setAbrirModalLogin(true);
                return;
            }

            const user = JSON.parse(userLocal);

            // 🔥 VISUAL
            setSelecionado(tipo);
            setAnimando(tipo);
            setLoadingTipo(tipo);

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
        } finally {
            setLoadingTipo(null); // 🔥 FINALIZA LOADING
        }
    };

    const renderNumero = (tipo, valor) => {
        if (loadingTipo === tipo) {
            return <div className="loader-mini"></div>;
        }
        return <span>{valor}</span>;
    };

    return (
        <div className="reacoes-comentario-container">

            <button
                className={`reacao-comentario-btn 
                    ${animando === "like" ? "animar" : ""} 
                    ${selecionado === "like" ? "ativo" : ""}`}
                onClick={() => reagir("like")}
                disabled={loadingTipo === "like"}
            >
                <img src={likeImg} alt="like" />
                {renderNumero("like", curtidas.likes)}
            </button>

            <button
                className={`reacao-comentario-btn 
                    ${animando === "love" ? "animar" : ""} 
                    ${selecionado === "love" ? "ativo" : ""}`}
                onClick={() => reagir("love")}
                disabled={loadingTipo === "love"}
            >
                <img src={loveImg} alt="love" />
                {renderNumero("love", curtidas.love)}
            </button>

            <button
                className={`reacao-comentario-btn 
                    ${animando === "sad" ? "animar" : ""} 
                    ${selecionado === "sad" ? "ativo" : ""}`}
                onClick={() => reagir("sad")}
                disabled={loadingTipo === "sad"}
            >
                <img src={sadImg} alt="sad" />
                {renderNumero("sad", curtidas.sad)}
            </button>

            {abrirModalLogin && (
                <ModalLogin fechar={() => setAbrirModalLogin(false)} />
            )}

        </div>
    );
}