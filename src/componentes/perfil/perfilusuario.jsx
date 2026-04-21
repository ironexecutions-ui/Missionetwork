import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./perfilusuario.css";
import Reacoes from "../postagens/reacoes";
import Comentarios from "../postagens/comentarios";
import ReacoesComentario from "../postagens/reacoescomentarios";
import Postar from "../postagens/postar";
import { useNavigate } from "react-router-dom";
export default function PerfilUsuario() {

    const [usuario, setUsuario] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/perfil"); // volta para login
    };
    useEffect(() => {
        carregarTudo();
    }, []);

    const carregarTudo = async () => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            // 🔥 usuario
            const resUser = await fetch(`${API_URL}/usuarios/${user.id}`);
            const dataUser = await resUser.json();
            setUsuario(dataUser);

            // 🔥 posts do usuario
            const resPosts = await fetch(`${API_URL}/postagens/feed`);
            const dataPosts = await resPosts.json();

            const filtrados = dataPosts.filter(
                p => Number(p.usuario_id) === Number(user.id)
            );
            setPosts(filtrados);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="perfil-layout">

            {/* 🔥 ESQUERDA */}
            <div className="perfil-esquerda">

                {/* CAPA */}
                <div className="perfil-capa">
                    {usuario.foto_capa && (
                        <img src={usuario.foto_capa} />
                    )}
                </div>

                {/* FOTO + NOME */}
                <div className="perfil-info-topo">
                    {usuario.foto ? (
                        <img src={usuario.foto} className="perfil-foto" />
                    ) : (
                        <div className="perfil-foto-placeholder">
                            {usuario.nome_completo?.charAt(0)}
                        </div>
                    )}

                    <h2>{usuario.nome_completo}</h2>
                </div>

                {/* FRASE */}
                {usuario.frase && (
                    <p className="perfil-frase">{usuario.frase}</p>
                )}

                {/* INFOS */}
                <div className="perfil-dados">

                    {usuario.ala && <p>Ala: {usuario.ala}</p>}
                    {usuario.estaca && <p>Estaca: {usuario.estaca}</p>}
                    {usuario.bispo && <p>Bispo: {usuario.bispo}</p>}
                    {usuario.chamado && <p>Chamado: {usuario.chamado}</p>}
                    {usuario.estado_civil && <p>Estado civil: {usuario.estado_civil}</p>}
                    {usuario.sexo && <p>Sexo: {usuario.sexo}</p>}
                    {usuario.data_nascimento && <p>Nascimento: {usuario.data_nascimento}</p>}

                </div>

                <div className="perfil-logout">
                    <button onClick={logout}>
                        Sair da conta
                    </button>
                </div>

            </div>

            {/* 🔥 DIREITA */}
            <div className="perfil-direita">

                <Postar onPostado={carregarTudo} />

                {posts.map((p) => (
                    <div key={p.id} className="postagens-card">

                        <p className="postagens-conteudo">{p.conteudo}</p>

                        {/* ARQUIVOS */}
                        {p.arquivos?.map((a, i) => {
                            const isVideo = a.arquivo.includes(".mp4");

                            return isVideo ? (
                                <video key={i} src={a.arquivo} controls />
                            ) : (
                                <img key={i} src={a.arquivo} />
                            );
                        })}

                        <Reacoes postId={p.id} curtidasInicial={p.curtidas} />

                        {/* COMENTARIOS */}
                        {p.comentarios?.map(c => (
                            <div key={c.id}>
                                <strong>{c.usuario?.nome_completo}</strong>
                                <p>{c.comentario}</p>

                                <ReacoesComentario
                                    comentarioId={c.id}
                                    curtidasInicial={c.curtidas}
                                />
                            </div>
                        ))}

                        <Comentarios postId={p.id} onAtualizar={carregarTudo} />

                    </div>
                ))}

            </div>

        </div>
    );
}