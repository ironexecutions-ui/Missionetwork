import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function FamiliaresSidebar() {

    const [lista, setLista] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            const res = await fetch(`${API_URL}/familiares/${user.id}`);
            const data = await res.json();

            setLista(data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="sidebar-bloco">

            <h3>Familiares</h3>

            {lista.length === 0 && (
                <div className="sidebar-vazio">
                    Nenhum familiar
                </div>
            )}

            {lista.map(f => (
                <div
                    key={f.id}
                    className="sidebar-item"
                    onClick={() => navigate(`/visita/${f.familiar_id}`)}
                    style={{ cursor: "pointer" }}
                >

                    {f.foto ? (
                        <img src={f.foto} className="sidebar-avatar" />
                    ) : (
                        <div className="sidebar-avatar-fake">
                            {f.nome_completo?.charAt(0)}
                        </div>
                    )}

                    <div>
                        <div className="sidebar-nome">
                            {f.nome_completo}
                        </div>
                        <div className="sidebar-tipo">
                            {f.tipo_familiar}
                        </div>
                    </div>

                </div>
            ))}

        </div>
    );
}