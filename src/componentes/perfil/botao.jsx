import React, { useState } from "react";
import { API_URL } from "../../config";
import "./botao.css";

export default function PainelAdmin({ usuario }) {

    const [loading, setLoading] = useState(false);

    const funcao =
        usuario?.funcao?.trim().toLowerCase();

    const isAdmin =
        funcao === "admin";

    const isCtm =
        funcao === "ctm";

    if (!isAdmin && !isCtm) return null;

    const acessarPainel = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `${API_URL}/verificar/admin/painel`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

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

            window.open(
                "/perfilusuario/pedajo",
                "_blank"
            );

        } catch (err) {
            console.log("Erro:", err);
            alert("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}
        >
            {isAdmin && (
                <button
                    className="paineladmin-btn-root"
                    onClick={acessarPainel}
                    disabled={loading}
                >
                    {loading
                        ? "Verificando..."
                        : "🛠️ Painel"}
                </button>
            )}

            <button
                className="paineladmin-btn-root"
                onClick={() => {

                    const tokenCamera =
                        localStorage.getItem(
                            "token_camera"
                        );

                    if (!tokenCamera) {

                        alert(
                            "Token da câmera não encontrado."
                        );

                        return;
                    }

                    window.open(
                        `/camera-ctm/${tokenCamera}`,
                        "_blank"
                    );

                }}
            >
                📷 Camera
            </button>
        </div>
    );
}