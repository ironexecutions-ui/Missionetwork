import React, {
    useEffect,
    useState
} from "react";

import { API_URL } from "../../../../config";


import "./imagens.css";

export default function Imagens() {

    const [
        modoVisualizacao,
        setModoVisualizacao
    ] = useState("distrito");

    const [
        grupos,
        setGrupos
    ] = useState([]);

    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        imagemAberta,
        setImagemAberta
    ] = useState(null);

    const [
        selecionadas,
        setSelecionadas
    ] = useState([]);

    useEffect(() => {

        buscarImagens();

    }, [modoVisualizacao]);

    async function buscarImagens() {

        try {

            setCarregando(true);

            const resposta =
                await fetch(
                    `${API_URL}/imagens/listar?modo=${modoVisualizacao}`
                );

            const dados =
                await resposta.json();

            setGrupos(dados);

        } catch (erro) {

            console.log(erro);

        } finally {

            setCarregando(false);
        }
    }

    function selecionarImagem(link) {

        setSelecionadas((anterior) => {

            if (
                anterior.includes(link)
            ) {

                return anterior.filter(
                    (item) =>
                        item !== link
                );
            }

            return [
                ...anterior,
                link
            ];
        });
    }

    function selecionarGrupo(imagens) {

        const links =
            imagens.map(
                (item) =>
                    item.arquivo
            );

        const todasSelecionadas =
            links.every(
                (link) =>
                    selecionadas.includes(link)
            );

        if (todasSelecionadas) {

            setSelecionadas((anterior) =>
                anterior.filter(
                    (item) =>
                        !links.includes(item)
                )
            );

        } else {

            setSelecionadas((anterior) => [

                ...new Set([
                    ...anterior,
                    ...links
                ])
            ]);
        }
    }

    async function baixarSelecionadas() {

        for (let i = 0; i < selecionadas.length; i++) {

            const link =
                selecionadas[i];

            const iframe =
                document.createElement("iframe");

            iframe.style.display =
                "none";

            iframe.src =
                `${API_URL}/imagens/download?url=${encodeURIComponent(link)}`;

            document.body.appendChild(
                iframe
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 800)
            );

            iframe.remove();
        }
    }

    return (

        <div className="imagensPaginaContainer">

            <div className="imagensTopoBarra">

                {
                    selecionadas.length === 0 ? (

                        <>

                            <button
                                className={`imagensBotaoModo ${modoVisualizacao ===
                                    "distrito"
                                    ? "imagensBotaoModoAtivo"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setModoVisualizacao(
                                        "distrito"
                                    )
                                }
                            >
                                Distrito
                            </button>

                            <button
                                className={`imagensBotaoModo ${modoVisualizacao ===
                                    "data"
                                    ? "imagensBotaoModoAtivo"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setModoVisualizacao(
                                        "data"
                                    )
                                }
                            >
                                Data
                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                className="imagensBotaoBaixar"
                                onClick={
                                    baixarSelecionadas
                                }
                            >
                                Baixar (
                                {
                                    selecionadas.length
                                }
                                )
                            </button>

                            <button
                                className="imagensBotaoCancelar"
                                onClick={() =>
                                    setSelecionadas([])
                                }
                            >
                                Cancelar
                            </button>

                        </>
                    )
                }

            </div>

            {
                carregando ? (

                    <div className="imagensLoadingArea">

                        <div className="imagensLoadingSpinner"></div>

                        <h3>
                            Carregando imagens...
                        </h3>

                    </div>

                ) : (

                    grupos.map((grupo, index) => (

                        <div
                            className="imagensGrupoArea"
                            key={index}
                        >

                            <div className="imagensGrupoTopo">

                                <h2>
                                    {
                                        grupo.titulo
                                    }
                                </h2>

                                <button
                                    className="imagensSelecionarGrupoBotao"
                                    onClick={() =>
                                        selecionarGrupo(
                                            grupo.imagens
                                        )
                                    }
                                >
                                    Selecionar grupo
                                </button>

                            </div>

                            <div className="imagensGridContainer">

                                {
                                    grupo.imagens.map(
                                        (
                                            imagem,
                                            imagemIndex
                                        ) => (

                                            <div
                                                className={`imagensCardItem ${selecionadas.includes(
                                                    imagem.arquivo
                                                )
                                                    ? "imagensCardSelecionado"
                                                    : ""
                                                    }`}
                                                key={
                                                    imagemIndex
                                                }
                                            >{
                                                    imagem.arquivo.match(
                                                        /\.(mp4|webm|mov|ogg)$/i
                                                    ) && (

                                                        <div className="imagensIndicadorVideo">

                                                            ▶ VÍDEO

                                                        </div>
                                                    )
                                                }

                                                {
                                                    imagem.arquivo.match(
                                                        /\.(mp4|webm|mov|ogg)$/i
                                                    ) ? (

                                                        <video
                                                            src={
                                                                imagem.arquivo
                                                            }
                                                            className="imagensMiniatura"
                                                            muted
                                                            playsInline
                                                            onClick={() =>
                                                                setImagemAberta({
                                                                    tipo: "video",
                                                                    arquivo:
                                                                        imagem.arquivo
                                                                })
                                                            }
                                                        />

                                                    ) : (

                                                        <img
                                                            src={
                                                                imagem.arquivo
                                                            }
                                                            alt="imagem"
                                                            className="imagensMiniatura"
                                                            onClick={() =>
                                                                setImagemAberta({
                                                                    tipo: "imagem",
                                                                    arquivo:
                                                                        imagem.arquivo
                                                                })
                                                            }
                                                        />
                                                    )
                                                }
                                                {
                                                    imagemAberta && (

                                                        <div
                                                            className="imagensModalFundo"
                                                            onClick={() =>
                                                                setImagemAberta(null)
                                                            }
                                                        >

                                                            {
                                                                imagemAberta.tipo ===
                                                                    "video" ? (

                                                                    <video
                                                                        src={
                                                                            imagemAberta.arquivo
                                                                        }
                                                                        className="imagensModalImagem"
                                                                        controls
                                                                        autoPlay
                                                                        playsInline
                                                                    />

                                                                ) : (

                                                                    <img
                                                                        src={
                                                                            imagemAberta.arquivo
                                                                        }
                                                                        alt="imagem completa"
                                                                        className="imagensModalImagem"
                                                                    />
                                                                )
                                                            }

                                                        </div>
                                                    )
                                                }
                                                <button
                                                    className="imagensSelecionarBotao"
                                                    onClick={() =>
                                                        selecionarImagem(
                                                            imagem.arquivo
                                                        )
                                                    }
                                                >
                                                    {
                                                        selecionadas.includes(
                                                            imagem.arquivo
                                                        )
                                                            ? "✅"
                                                            : "🗳️"
                                                    }
                                                </button>

                                            </div>
                                        )
                                    )
                                }

                            </div>

                        </div>
                    ))
                )
            }

            {
                imagemAberta && (

                    <div
                        className="imagensModalFundo"
                        onClick={() =>
                            setImagemAberta(null)
                        }
                    >

                        {
                            imagemAberta.tipo ===
                                "video" ? (

                                <video
                                    src={
                                        imagemAberta.arquivo
                                    }
                                    className="imagensModalImagem"
                                    controls
                                    autoPlay
                                    playsInline
                                />

                            ) : (

                                <img
                                    src={
                                        imagemAberta.arquivo
                                    }
                                    alt="imagem completa"
                                    className="imagensModalImagem"
                                />
                            )
                        }

                    </div>
                )
            }

        </div>
    );
}