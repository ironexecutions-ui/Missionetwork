import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./perfilusuario.css";
import Reacoes from "../postagens/reacoes";
import Comentarios from "../postagens/comentarios";
import ReacoesComentario from "../postagens/reacoescomentarios";
import Postar from "../postagens/postar";
import { useNavigate } from "react-router-dom";
import Header from "../header/header"
import PostCard from "./cards";
import PainelAdmin from "./botao";
import LoaderPro from "../../carregando";
export default function PerfilUsuario() {
    const [editandoCampo, setEditandoCampo] = useState(null);
    const [valorTemp, setValorTemp] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); const navigate = useNavigate();
    const [modalImagem, setModalImagem] = useState(null);
    // "foto" ou "capa"
    const trocandoCampo = React.useRef(false);
    const [previewImagem, setPreviewImagem] = useState(null);
    const logout = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        navigate("/perfil"); // volta para login
    };
    useEffect(() => {
        carregarTudo();
    }, []);

    const uploadImagem = async (file, tipo) => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            const formData = new FormData();
            formData.append("file", file);


            const res = await fetch(`${API_URL}/upload-perfil`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
                body: formData
            });

            const data = await res.json();

            if (!data.url) {
                console.log("ERRO R2");
                return;
            }

            const campo = tipo === "capa" ? "foto_capa" : "foto";

            const token = localStorage.getItem("token");

            await fetch(`${API_URL}/usuarios/${userLocal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    [campo]: data.url
                })
            });

            // 🔥 ATUALIZA LOCALSTORAGE (ESSENCIAL)
            const atualizado = {
                ...userLocal,
                [campo]: data.url
            };

            localStorage.setItem("usuario", JSON.stringify(atualizado));

            // 🔥 ATUALIZA STATE LOCAL (SEM RECARREGAR)
            setUsuario(prev => ({
                ...prev,
                [campo]: data.url
            }));

            setModalImagem(null);
            setPreviewImagem(null);

        } catch (err) {
            console.log("ERRO UPLOAD:", err);
        }
    };
    const selecionarImagem = (tipo) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setPreviewImagem(URL.createObjectURL(file));
            uploadImagem(file, tipo);
        };

        input.click();
    };
    const apagarConta = async () => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/usuarios/${userLocal.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!res.ok) {
                console.log("Erro ao apagar conta");
            }

        } catch (err) {
            console.log("Erro:", err);
        } finally {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");

            setUsuario(null);
            setPosts([]);

            navigate("/perfil");
        }
    };
    const carregarTudo = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/perfil");
                return;
            }

            const resUser = await fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!resUser.ok) {
                localStorage.clear();
                navigate("/perfil");
                return;
            }

            const dataUser = await resUser.json();

            // 🔥 ESSENCIAL
            setUsuario(dataUser);

            // 🔥 POSTS (corrigido)
            const resPosts = await fetch(`${API_URL}/postagens/feed`);
            const dataPosts = await resPosts.json();

            const filtrados = dataPosts.filter(
                p => Number(p.usuario_id) === Number(dataUser.id)
            );

            setPosts(filtrados);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <LoaderPro
                texto="Carregando perfil"
                subtitulo="Buscando seus dados"
            />
        );
    }
    if (usuario && usuario.termos === 0) {
        return (
            <div className="termos-bloqueio-root">

                <div className="termos-bloqueio-card">

                    <h2 className="termos-titulo">
                        Atenção
                    </h2>

                    <p className="termos-texto">
                        Esta conta não aceitou os termos de uso e será removida.
                    </p>

                    <button
                        className="termos-btn-aceitar"
                        onClick={apagarConta}                    >
                        Aceitar e apagar conta
                    </button>

                </div>

            </div>
        );
    }
    const salvarCampo = async (campo) => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            const token = localStorage.getItem("token");

            await fetch(`${API_URL}/usuarios/${userLocal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    [campo]: valorTemp
                })
            });

            const atualizado = {
                ...userLocal,
                [campo]: valorTemp
            };

            localStorage.setItem("usuario", JSON.stringify(atualizado));

            setUsuario(prev => ({
                ...prev,
                [campo]: valorTemp
            }));

            // 🚫 NÃO FECHA MAIS O INPUT AQUI

        } catch (err) {
            console.log("erro ao salvar:", err);
        }
    };

    return (
        <div className="perfil-root">

            <Header />

            <div className="perfil-layout">

                <div className="perfil-esquerda">

                    {/* CAPA */}
                    <div
                        className="perfil-capa"
                        onClick={() => {
                            if (usuario.foto_capa) {
                                setModalImagem("capa");
                                setPreviewImagem(usuario.foto_capa);
                            } else {
                                selecionarImagem("capa");
                            }
                        }}
                    >



                        {usuario.foto_capa ? (
                            <img src={usuario.foto_capa} alt="capa" />
                        ) : (
                            <div className="perfil-capa-vazia">
                                Clique para adicionar capa
                            </div>
                        )}

                        <div className="perfil-capa-overlay">
                            Alterar capa
                        </div>

                    </div>

                    {/* FOTO + NOME */}
                    <div className="perfil-info-topo">

                        <div className="perfil-foto-area">
                            {usuario.foto ? (
                                <img
                                    src={usuario.foto}
                                    className="perfil-foto"
                                    onClick={() => selecionarImagem("foto")}
                                />
                            ) : (
                                <div
                                    className="perfil-foto-placeholder"
                                    onClick={() => selecionarImagem("foto")}
                                >
                                    {usuario.nome_completo?.charAt(0)}
                                </div>
                            )}

                            <div className="perfil-foto-overlay">
                                Alterar
                            </div>
                        </div>

                        <div className="perfil-nome-area">
                            <h2>{usuario.nome_completo}</h2>

                        </div>

                    </div>

                    {/* FRASE */}
                    <p className="perfil-frase">
                        {editandoCampo === "frase" ? (
                            <input
                                className="perfil-input-inline"
                                value={valorTemp}
                                autoFocus
                                onChange={(e) => setValorTemp(e.target.value)}
                                onBlur={() => salvarCampo("frase")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") salvarCampo("frase");
                                }}
                            />
                        ) : (
                            <span
                                onClick={() => {
                                    setEditandoCampo("frase");
                                    setValorTemp(usuario.frase || "");
                                }}
                            >
                                {usuario.frase || "Clique para adicionar uma frase"}
                            </span>
                        )}
                    </p>

                    {/* INFOS */}
                    <div className="perfil-dados">

                        {[
                            ["Ala", "ala", usuario.ala],
                            ["Estaca", "estaca", usuario.estaca],
                            ["Bispo", "bispo", usuario.bispo],
                            ["Chamado", "chamado", usuario.chamado],
                            ["Estado civil", "estado_civil", usuario.estado_civil],
                            ["Sexo", "sexo", usuario.sexo],
                            ["Nascimento", "data_nascimento", usuario.data_nascimento],
                        ].map(([label, campo, valor], i) => (
                            <div key={i} className="perfil-dado-item">

                                <span>{label}</span>

                                {editandoCampo === campo ? (
                                    <input
                                        className="perfil-input-inline"
                                        value={valorTemp}
                                        autoFocus
                                        onChange={(e) => setValorTemp(e.target.value)}
                                        onBlur={() => {
                                            salvarCampo(campo);

                                            // 👉 só fecha se NÃO estiver trocando de campo
                                            if (!trocandoCampo.current) {
                                                setEditandoCampo(null);
                                                setValorTemp("");
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") salvarCampo(campo);
                                        }}
                                    />
                                ) : (
                                    <strong
                                        onClick={() => {
                                            setEditandoCampo(campo);
                                            setValorTemp(valor || "");
                                        }}
                                    >
                                        {valor || "Adicionar"}
                                    </strong>
                                )}

                            </div>
                        ))}

                    </div>

                    {/* BOTÕES */}
                    <div className="perfil-acoes">
                        <PainelAdmin usuario={usuario} />

                        <button
                            className="perfil-btn-config"
                            onClick={() => navigate("/config")}
                        >
                            ⚙️ Configurações
                        </button>

                        <button
                            className="perfil-btn-logout"
                            onClick={logout}
                        >
                            Sair
                        </button>

                    </div>

                </div>
                {/* 🔥 DIREITA */}
                <div className="perfil-direita">

                    <Postar onPostado={carregarTudo} />

                    {posts.map((p) => (
                        <PostCard
                            key={p.id}
                            post={p}
                            atualizar={carregarTudo}
                        />
                    ))}

                </div>

                {/* 🔥 MODAL IMAGEM */}
                {modalImagem && (
                    <div
                        className="modal-overlay"
                        onClick={() => setModalImagem(null)}
                    >
                        <div
                            className="modal-conteudo"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={previewImagem} className="modal-imagem" />

                            <button
                                className="modal-botao"
                                onClick={() => selecionarImagem(modalImagem)}
                            >
                                Trocar imagem
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}