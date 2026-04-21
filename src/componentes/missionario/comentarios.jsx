import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./comentarios.css"
export default function ComentariosMissionario({ postId }) {

    const [comentarios, setComentarios] = useState([]);
    const [texto, setTexto] = useState("");

    // 🔥 carregar comentários
    const carregar = async () => {
        try {
            const res = await fetch(`${API_URL}/comentarios-missionarios/${postId}`);
            const data = await res.json();
            setComentarios(data);
        } catch (err) {
            console.log("erro comentarios:", err);
        }
    };

    useEffect(() => {
        carregar();
    }, [postId]);

    // 🔥 enviar comentário
    const enviar = async () => {
        try {
            if (!texto.trim()) return;

            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            await fetch(`${API_URL}/comentarios-missionarios/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post_id: postId,
                    usuario_id: user.id,
                    comentario: texto
                })
            });

            setTexto("");
            carregar();

        } catch (err) {
            console.log("erro enviar comentario:", err);
        }
    };

    return (
        <div className="comentarios-container">

            {/* LISTA */}
            {comentarios.map((c) => (
                <div key={c.id} className="comentario-item">
                    <strong>{c.nome_completo}</strong>
                    <p>{c.comentario}</p>
                </div>
            ))}

            {/* INPUT */}
            <div className="comentario-box">
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="comentario-input"
                />

                <button onClick={enviar} className="comentario-btn">
                    Enviar
                </button>
            </div>

        </div>
    );
}