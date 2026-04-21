import React from "react";
import Postagens from "../postagens/postagens";
import FamiliaresSidebar from "./familiares";
import MissionariosSidebar from "./missionarios";
import "./inicio.css";

export default function Inicio() {
    return (
        <div className="inicio-container">

            {/* 🔥 ESQUERDA */}
            <div className="inicio-left">
                <FamiliaresSidebar />
            </div>

            {/* 🔥 CENTRO */}
            <div className="inicio-center">
                <Postagens />
            </div>

            {/* 🔥 DIREITA */}
            <div className="inicio-right">
                <MissionariosSidebar />
            </div>

        </div>
    );
}