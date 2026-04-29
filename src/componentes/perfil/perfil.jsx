import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./perfil.css";
import Aviso from "./aviso";
import ModalTermos from "./termos";



export default function Perfil() {

    const navigate = useNavigate();
    const [abrirModalTermos, setAbrirModalTermos] = useState(false);
    const [modoCadastro, setModoCadastro] = useState(false);

    // 🔐 LOGIN
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // 🆕 CADASTRO
    const [nome, setNome] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [aceitou, setAceitou] = useState(false);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [abrirConfirmacaoEmail, setAbrirConfirmacaoEmail] = useState(false);
    // 🔥 DETECTAR LOGIN AUTOMÁTICO
    useEffect(() => {
        const user = localStorage.getItem("usuario");

        if (user) {
            navigate("/perfilusuario");
        }
    }, []);

    // 🔥 LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setErro("");

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.detail || "Erro ao fazer login");
                return;
            }

            localStorage.setItem("usuario", JSON.stringify(data));

            navigate("/perfilusuario");

        } catch (err) {
            console.log(err);
            setErro("Erro de conexão com servidor");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 CADASTRO
    const handleCadastro = async (e) => {
        e.preventDefault();
        setErro("");

        if (!nome || !email || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem");
            return;
        }

        if (!aceitou) {
            setErro("Aceite os termos");
            return;
        }

        try {
            setLoading(true);

            // 🔥 1. CRIA USUÁRIO
            const res = await fetch(`${API_URL}/usuarios/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    nome_completo: nome,
                    senha,

                    // pode até deixar, mas backend ignora
                    termos: aceitou ? 1 : 0,

                    data_nascimento: null,
                    sexo: null,
                    estado_civil: null,
                    ala: null,
                    estaca: null,
                    bispo: null,
                    foto: null,
                    foto_capa: null,
                    frase: null,
                    missionario_id: null,
                    familiares_id: null,
                    chamado: null,
                    denuncia: null
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.detail || "Erro ao cadastrar");
                return;
            }

            // 🔥 2. SALVA TERMOS (AQUI ESTÁ O QUE FALTAVA)
            if (aceitou && data.id) {
                await fetch(`${API_URL}/usuarios/aceitar-termos/${data.id}`, {
                    method: "PUT"
                });
            }

            // 🔥 3. LOGIN AUTOMÁTICO
            const loginAuto = await fetch(`${API_URL}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const user = await loginAuto.json();

            localStorage.setItem("usuario", JSON.stringify(user));

            navigate("/perfilusuario");

        } catch (err) {
            console.log(err);
            setErro("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="perfil-container-geral">

            {/* LADO ESQUERDO */}
            <div className="perfil-lado-esquerdo">
                <div className="perfil-wrapper-aviso">
                    <Aviso />
                </div>
            </div>

            {/* LADO DIREITO */}
            <div className="perfil-lado-direito">
                <div className="perfil-card-login">

                    <h2 className="perfil-titulo-login">
                        {modoCadastro ? "Criar conta" : "Entrar"}
                    </h2>

                    {!modoCadastro && (
                        <form onSubmit={handleLogin} className="perfil-formulario-login">

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="perfil-input-email"
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="perfil-input-senha"
                            />

                            {erro && <p className="perfil-erro-login">{erro}</p>}

                            <button className="perfil-botao-login">
                                {loading ? "Entrando..." : "Entrar"}
                            </button>

                            <p
                                className="perfil-link-alternar"
                                onClick={() => {
                                    setModoCadastro(true);
                                    setErro("");
                                }}
                            >
                                Criar conta
                            </p>

                        </form>
                    )}

                    {modoCadastro && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setAbrirConfirmacaoEmail(true);
                            }}
                            className="perfil-formulario-login"
                        >
                            <input
                                type="text"
                                placeholder="Nome completo"
                                value={nome}
                                onChange={(e) => {
                                    const valor = e.target.value
                                        .toLowerCase()
                                        .replace(/\b\w/g, (letra) => letra.toUpperCase());

                                    setNome(valor);
                                }} className="perfil-input-nome"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="perfil-input-email"
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="perfil-input-senha"
                            />

                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="perfil-input-confirmar"
                            />

                            <label
                                className="perfil-termos-box"
                                onClick={() => setAbrirModalTermos(true)}
                            >
                                <input
                                    type="checkbox"
                                    checked={aceitou}
                                    readOnly
                                />
                                Aceito os termos de uso
                            </label>

                            {erro && <p className="perfil-erro-login">{erro}</p>}

                            <button className="perfil-botao-login">
                                {loading ? "Criando..." : "Criar conta"}
                            </button>

                            <p
                                className="perfil-link-alternar"
                                onClick={() => {
                                    setModoCadastro(false);
                                    setErro("");
                                }}
                            >
                                Já tenho conta
                            </p>

                        </form>
                    )}

                </div>
            </div>
            <ModalTermos
                abrir={abrirModalTermos}
                fechar={() => setAbrirModalTermos(false)}
                aceitar={() => {
                    setAceitou(true);
                    setAbrirModalTermos(false);
                }}
            />
            {abrirConfirmacaoEmail && (
                <div className="modal-confirmacao-overlay">
                    <div className="modal-confirmacao-box">

                        <h3>Confirmar email</h3>

                        <p>Seu email <b style={{ fontSize: "1.4rem" }} >{email}</b> está correto?</p>
                        <p>Esse será o email oficial da conta.</p>

                        <div className="modal-confirmacao-botoes">
                            <button onClick={() => setAbrirConfirmacaoEmail(false)}>
                                Não
                            </button>

                            <button
                                onClick={(e) => {
                                    setAbrirConfirmacaoEmail(false);
                                    handleCadastro(e);
                                }}
                            >
                                Sim
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}