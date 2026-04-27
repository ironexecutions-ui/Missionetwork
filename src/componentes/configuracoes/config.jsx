import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./config.css";

import EditableField from "./editavel";
import OrganizacaoConfig from "./organizacao";
import SenhaConfig from "./senha";
import FamiliaresConfig from "./familiares";
import MissionarioConfig from "./missionarios";
import LoaderPro from "../../carregando";

export default function Config() {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState(null);

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            const res = await fetch(`${API_URL}/config/usuarios/${user.id}`);
            const data = await res.json();

            setDados(data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const salvarCampo = async (campo, valor) => {
        try {
            const userLocal = JSON.parse(localStorage.getItem("usuario"));

            await fetch(`${API_URL}/config/usuarios/${userLocal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [campo]: valor })
            });

            // 🔥 atualiza state da tela
            setDados(prev => ({
                ...prev,
                [campo]: valor
            }));

            // 🔥 atualiza localStorage (ESSENCIAL)
            const atualizado = {
                ...userLocal,
                [campo]: valor
            };

            localStorage.setItem("usuario", JSON.stringify(atualizado));

        } catch (err) {
            console.log(err);
            alert("Erro ao salvar");
        }
    };

    if (loading) {
        return (
            <LoaderPro
                texto="Carregando Configurações"
                subtitulo="Buscando seus dados"
            />
        );
    }
    if (!dados) return null;
    return (
        <div className="cfg-container">

            <div className="cfg-header">
                <h1>Configurações</h1>
                <p>Gerencie suas informações, segurança e conexões da plataforma</p>
            </div>

            <div className="cfg-grid">

                {/* IDENTIFICAÇÃO */}
                <section className="cfg-section">
                    <h2>Identificação</h2>

                    <div className="cfg-info">
                        <span className="cfg-label">Email</span>
                        <span className="cfg-value">{dados.email}</span>
                    </div>

                    <EditableField
                        label="Nome completo"
                        value={dados.nome_completo}
                        onSave={(v) => salvarCampo("nome_completo", v)}
                    />

                    <SenhaConfig />
                </section>

                {/* DADOS */}
                <section className="cfg-section">
                    <h2>Dados pessoais</h2>

                    <EditableField
                        label="Data de nascimento"
                        value={dados.data_nascimento}
                        onSave={(v) => salvarCampo("data_nascimento", v)}
                    />

                    <EditableField
                        label="Sexo"
                        value={dados.sexo}
                        onSave={(v) => salvarCampo("sexo", v)}
                    />

                    <EditableField
                        label="Estado civil"
                        value={dados.estado_civil}
                        sexo={dados.sexo}
                        onSave={(v) => salvarCampo("estado_civil", v)}
                    />
                </section>

                {/* ORGANIZAÇÃO */}
                <section className="cfg-section">
                    <h2>Organização</h2>

                    <OrganizacaoConfig
                        dados={dados}
                        salvarCampo={salvarCampo}
                    />
                </section>

                {/* FAMILIARES */}
                <section className="cfg-section">
                    <h2>Familiares</h2>
                    <FamiliaresConfig />
                </section>

                {/* MISSIONÁRIOS */}
                <section className="cfg-section">
                    <h2>Missionários</h2>
                    <MissionarioConfig />
                </section>

            </div>

        </div>
    );
}