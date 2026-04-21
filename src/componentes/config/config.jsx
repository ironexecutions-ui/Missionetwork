import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./config.css";

import EditableField from "./editavel";
import OrganizacaoConfig from "./organizacao";
import SenhaConfig from "./senha";
import FamiliaresConfig from "./familiares";
import MissionarioConfig from "./missionarios";

export default function Config() {

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
        }
    };

    const salvarCampo = async (campo, valor) => {
        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            await fetch(`${API_URL}/config/usuarios/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [campo]: valor })
            });

            setDados(prev => ({ ...prev, [campo]: valor }));

        } catch {
            alert("Erro ao salvar");
        }
    };

    if (!dados) return <div>Carregando...</div>;

    return (
        <div className="cfg-container">

            <h1>Configurações</h1>

            {/* IDENTIFICAÇÃO */}
            <section>
                <h2>Identificação</h2>

                <div>Email: {dados.email}</div>

                <EditableField
                    label="Nome completo"
                    value={dados.nome_completo}
                    onSave={(v) => salvarCampo("nome_completo", v)}
                />

                <SenhaConfig />
            </section>

            {/* DADOS */}
            <section>
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
            <section>
                <h2>Organização</h2>

                <OrganizacaoConfig
                    dados={dados}
                    salvarCampo={salvarCampo}
                />
            </section>
            <FamiliaresConfig />
            <MissionarioConfig />
        </div>
    );
}