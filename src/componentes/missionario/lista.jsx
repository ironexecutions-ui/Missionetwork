import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./lista.css";
import logo from "../../icon.png";

export default function ListaMissionarios({ missionarios, ativo, setAtivo }) {

    const navigate = useNavigate();

    return (
        <div className="coluna-esquerda">

            <Link to="/" className="logo-container">
                <img src={logo} className="logo-img" />
                <span className="logo-texto">MissioNetwork</span>
            </Link>

            <h3 className="titulo-coluna">Missionários</h3>

            <div className="lista-missionarios">

                {missionarios.length === 0 && (
                    <div className="lista-vazio">
                        Nenhum missionário
                    </div>
                )}

                {missionarios.map((m) => {

                    // 🔥 garante id correto
                    const idReal = m.missionario_id || m.id;

                    const isAtivo =
                        Number(ativo?.missionario_id || ativo?.id) === Number(idReal);

                    return (
                        <button
                            key={m.id}
                            className={`item-missionario ${isAtivo ? "ativo" : ""}`}
                            onClick={() => {
                                setAtivo(m);
                                navigate(`/meu-missionario/${idReal}`);
                            }}
                        >

                            <div className="item-conteudo">

                                {(m.foto_perfil || m.foto) ? (
                                    <img
                                        src={m.foto_perfil || m.foto}
                                        className="avatar-img"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="avatar-fake">
                                        {m.nome?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}

                                <span className="nome-missionario">
                                    {m.nome}
                                </span>

                            </div>

                        </button>
                    );
                })}

            </div>

        </div>
    );
}