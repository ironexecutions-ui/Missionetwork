import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./botao.css";

export default function PainelAdmin({ usuario }) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 🔥 CORREÇÃO AQUI
    const isAdmin =
        usuario &&
        usuario.funcao &&
        usuario.funcao.trim().toLowerCase() === "admin";

    if (!isAdmin) return null;
    const acessarPainel = async () => {
        try {
            setLoading(true);

            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/verificar/admin/painel`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (res.status === 403) {
                alert("Você não tem permissão.");
                return;
            }

            if (res.status === 401) {
                alert("Sessão inválida.");
                return;
            }

            if (!res.ok) {
                alert("Erro ao validar acesso.");
                return;
            }

            // 🔥 abre em nova aba
            window.open("/perfilusuario/pedajo", "_blank");

        } catch (err) {
            console.log("Erro:", err);
            alert("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="paineladmin-btn-root"
            onClick={acessarPainel}
            disabled={loading}
        >
            {loading ? "Verificando..." : "🛠️ Painel"}
        </button>
    );
}