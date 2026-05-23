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

            const a =
                document.createElement("a");

            a.href =
                `${API_URL}/imagens/download?url=${encodeURIComponent(link)}`;
            a.setAttribute(
                "download",
                `imagem_${i + 1}.jpg`
            );

            a.setAttribute(
                "target",
                "_blank"
            );

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );
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
                                            >

                                                <img
                                                    src={
                                                        imagem.arquivo
                                                    }
                                                    alt="imagem"
                                                    className="imagensMiniatura"
                                                    onClick={() =>
                                                        setImagemAberta(
                                                            imagem.arquivo
                                                        )
                                                    }
                                                />

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

                        <img
                            src={imagemAberta}
                            alt="imagem completa"
                            className="imagensModalImagem"
                        />

                    </div>
                )
            }

        </div>
    );
}