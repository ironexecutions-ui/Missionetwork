import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import supabase from "./supabase";
import "./postar.css";

export default function Postar({ onPostado }) {

    const [conteudo, setConteudo] = useState("");
    const [arquivos, setArquivos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [marcados, setMarcados] = useState([]);
    const [enviando, setEnviando] = useState(false);

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

    const selecionarArquivos = (e) => {
        const files = Array.from(e.target.files);
        console.log("ARQUIVOS SELECIONADOS:", files);
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

    // 🔥 UPLOAD SUPABASE COM LOG
    const uploadParaSupabase = async (file, usuario_id) => {
        try {
            console.log("ENVIANDO PARA SUPABASE:", file);

            const extensao = file.name.split(".").pop().toLowerCase();
            const mimeType = file.type || "image/jpeg";

            const nome = `MissioNetwork/postagens/${usuario_id}-${Date.now()}-${Math.floor(Math.random() * 100000)}.${extensao}`;
            const { error } = await supabase.storage
                .from("produtos")
                .upload(nome, file, {
                    contentType: mimeType,
                    upsert: false,
                });

            if (error) {
                console.log("ERRO SUPABASE:", error);
                return null;
            }

            console.log("UPLOAD OK:", nome);

            const { data: urlData } = supabase.storage
                .from("produtos")
                .getPublicUrl(nome);

            const url = urlData?.publicUrl;

            console.log("URL GERADA:", url);

            return url || null;

        } catch (err) {
            console.log("ERRO GERAL UPLOAD:", err);
            return null;
        }
    };

    const publicar = async () => {
        try {
            console.log("INICIO PUBLICAR");

            if (!conteudo && arquivos.length === 0) return;

            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) {
                alert("Faça login");
                return;
            }

            const user = JSON.parse(userLocal);
            console.log("USUARIO:", user);

            setEnviando(true);

            // 🔥 CRIA POST
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
            console.log("POST CRIADO:", data);

            const postagem_id = data.postagem_id;

            // 🔥 UPLOAD PARA SUPABASE
            for (const file of arquivos) {

                const url = await uploadParaSupabase(file, user.id);

                if (!url) {
                    console.log("ERRO AO GERAR URL");
                    continue;
                }

                console.log("ENVIANDO PRO BACK:", url);

                const resArquivo = await fetch(`${API_URL}/postagens/arquivos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        postagem_id,
                        arquivo: url
                    })
                });

                const dataArquivo = await resArquivo.json();
                console.log("SALVO NO BACK:", dataArquivo);
            }

            // 🔥 MARCADOS
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

            console.log("FINALIZADO");

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
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome_completo?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="postar-container">

            <textarea
                placeholder="No que você está pensando?"
                value={conteudo}
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

            <input type="file" multiple onChange={selecionarArquivos} />

            <div className="postar-preview">
                {arquivos.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} />
                ))}
            </div>

            <button onClick={publicar} disabled={enviando}>
                {enviando ? "Postando..." : "Publicar"}
            </button>

        </div>
    );
}