import React, { useState } from "react";
import { API_URL } from "../../config";
import "./senha.css";

export default function SenhaConfig() {

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [msg, setMsg] = useState("");

    const salvar = async () => {

        setMsg("");

        // 🔴 validação básica
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            setMsg("Preencha todos os campos");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setMsg("As novas senhas não coincidem");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("usuario"));

            const res = await fetch(`${API_URL}/config/usuarios/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senha_atual: senhaAtual,
                    nova_senha: novaSenha
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.detail || "Erro ao alterar senha");
                return;
            }

            setMsg("Senha alterada com sucesso ✅");

            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");

        } catch {
            setMsg("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="senha-container">

            <h3 className="senha-titulo">Alterar senha</h3>

            <div className="senha-box">

                <input
                    className="senha-input"
                    type="password"
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                />

                <input
                    className="senha-input"
                    type="password"
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                />

                <input
                    className="senha-input"
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                <button className="senha-botao" onClick={salvar}>
                    Salvar senha
                </button>

                {msg && (
                    <div className={
                        msg.includes("sucesso")
                            ? "senha-msg sucesso"
                            : "senha-msg erro"
                    }>
                        {msg}
                    </div>
                )}

            </div>

        </div>
    );
}