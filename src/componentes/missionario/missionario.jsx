import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./missionario.css";
import BottomNav from "../header/nav";
import ListaMissionarios from "./lista";
import FeedMissionario from "./feed";
import BuscaMissionario from "./busca";
import { useParams } from "react-router-dom";
import Header from "../header/header";
export default function Missionario() {

    const [missionarios, setMissionarios] = useState([]);
    const [missionarioAtivo, setMissionarioAtivo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [abaAtiva, setAbaAtiva] = useState("feed");
    const [mobile, setMobile] = useState(false);

    const { id } = useParams();

    /* =========================
       RESPONSIVO
    ========================= */
    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 1000);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* =========================
       CARREGAR MISSIONÁRIOS
    ========================= */
    const carregarMissionarios = async () => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            const res = await fetch(`${API_URL}/missionarios-usuarios`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }); const data = await res.json();

            setMissionarios(data);

            if (id) {
                const encontrado = data.find(
                    m => Number(m.missionario_id || m.id) === Number(id)
                );

                if (encontrado) {
                    setMissionarioAtivo(encontrado);
                    return;
                }
            }

            if (data.length > 0) {
                setMissionarioAtivo(data[0]);
            }

        } catch (err) {
            console.log("erro missionarios:", err);
        }
    };

    /* =========================
       CARREGAR POSTS
    ========================= */
    const carregarPosts = async () => {
        try {
            setLoading(true);

            const idReal =
                missionarioAtivo?.missionario_id ||
                missionarioAtivo?.id;


            if (!idReal) {
                console.log("ID inválido");
                setPosts([]);
                return;
            }

            const res = await fetch(`${API_URL}/missionarioss/postagens/${idReal}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            const data = await res.json();

            console.log("POSTS RECEBIDOS:", data);

            if (Array.isArray(data)) {
                setPosts(data);
            } else if (Array.isArray(data.postagens)) {
                setPosts(data.postagens);
            } else if (Array.isArray(data.dados)) {
                setPosts(data.dados);
            } else {
                console.log("FORMATO DESCONHECIDO:", data);
                setPosts([]);
            }
        } catch (err) {
            console.log("erro posts:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarMissionarios();
    }, [id]);

    useEffect(() => {
        if (!missionarioAtivo) return;

        const idReal =
            missionarioAtivo?.missionario_id ||
            missionarioAtivo?.id;

        if (!idReal) return;

        carregarPosts();

    }, [missionarioAtivo?.missionario_id, missionarioAtivo?.id]);

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="missionario-container">
            <Header />
            {/* HEADER MOBILE */}
            {mobile && (
                <div className="missionario-header">

                    <div className="missionario-tabs">
                        <button
                            className={abaAtiva === "lista" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("lista")}
                        >
                            Lista
                        </button>

                        <button
                            className={abaAtiva === "busca" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("busca")}
                        >
                            Buscar
                        </button>

                        <button
                            className={abaAtiva === "feed" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("feed")}
                        >
                            Feed
                        </button>
                    </div>

                </div>
            )}

            {/* CONTEÚDO */}
            <div className="missionario-body">

                {mobile ? (
                    <>
                        {abaAtiva === "lista" && (
                            <ListaMissionarios
                                missionarios={missionarios}
                                ativo={missionarioAtivo}
                                setAtivo={setMissionarioAtivo}
                            />
                        )}

                        {abaAtiva === "busca" && (
                            <BuscaMissionario atualizarLista={carregarMissionarios} />
                        )}

                        {abaAtiva === "feed" && (
                            <FeedMissionario
                                posts={posts}
                                loading={loading}
                                missionarioAtivo={missionarioAtivo}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <ListaMissionarios
                            missionarios={missionarios}
                            ativo={missionarioAtivo}
                            setAtivo={setMissionarioAtivo}
                        />

                        <FeedMissionario
                            posts={posts}
                            loading={loading}
                            missionarioAtivo={missionarioAtivo}
                        />

                        <BuscaMissionario atualizarLista={carregarMissionarios} />
                    </>
                )}

            </div>
            <BottomNav />
        </div>
    );
}