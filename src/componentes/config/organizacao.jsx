import React from "react";
import EditableField from "./editavel";
import "./organizacao.css"
export default function OrganizacaoConfig({ dados, salvarCampo }) {

    return (
        <div>

            <EditableField
                label="Ala"
                value={dados.ala}
                onSave={(v) => salvarCampo("ala", v)}
            />

            <EditableField
                label="Estaca"
                value={dados.estaca}
                onSave={(v) => salvarCampo("estaca", v)}
            />

            <EditableField
                label="Bispo"
                value={dados.bispo}
                onSave={(v) => salvarCampo("bispo", v)}
            />

            <EditableField
                label="Chamado"
                value={dados.chamado}
                onSave={(v) => salvarCampo("chamado", v)}
            />

        </div>
    );
}