import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import "./postar.css";

// 🔥 MODAIS
import ModalLogin from "./modallogin";
import ModalPerfilIncompleto from "./modalincompleto";

export default function Postar({ onPostado }) {

    const [conteudo, setConteudo] = useState("");
    const [arquivos, setArquivos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [marcados, setMarcados] = useState([]);
    const [enviando, setEnviando] = useState(false);
    const [dragAtivo, setDragAtivo] = useState(false);
    // 🔥 MODAIS
    const [abrirModalLogin, setAbrirModalLogin] = useState(false);
    const [abrirModalPerfil, setAbrirModalPerfil] = useState(false);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios`);
            const data = await res.json();
            setUsuarios(data);
        } catch (err) {
            console.log("ERRO USUARIOS:", err);
        }
    };

    // 🔥 VALIDAÇÃO GLOBAL
    const validarUsuario = () => {
        const userLocal = localStorage.getItem("usuario");

        if (!userLocal) {
            setAbrirModalLogin(true);
            return false;
        }

        const user = JSON.parse(userLocal);

        if (
            !user.ala ||
            !user.estaca ||
            !user.bispo ||
            !user.chamado
        ) {
            setAbrirModalPerfil(true);
            return false;
        }

        return true;
    };

    const selecionarArquivos = (e) => {
        const files = Array.from(e.target.files);
        setArquivos(prev => [...prev, ...files]);
    };

    const marcarUsuario = (user) => {
        if (!marcados.find(u => u.id === user.id)) {
            setMarcados(prev => [...prev, user]);
        }
        setBusca("");
    };

    const removerMarcado = (id) => {
        setMarcados(prev => prev.filter(u => u.id !== id));
    };

    // 🔥 UPLOAD R2
    const uploadParaR2 = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_URL}/upload-r2`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            return data.url || null;

        } catch (err) {
            console.log("ERRO UPLOAD:", err);
            return null;
        }
    };

    // 🔥 PUBLICAR
    const publicar = async () => {
        try {
            if (!conteudo && arquivos.length === 0) return;

            // 🔥 VALIDA
            if (!validarUsuario()) return;

            const user = JSON.parse(localStorage.getItem("usuario"));

            setEnviando(true);

            const res = await fetch(`${API_URL}/postagens/criar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: user.id,
                    conteudo,
                    nivel: "publico"
                })
            });

            const data = await res.json();
            const postagem_id = data.postagem_id;

            // 🔥 UPLOAD ARQUIVOS
            for (const file of arquivos) {
                const url = await uploadParaR2(file);
                if (!url) continue;

                await fetch(`${API_URL}/postagens/arquivos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        postagem_id,
                        arquivo: url
                    })
                });
            }

            // 🔥 MARCAR USUÁRIOS
            for (const m of marcados) {
                await fetch(`${API_URL}/postagens/marcados`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        postagem_id,
                        marcado: m.id
                    })
                });
            }

            setConteudo("");
            setArquivos([]);
            setMarcados([]);
            setBusca("");

            if (onPostado) onPostado();

        } catch (err) {
            console.log("ERRO PUBLICAR:", err);
        } finally {
            setEnviando(false);
        }
    }; const handleDrop = (e) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);
        setArquivos(prev => [...prev, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome_completo?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="postar-container">

            {/* 🔥 TEXTAREA BLOQUEADO */}
            <textarea
                placeholder="No que você está pensando?"
                value={conteudo}
                onFocus={(e) => {
                    if (!validarUsuario()) {
                        e.target.blur();
                    }
                }}
                onChange={(e) => setConteudo(e.target.value)}
                className="postar-textarea"
            />

            <div className="postar-marcados">
                {marcados.map(u => (
                    <span key={u.id} onClick={() => removerMarcado(u.id)}>
                        {u.nome_completo} ✕
                    </span>
                ))}
            </div>

            <input
                placeholder="Marcar pessoas..."
                value={busca}
                onFocus={(e) => {
                    if (!validarUsuario()) {
                        e.target.blur();
                    }
                }}
                onChange={(e) => setBusca(e.target.value)}
                className="postar-busca"
            />

            {busca && (
                <div className="postar-lista">
                    {usuariosFiltrados.map(u => (
                        <div key={u.id} onClick={() => marcarUsuario(u)}>
                            {u.nome_completo}
                        </div>
                    ))}
                </div>
            )}

            <label
                className={`postar-upload-area ${dragAtivo ? "drag-ativo" : ""}`}
                onClick={(e) => {
                    if (!validarUsuario()) {
                        e.preventDefault();
                    }
                }}
                onDrop={(e) => {
                    handleDrop(e);
                    setDragAtivo(false);
                }}
                onDragOver={(e) => {
                    handleDragOver(e);
                    setDragAtivo(true);
                }}
                onDragLeave={() => setDragAtivo(false)}
            >

                <input
                    type="file"
                    multiple
                    onChange={selecionarArquivos}
                    className="postar-input-hidden"
                />

                <div className="postar-upload-content">
                    <div className="postar-upload-icon">📤</div>

                    <p className="postar-upload-title">
                        Arraste arquivos ou clique para enviar
                    </p>

                    <span className="postar-upload-sub">
                        Imagens ou vídeos
                    </span>
                </div>

            </label>

            <div className="postar-preview">
                {arquivos.map((f, i) => {
                    const url = URL.createObjectURL(f);

                    if (f.type.startsWith("video")) {
                        return (
                            <video key={i} src={url} controls />
                        );
                    }

                    return <img key={i} src={url} />;
                })}
            </div>

            <button
                onClick={() => {
                    if (!validarUsuario()) return;
                    publicar();
                }}
                disabled={enviando}
            >
                {enviando ? "Postando..." : "Publicar"}
            </button>

            {/* 🔥 MODAIS */}
            {abrirModalLogin && (
                <ModalLogin fechar={() => setAbrirModalLogin(false)} />
            )}

            {abrirModalPerfil && (
                <ModalPerfilIncompleto fechar={() => setAbrirModalPerfil(false)} />
            )}

        </div>
    );
}