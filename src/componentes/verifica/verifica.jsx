import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./verifica.css";

export default function Pedajo() {

    const navigate = useNavigate();

    const [status, setStatus] = useState("verificando");
    const [mensagem, setMensagem] = useState("Analisando permissões...");
    const [tempo, setTempo] = useState(5);
    const [nome, setNome] = useState("");

    useEffect(() => {
        verificar();
    }, []);

    useEffect(() => {
        if (status === "autorizado") {
            const timer = setInterval(() => {
                setTempo((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate("/painel");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status]);

    const verificar = async () => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            if (!userLocal || !userLocal.id) {
                setStatus("negado");
                setMensagem("Usuário não identificado.");
                return;
            }

            // 🔥 1. verifica se é admin
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/verificar/admin/painel`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (res.status === 403) {
                setStatus("negado");
                setMensagem("Acesso restrito. Você não possui privilégios administrativos.");
                return;
            }

            if (res.status === 401) {
                setStatus("negado");
                setMensagem("Sessão inválida. Faça login novamente.");
                return;
            }

            if (!res.ok) {
                setStatus("negado");
                setMensagem("Erro ao validar permissões.");
                return;
            }

            // 🔥 2. pega nome do usuário
            const resUser = await fetch(`${API_URL}/usuarios/${userLocal.id}`);
            const dataUser = await resUser.json();

            const nomeUsuario = dataUser.nome_completo || "Usuário";

            setNome(nomeUsuario);

            // 🔥 3. mensagem personalizada
            setStatus("autorizado");
            setMensagem(
                `Seja bem-vindo(a), ${nomeUsuario}. Você será redirecionado(a) ao painel de controle.`
            );

        } catch (err) {
            console.log(err);
            setStatus("negado");
            setMensagem("Erro inesperado na verificação.");
        }
    };

    return (

        <div className="pedajo-card">

            <h2 className="pedajo-titulo">
                Verificação de Acesso
            </h2>

            <p className="pedajo-mensagem">
                {mensagem}
            </p>

            {status === "verificando" && (
                <div className="pedajo-loader"></div>
            )}

            {status === "autorizado" && (
                <p className="pedajo-contador">
                    Redirecionando em {tempo}s...
                </p>
            )}

            {status === "negado" && (
                <button
                    className="pedajo-btn-voltar"
                    onClick={() => navigate("/")}
                >
                    Voltar
                </button>
            )}

        </div>

    );
}