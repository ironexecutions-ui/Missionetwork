import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../../config";
import "./usuarios.css";

export default function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/admin/usuarios`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const text = await res.text();

        const data = JSON.parse(text); // 🔥 AQUI É O QUE FALTOU

        setUsuarios(data);
    };

    const abrir = (u) => {
        setSelecionado(u);
        setForm(u);
    };

    const salvar = async () => {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/admin/usuarios/${form.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(form)
        });

        setSelecionado(null);
        carregar();
    };

    const apagar = async () => {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/admin/usuarios/apagar/${form.id}`, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token
            }
        });

        setSelecionado(null);
        carregar();
    };

    return (
        <div className="usuarios-container">

            <div className="usuarios-lista">
                {usuarios.map(u => (
                    <div key={u.id} className="usuario-item" onClick={() => abrir(u)}>
                        <div className="usuario-info">

                            <div className="usuario-foto">
                                <div className="usuario-foto">
                                    {u.foto ? (
                                        <img src={u.foto} alt="perfil" />
                                    ) : (
                                        <div className="usuario-inicial">
                                            {u.nome_completo?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="usuario-texto">
                                <strong>{u.nome_completo}</strong>
                                <p>{u.email}</p>
                                <small>{u.funcao}</small>
                            </div>

                        </div>

                        <span className={u.habilitado ? "ok" : "no"}>
                            {u.habilitado ? "Habilitado" : "Não habilitado"}
                        </span>
                    </div>
                ))}
            </div>

            {selecionado && (
                <div className="modal">

                    <div className="modal-box">

                        <h2>Editar usuário</h2>

                        <label>Nome Completo</label>
                        <input
                            value={form.nome_completo || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    nome_completo: e.target.value
                                })
                            }
                        />

                        <label>Email</label>
                        <input
                            value={form.email || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                        />

                        <label>Função</label>
                        <select
                            value={form.funcao || "user"}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    funcao: e.target.value
                                })
                            }
                        >
                            <option value="user">User</option>
                            <option value="Admin">Admin</option>
                            <option value="CTM">CTM</option>
                        </select>

                        <label>Ala</label>
                        <input
                            value={form.ala || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    ala: e.target.value
                                })
                            }
                        />

                        <label>Estaca</label>
                        <input
                            value={form.estaca || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    estaca: e.target.value
                                })
                            }
                        />

                        <label>Bispo</label>
                        <input
                            value={form.bispo || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    bispo: e.target.value
                                })
                            }
                        />

                        <label>Chamado</label>
                        <input
                            value={form.chamado || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    chamado: e.target.value
                                })
                            }
                        />

                        <div className="img-group">

                            <label>Foto de Perfil</label>

                            <img
                                src={form.foto || "https://via.placeholder.com/150"}
                                alt="foto perfil"
                                className="preview-img"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    const nova = prompt("Cole o link da nova foto");
                                    if (nova) {
                                        setForm({
                                            ...form,
                                            foto: nova
                                        });
                                    }
                                }}
                            >
                                Alterar foto
                            </button>

                        </div>

                        <div className="img-group">

                            <label>Foto de Capa</label>

                            <img
                                src={form.foto_capa || "https://via.placeholder.com/300x120"}
                                alt="foto capa"
                                className="preview-img capa"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    const nova = prompt("Cole o link da nova capa");
                                    if (nova) {
                                        setForm({
                                            ...form,
                                            foto_capa: nova
                                        });
                                    }
                                }}
                            >
                                Alterar capa
                            </button>

                        </div>

                        <div className="botoes">
                            <button onClick={salvar}>
                                Salvar
                            </button>

                            <button
                                onClick={apagar}
                                className="delete"
                            >
                                Apagar
                            </button>

                            <button
                                onClick={() =>
                                    setSelecionado(null)
                                }
                            >
                                Fechar
                            </button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}