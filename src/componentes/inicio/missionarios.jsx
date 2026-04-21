import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function MissionariosSidebar() {

    const [lista, setLista] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            const res = await fetch(`${API_URL}/missionarios-usuarios/${user.id}`);
            const data = await res.json();

            setLista(data);
        } catch (err) {
            console.log("erro sidebar:", err);
        }
    };

    return (
        <div className="sidebar-bloco">

            <h3>Missionários</h3>

            {lista.length === 0 && (
                <div className="sidebar-vazio">
                    Nenhum missionário
                </div>
            )}

            {lista.map(m => {

                // 🔥 garante ID correto (evita undefined)
                const idReal = m.missionario_id || m.id;

                return (
                    <div
                        key={m.id}
                        className="sidebar-item"
                        onClick={() => navigate(`/meu-missionario/${idReal}`)}
                        style={{ cursor: "pointer" }}
                    >

                        {(m.foto || m.foto_perfil) ? (
                            <img
                                src={m.foto || m.foto_perfil}
                                className="sidebar-avatar"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="sidebar-avatar-fake">
                                {m.nome?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}

                        <div>
                            <div className="sidebar-nome">
                                {m.nome}
                            </div>
                            <div className="sidebar-tipo">
                                {m.tipo}
                            </div>
                        </div>

                    </div>
                );
            })}

        </div>
    );
}