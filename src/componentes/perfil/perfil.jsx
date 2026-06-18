import React, {
    useState,
    useEffect
} from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    GoogleLogin
} from "@react-oauth/google";

import {
    jwtDecode
} from "jwt-decode";

import {
    API_URL
} from "../../config";

import "./perfil.css";

import Aviso from "./aviso";
import ModalTermos from "./termos";

export default function Perfil() {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [erro, setErro] =
        useState("");

    const [
        abrirModalTermos,
        setAbrirModalTermos
    ] = useState(false);

    const [
        googleResponse,
        setGoogleResponse
    ] = useState(null);

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            navigate(
                "/perfilusuario"
            );

        }

    }, []);

    async function continuarLoginGoogle() {

        try {

            if (!googleResponse) {
                return;
            }

            const googleUser =
                jwtDecode(
                    googleResponse.credential
                );

            const resposta =
                await fetch(
                    `${API_URL}/usuarios/google-login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({

                            email:
                                googleUser.email,

                            nome_completo:
                                googleUser.name,

                            foto:
                                googleUser.picture,

                            funcao:
                                location.pathname ===
                                    "/perfil/camera"
                                    ? "CTM"
                                    : "user"

                        })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                setErro(
                    dados.detail ||
                    "Erro ao autenticar"
                );

                return;
            }

            localStorage.setItem(
                "token",
                dados.token
            );

            if (
                dados.token_camera
            ) {

                localStorage.setItem(
                    "token_camera",
                    dados.token_camera
                );

            }

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    dados.usuario
                )
            );

            navigate(
                "/perfilusuario"
            );

        } catch (erro) {

            console.log(
                erro
            );

            setErro(
                "Erro ao autenticar"
            );

        }

    }

    return (

        <div className="perfil-container-geral">

            <div className="perfil-lado-esquerdo">

                <div className="perfil-wrapper-aviso">

                    <Aviso />

                </div>

            </div>

            <div className="perfil-lado-direito">

                <div className="perfil-card-login">

                    <h2 className="perfil-titulo-login">
                        Entrar
                    </h2>

                    <p
                        className="perfil-subtitulo-google"
                    >
                        Entre utilizando sua conta Google
                    </p>

                    <div
                        className="perfilGoogleBotaoArea"
                    >

                        <GoogleLogin
                            onSuccess={(
                                response
                            ) => {

                                setGoogleResponse(
                                    response
                                );

                                setAbrirModalTermos(
                                    true
                                );

                            }}
                            onError={() =>
                                setErro(
                                    "Falha ao fazer login"
                                )
                            }
                        />

                    </div>

                    {
                        erro &&
                        (
                            <p
                                className="perfil-erro-login"
                            >
                                {erro}
                            </p>
                        )
                    }

                </div>

            </div>

            <ModalTermos
                abrir={
                    abrirModalTermos
                }
                fechar={() =>
                    setAbrirModalTermos(
                        false
                    )
                }
                aceitar={() => {

                    setAbrirModalTermos(
                        false
                    );

                    continuarLoginGoogle();

                }}
            />

        </div>

    );

}