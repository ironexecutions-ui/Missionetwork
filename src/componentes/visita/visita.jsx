import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";
import "./visita.css";
import { Link } from "react-router-dom";
import logo from "../../icon.png";
import Reacoes from "../postagens/reacoes";
import Comentarios from "../postagens/comentarios";
import ReacoesComentario from "../postagens/reacoescomentarios";

export default function Visita() {

    const { id } = useParams();

    const [usuario, setUsuario] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarTudo();
    }, [id]);

    const carregarTudo = async () => {
        try {

            setLoading(true);

            // 🔥 usuário
            const resUser = await fetch(`${API_URL}/usuarios/publico/${id}`);
            const dataUser = await resUser.json();
            setUsuario(dataUser);

            // 🔥 posts
            const resPosts = await fetch(`${API_URL}/postagens/usuario-completo/${id}`);
            const dataPosts = await resPosts.json();

            const filtrados = dataPosts.filter(
                p => Number(p.usuario_id) === Number(id)
            );

            setPosts(filtrados);

        } catch (err) {
            console.log("erro visita:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="visita-loading">Carregando...</div>;
    if (!usuario) return <div className="visita-erro">Usuário não encontrado</div>;

    return (
        <div className="perfil-layout">

            {/* 🔥 PERFIL */}
            <div className="perfil-esquerda">

                {/* CAPA */}
                <div className="perfil-capa">
                    {usuario.foto_capa ? (
                        <img
                            src={usuario.foto_capa}
                            onError={(e) => e.target.style.display = "none"}
                        />
                    ) : (
                        <div className="perfil-capa-vazia">
                            Vazio
                        </div>
                    )}
                </div>

                {/* FOTO + NOME */}
                <div className="perfil-info-topo">
                    {usuario.foto ? (
                        <img
                            src={usuario.foto}
                            className="perfil-foto"
                            onError={(e) => e.target.style.display = "none"}
                        />
                    ) : (
                        <div className="perfil-foto-placeholder">
                            {usuario.nome_completo?.charAt(0) || "?"}
                        </div>
                    )}

                    <h2>{usuario.nome_completo || "Vazio"}</h2>
                </div>

                {/* FRASE */}
                <p className="perfil-frase">
                    {usuario.frase || "Vazio"}
                </p>

                {/* INFOS */}
                <div className="perfil-dados">
                    <p>Ala: {usuario.ala || "Sem informação"}</p>
                    <p>Estaca: {usuario.estaca || "Sem informação"}</p>
                    <p>Bispo: {usuario.bispo || "Sem informação"}</p>
                    <p>Chamado: {usuario.chamado || "Sem informação"}</p>
                    <p>Estado civil: {usuario.estado_civil || "Sem informação"}</p>
                    <p>Sexo: {usuario.sexo || "Sem informação"}</p>
                    <p>Nascimento: {usuario.data_nascimento || "Sem informação"}</p>
                </div>
                <Link to="/" className="perfil-footer-logo">

                    <img src={logo} className="perfil-footer-img" />

                    <span className="perfil-footer-texto">
                        MissioNetwork
                    </span>

                </Link>
            </div>

            {/* 🔥 POSTS */}
            <div className="perfil-direita">

                {posts.length === 0 && (
                    <div className="sem-postagens">
                        Sem postagens
                    </div>
                )}

                {posts.map((p) => (
                    <div key={p.id} className="postagens-card">

                        <p className="postagens-conteudo">
                            {p.conteudo || "Vazio"}
                        </p>

                        {/* ARQUIVOS */}
                        {p.arquivos?.map((a, i) => {
                            const isVideo = a.arquivo?.includes(".mp4");

                            return isVideo ? (
                                <video key={i} src={a.arquivo} controls />
                            ) : (
                                <img
                                    key={i}
                                    src={a.arquivo}
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            );
                        })}

                        <Reacoes postId={p.id} curtidasInicial={p.curtidas} />

                        {/* COMENTÁRIOS */}
                        {p.comentarios?.map(c => (
                            <div key={c.id} className="comentario-item">
                                <strong>
                                    {c.usuario?.nome_completo || "Vazio"}
                                </strong>
                                <p>{c.comentario || "Vazio"}</p>

                                <ReacoesComentario
                                    comentarioId={c.id}
                                    curtidasInicial={c.curtidas}
                                />
                            </div>
                        ))}

                        <Comentarios
                            postId={p.id}
                            onAtualizar={carregarTudo}
                        />

                    </div>
                ))}

            </div>

        </div>
    );
}