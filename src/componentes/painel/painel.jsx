import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import PainelAdmin from "../perfil/botao";
import Painelcontrole from "./componentes/controle/painelcontrole";
export default function Painel() {

    const [status, setStatus] = useState("verificando");
    // verificando | autorizado | negado

    useEffect(() => {
        verificar();
    }, []);

    const verificar = async () => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            if (!userLocal || !userLocal.id) {
                setStatus("negado");
                return;
            }

            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/verificar/admin/painel`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!res.ok) {
                setStatus("negado");
                return;
            }

            setStatus("autorizado");

        } catch (err) {
            console.log(err);
            setStatus("negado");
        }
    };

    // 🔥 enquanto verifica
    if (status === "verificando") {
        return <h2>Verificando acesso...</h2>;
    }

    // 🔥 se não for admin
    if (status === "negado") {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h1 style={{ color: "red" }}>
                    Acesso não concedido
                </h1>
                <p>Você não possui permissão para acessar esta área.</p>
            </div>
        );
    }

    // 🔥 se for admin
    return (
        <Painelcontrole />
    );
}