import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./missionario.css";

import ListaMissionarios from "./lista";
import FeedMissionario from "./feed";
import BuscaMissionario from "./busca";
import { useParams } from "react-router-dom";

export default function Missionario() {

    const [missionarios, setMissionarios] = useState([]);
    const [missionarioAtivo, setMissionarioAtivo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams(); // 🔥 vem da URL

    // 🔥 CARREGAR MISSIONÁRIOS
    const carregarMissionarios = async () => {
        try {
            const userLocal = localStorage.getItem("usuario");
            if (!userLocal) return;

            const user = JSON.parse(userLocal);

            const res = await fetch(`${API_URL}/missionario/missionario-usuarios/${user.id}`);
            const data = await res.json();

            setMissionarios(data);

            // 🔥 se tem id na URL → usa ele
            if (id) {
                const encontrado = data.find(
                    m => Number(m.missionario_id || m.id) === Number(id)
                );

                if (encontrado) {
                    console.log("ENCONTRADO:", encontrado); // 👈 debug
                    setMissionarioAtivo(encontrado);
                    return;
                }
            }

            // 🔥 fallback
            if (data.length > 0) {
                setMissionarioAtivo(data[0]);
            }

        } catch (err) {
            console.log("erro missionarios:", err);
        }
    };

    // 🔥 CARREGAR POSTS
    const carregarPosts = async () => {

        if (!missionarioAtivo || !missionarioAtivo.email || missionarioAtivo.auth === 0) {
            setPosts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/missionario/postagens/${missionarioAtivo.email}`);
            const data = await res.json();

            setPosts(data);

        } catch (err) {
            console.log("erro posts:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 QUANDO CARREGA OU MUDA ID
    useEffect(() => {
        carregarMissionarios();
    }, [id]);

    // 🔥 QUANDO MUDA ATIVO
    useEffect(() => {
        if (missionarioAtivo) {
            carregarPosts();
        }
    }, [missionarioAtivo]);

    return (
        <div className="layout-missionario">

            {/* 🔥 ESQUERDA */}
            <ListaMissionarios
                missionarios={missionarios}
                ativo={missionarioAtivo}
                setAtivo={setMissionarioAtivo}
            />

            {/* 🔥 CENTRO */}
            <FeedMissionario
                posts={posts}
                loading={loading}
                missionarioAtivo={missionarioAtivo}
            />

            {/* 🔥 DIREITA */}
            <BuscaMissionario atualizarLista={carregarMissionarios} />

        </div>
    );
}