import { useEffect, useState, useRef } from "react";
import "./anuncios.css";
import logo from "./m.png";
import { API_URL } from "../config";
const FRASES = [
    "Transformando vidas através do evangelho.",
    "Cada missão possui uma história.",
    "Servir ao próximo é servir a Deus.",
    "A fé move montanhas.",
    "Missionários mudam o mundo.",
    "Missionary Store Brasil",
    "Quer aparecer no nosso Instagram?",
    "Usando a Camêra Pday pode aparecer e receber suas fotos",

];

export default function Anuncios() {

    const [midias, setMidias] = useState([]);
    const [modo, setModo] = useState("fotos");
    const [fotos, setFotos] = useState([]);
    const [videoAtual, setVideoAtual] = useState(null);
    const [fraseAtual, setFraseAtual] = useState("");
    const [transicao, setTransicao] = useState(false);

    const timeoutRef = useRef(null);

    const rodadasRef = useRef(0);

    const proximoEspecialRef =
        useRef("video");

    useEffect(() => {

        carregarMidias();

        return limparTimers;

    }, []);

    function limparTimers() {

        if (timeoutRef.current) {

            clearTimeout(
                timeoutRef.current
            );

        }

    }

    async function carregarMidias() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/tv/midias`
                );

            const dados =
                await resposta.json();

            setMidias(dados);

        } catch (erro) {

            console.error(erro);

        }

    }

    useEffect(() => {

        if (midias.length > 0) {

            iniciar();

        }

    }, [midias]);

    function embaralhar(lista) {

        return [...lista].sort(
            () => Math.random() - 0.5
        );

    }

    function selecionarFotos() {

        const imagens =
            midias.filter(
                item => item.tipo === "imagem"
            );

        return embaralhar(imagens)
            .slice(0, 3);

    }

    function iniciar() {

        limparTimers();

        rodadasRef.current = 0;

        proximoEspecialRef.current =
            "video";

        trocarFotos();

    }

    function trocarFotos() {

        limparTimers();

        setFotos(
            selecionarFotos()
        );

        setModo("fotos");

        setTransicao(false);

        timeoutRef.current =
            setTimeout(() => {

                iniciarSaidaFotos();

            }, 12500);

    }

    function iniciarSaidaFotos() {

        setTransicao(true);

        timeoutRef.current =
            setTimeout(() => {

                finalizarBlocoFotos();

            }, 2500);

    }

    function finalizarBlocoFotos() {

        rodadasRef.current++;

        if (
            rodadasRef.current >= 3
        ) {

            rodadasRef.current = 0;

            if (
                proximoEspecialRef.current ===
                "video"
            ) {

                proximoEspecialRef.current =
                    "texto";

                mostrarVideo();

            } else {

                proximoEspecialRef.current =
                    "video";

                mostrarTexto();

            }

            return;

        }

        trocarFotos();

    }

    function mostrarVideo() {

        limparTimers();

        const videos =
            midias.filter(
                item => item.tipo === "video"
            );

        if (!videos.length) {

            mostrarTexto();

            return;

        }

        const escolhido =
            videos[
            Math.floor(
                Math.random() *
                videos.length
            )
            ];

        setVideoAtual(escolhido);

        setModo("video");

    }

    function finalizarVideo() {

        timeoutRef.current =
            setTimeout(() => {

                trocarFotos();

            }, 2500);

    }

    function mostrarTexto() {

        limparTimers();

        const frase =
            FRASES[
            Math.floor(
                Math.random() *
                FRASES.length
            )
            ];

        setFraseAtual(frase);

        setModo("texto");

        timeoutRef.current =
            setTimeout(() => {

                trocarFotos();

            }, 10000);

    }
    return (

        <div className="anunciosTelaPrincipal">

            <img
                src={logo}
                alt=""
                className="anunciosLogoSuperior"
            />
            {
                modo === "fotos" &&

                <div
                    className={
                        `anunciosGaleriaTresColunas ${transicao
                            ? "anunciosSaindo"
                            : "anunciosEntrando"
                        }`
                    }
                >

                    {
                        fotos.map(
                            (foto, index) => (

                                <div
                                    key={`${foto.arquivo}-${index}`}
                                    className="anunciosCardVertical"
                                >

                                    <img
                                        src={foto.arquivo}
                                        alt=""
                                        className="anunciosImagemVertical"
                                    />

                                </div>

                            )
                        )
                    }

                </div>
            }

            {
                modo === "video" &&
                videoAtual &&

                <div className="anunciosVideoArea">

                    <video
                        key={
                            videoAtual.arquivo
                        }
                        autoPlay
                        muted
                        playsInline
                        className="anunciosVideoPlayer"
                        onEnded={
                            finalizarVideo
                        }
                    >

                        <source
                            src={
                                videoAtual.arquivo
                            }
                        />

                    </video>

                </div>
            }

            {
                modo === "texto" &&

                <div className="anunciosTextoArea">

                    <div className="anunciosTextoCard">

                        {fraseAtual}

                    </div>

                </div>
            }

        </div>

    );

}