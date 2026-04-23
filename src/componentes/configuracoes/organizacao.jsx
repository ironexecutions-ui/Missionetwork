import React from "react";
import EditableField from "./editavel";
import "./organizacao.css"

export default function OrganizacaoConfig({ dados, salvarCampo }) {

    return (
        <div className="org-container">

            <div className="org-header">
                <p>Informações relacionadas à sua unidade e responsabilidades</p>
            </div>

            <div className="org-grid">

                <div className="org-item">
                    <EditableField
                        label="Ala"
                        value={dados.ala}
                        onSave={(v) => salvarCampo("ala", v)}
                    />
                </div>

                <div className="org-item">
                    <EditableField
                        label="Estaca"
                        value={dados.estaca}
                        onSave={(v) => salvarCampo("estaca", v)}
                    />
                </div>

                <div className="org-item">
                    <EditableField
                        label="Bispo"
                        value={dados.bispo}
                        onSave={(v) => salvarCampo("bispo", v)}
                    />
                </div>

                <div className="org-item">
                    <EditableField
                        label="Chamado"
                        value={dados.chamado}
                        onSave={(v) => salvarCampo("chamado", v)}
                    />
                </div>

            </div>

        </div>
    );
}