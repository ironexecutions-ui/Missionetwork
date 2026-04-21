import React, { useState } from "react";
import { API_URL } from "../../config";
import "./comentarios.css"
export default function Comentarios({ postId, onAtualizar }) {

    const [texto, setTexto] = useState("");
    const [loading, setLoading] = useState(false);

    const enviarComentario = async () => {
        try {
            if (!texto.trim()) return;

            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) {
                alert("Faça login");
                return;
            }

            const user = JSON.parse(userLocal);

            setLoading(true);

            await fetch(`${API_URL}/comentarios/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postagem_id: postId,
                    usuario_id: user.id,
                    comentario: texto
                })
            });

            setTexto("");

            // 🔥 atualiza o feed
            onAtualizar();

        } catch (err) {
            console.log("erro comentar:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comentarios-input-area">

            <input
                type="text"
                placeholder="Escreva um comentário..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="comentarios-input"
            />

            <button
                onClick={enviarComentario}
                className="comentarios-botao"
                disabled={loading}
            >
                {loading ? "..." : "Enviar"}
            </button>

        </div>
    );
}