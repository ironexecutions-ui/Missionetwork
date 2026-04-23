import React, { useState, useEffect } from "react";
import Postagens from "../postagens/postagens";
import FamiliaresSidebar from "./familiares";
import MissionariosSidebar from "./missionarios";
import "./inicio.css";

export default function Inicio() {

    const [aba, setAba] = useState("postagens");
    const [mobile, setMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 900);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🔥 MOBILE (TABS)
    if (mobile) {
        return (
            <div className="inicio-container-mobile">

                {/* BOTÕES */}
                <div className="inicio-tabs">
                    <button
                        className={aba === "postagens" ? "tab-active" : ""}
                        onClick={() => setAba("postagens")}
                    >
                        Postagens
                    </button>

                    <button
                        className={aba === "familiares" ? "tab-active" : ""}
                        onClick={() => setAba("familiares")}
                    >
                        Familiares
                    </button>

                    <button
                        className={aba === "missionarios" ? "tab-active" : ""}
                        onClick={() => setAba("missionarios")}
                    >
                        Missionários
                    </button>
                </div>

                {/* CONTEÚDO */}
                <div className="inicio-mobile-content">
                    {aba === "postagens" && <Postagens />}
                    {aba === "familiares" && <FamiliaresSidebar />}
                    {aba === "missionarios" && <MissionariosSidebar />}
                </div>

            </div>
        );
    }

    // 🔥 DESKTOP (NORMAL)
    return (
        <div className="inicio-container">

            <div className="inicio-left">
                <FamiliaresSidebar />
            </div>

            <div className="inicio-center">
                <Postagens />
            </div>

            <div className="inicio-right">
                <MissionariosSidebar />
            </div>

        </div>
    );
}