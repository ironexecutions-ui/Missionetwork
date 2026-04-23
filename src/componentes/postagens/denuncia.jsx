import React, { useState } from "react";
import { API_URL } from "../../config";
import "./denuncia.css";

export default function Denuncia({ tipo, id, fechar }) {

    const [mensagem, setMensagem] = useState("");
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [enviado, setEnviado] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const opcoes = [
        "Ofende a integridade da Igreja",
        "Conteúdo impróprio",
        "Ofende os princípios da Igreja",
        "Outro motivo"
    ];

    const selecionarOpcao = (opcao) => {
        setOpcaoSelecionada(opcao);

        if (opcao !== "Outro motivo") {
            setMensagem(opcao);
        } else {
            setMensagem("");
        }
    };

    const enviar = async () => {
        if (!mensagem.trim()) {
            alert("Descreva o motivo da denúncia");
            return;
        }

        try {
            const rota =
                tipo === "post"
                    ? `${API_URL}/postagens/denunciar`
                    : `${API_URL}/comentarios/denunciar`;

            const body =
                tipo === "post"
                    ? {
                        post_id: id,
                        usuario_id: usuario.id,
                        mensagem
                    }
                    : {
                        comentario_id: id,
                        usuario_id: usuario.id,
                        mensagem
                    };

            await fetch(rota, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            // 🔥 MOSTRA TELA DE SUCESSO
            setEnviado(true);

        } catch (err) {
            console.log("erro denunciar:", err);
        }
    };

    return (
        <div className="denuncia-overlay">

            <div className="denuncia-box">

                {!enviado ? (
                    <>
                        <h3>
                            Denunciar {tipo === "post" ? "postagem" : "comentário"}
                        </h3>

                        <div className="denuncia-opcoes">
                            {opcoes.map((opcao, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`denuncia-opcao-btn ${opcaoSelecionada === opcao ? "ativo" : ""}`}
                                    onClick={() => selecionarOpcao(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Descreva o problema..."
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                        />

                        <div className="denuncia-botoes">
                            <button onClick={fechar}>Cancelar</button>
                            <button onClick={enviar}>Enviar</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="denuncia-sucesso">

                            <div className="denuncia-icon">✔</div>

                            <h3>Denúncia enviada</h3>

                            <p>
                                Obrigado por nos ajudar a manter a plataforma segura.
                                Sua denúncia será analisada em breve.
                            </p>

                            <button onClick={fechar}>
                                Fechar
                            </button>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}