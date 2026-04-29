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
        const res = await fetch(`${API_URL}/admin/usuarios`);
        const data = await res.json();
        setUsuarios(data);
    };

    const abrir = (u) => {
        setSelecionado(u);
        setForm(u);
    };

    const salvar = async () => {
        await fetch(`${API_URL}/admin/usuarios/${form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        setSelecionado(null);
        carregar();
    };

    const apagar = async () => {
        await fetch(`${API_URL}/admin/usuarios/apagar/${form.id}`, {
            method: "PUT"
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

                        <input value={form.nome_completo} onChange={e => setForm({ ...form, nome_completo: e.target.value })} />
                        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

                        <input value={form.ala} onChange={e => setForm({ ...form, ala: e.target.value })} />
                        <input value={form.estaca} onChange={e => setForm({ ...form, estaca: e.target.value })} />
                        <input value={form.bispo} onChange={e => setForm({ ...form, bispo: e.target.value })} />
                        <input value={form.chamado} onChange={e => setForm({ ...form, chamado: e.target.value })} />

                        {/* FOTO PERFIL */}
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
                                    if (nova) setForm({ ...form, foto: nova });
                                }}
                            >
                                Alterar foto
                            </button>

                        </div>


                        {/* FOTO CAPA */}
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
                                    if (nova) setForm({ ...form, foto_capa: nova });
                                }}
                            >
                                Alterar capa
                            </button>

                        </div>
                        <div className="botoes">
                            <button onClick={salvar}>Salvar</button>
                            <button onClick={apagar} className="delete">Apagar</button>
                            <button onClick={() => setSelecionado(null)}>Fechar</button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}