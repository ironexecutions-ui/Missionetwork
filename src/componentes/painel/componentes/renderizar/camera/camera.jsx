import React, {
    useEffect,
    useRef,
    useState
} from "react";

import "./camera.css";
import logoMissionary from "./imagen/m.png";
import { API_URL } from "../../../../../config";

export default function Camera() {

    const videoRef = useRef(null);

    const mediaRecorderRef = useRef(null);

    const streamRef = useRef(null);

    const [cameraAberta, setCameraAberta] = useState(false);

    const [distrito, setDistrito] = useState("");

    const [gravando, setGravando] = useState(false);

    const [midias, setMidias] = useState([]);

    const [enviando, setEnviando] = useState(false);

    const [tempoVideo, setTempoVideo] = useState(0);
    const [cameraAtual, setCameraAtual] = useState("environment");
    const intervaloRef = useRef(null);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    // =====================================
    // ABRIR CAMERA
    // =====================================

    async function abrirCamera() {

        if (!distrito.trim()) {

            alert("Digite o distrito antes.");

            return;
        }

        try {

            setCameraAberta(true);

            const stream = await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: cameraAtual,

                    width: {
                        ideal: 1920
                    },

                    height: {
                        ideal: 1080
                    }
                },

                audio: true
            });

            streamRef.current = stream;

            if (videoRef.current) {

                videoRef.current.srcObject = stream;

                await videoRef.current.play();
            }

        } catch (erro) {

            console.log(erro);

            alert("Erro ao abrir câmera");
        }
    }
    // =====================================
    // FOTO
    // =====================================

    function tirarFoto() {

        const video = videoRef.current;

        if (!video) {

            alert("Vídeo não encontrado");

            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob((blob) => {

            if (!blob) {

                alert("Erro ao gerar foto");

                return;
            }

            const arquivo = new File(
                [blob],
                `foto-${Date.now()}.jpg`,
                {
                    type: "image/jpeg"
                }
            );

            const preview = URL.createObjectURL(blob);

            setMidias((atual) => [
                ...atual,
                {
                    tipo: "imagem",
                    arquivo,
                    preview
                }
            ]);

        }, "image/jpeg", 0.95);
    }
    // =====================================
    // VIDEO
    // =====================================

    function iniciarVideo() {

        if (gravando) return;

        const chunks = [];

        const recorder = new MediaRecorder(
            streamRef.current
        );

        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {

            if (e.data.size > 0) {

                chunks.push(e.data);
            }
        };

        recorder.onstop = () => {

            if (chunks.length === 0) {

                alert("Vídeo vazio");

                return;
            }

            const blob = new Blob(
                chunks,
                {
                    type: "video/webm"
                }
            );

            if (!blob || blob.size === 0) {

                alert("Erro ao gerar vídeo");

                return;
            }

            const arquivo = new File(
                [blob],
                `video-${Date.now()}.webm`,
                {
                    type: "video/webm"
                }
            );

            const preview = URL.createObjectURL(blob);

            setMidias((atual) => [
                ...atual,
                {
                    tipo: "video",
                    arquivo,
                    preview
                }
            ]);

            setTempoVideo(0);
        };

        recorder.start();

        setGravando(true);

        intervaloRef.current = setInterval(() => {

            setTempoVideo((tempoAtual) => {

                if (tempoAtual >= 59) {

                    pararVideo();

                    return 60;
                }

                return tempoAtual + 1;
            });

        }, 1000);
    }

    function pararVideo() {

        clearInterval(intervaloRef.current);

        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {

            mediaRecorderRef.current.stop();
        }

        setGravando(false);
    }

    // =====================================
    // SAIR E ENVIAR
    // =====================================

    async function sairEEnviar() {

        if (midias.length === 0) {

            fecharTudo();

            return;
        }

        try {

            const token = localStorage.getItem("token");

            const respostaPost = await fetch(
                `${API_URL}/camera/postagem`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        distrito
                    })
                }
            );

            const postagem = await respostaPost.json();

            for (const item of midias) {

                const formData = new FormData();

                formData.append(
                    "file",
                    item.arquivo
                );

                formData.append(
                    "postagem_id",
                    postagem.postagem_id
                );

                await fetch(
                    `${API_URL}/camera/upload-midias`,
                    {
                        method: "POST",

                        headers: {
                            Authorization: `Bearer ${token}`
                        },

                        body: formData
                    }
                );
            }

            const modal = document.querySelector(
                ".cameraModal"
            );

            if (modal) {

                modal.innerHTML = `

                <div class="cameraUploadSucesso">

                    <div class="cameraUploadSucessoIcone">
                        ✓
                    </div>

                    <h2 class="cameraUploadSucessoTitulo">
                        Arquivos enviados
                    </h2>

                    <p class="cameraUploadSucessoTexto">
                        Sua postagem foi publicada com sucesso.
                    </p>

                </div>
            `;
            }

        } catch (erro) {

            console.log(erro);

            alert("Erro ao enviar");
        }
    }

    // =====================================
    // FECHAR
    // =====================================

    function fecharTudo() {

        if (streamRef.current) {

            streamRef.current.getTracks().forEach(
                (track) => track.stop()
            );
        }

        clearInterval(intervaloRef.current);

        setCameraAberta(false);

        setMidias([]);

        setGravando(false);

        setTempoVideo(0);
    }

    useEffect(() => {

        return () => {

            fecharTudo();
        };

    }, []);

    return (
        <div className="cameraPagina">

            {!cameraAberta && (
                <div className="cameraEntrada">

                    <div className="cameraEntradaogo">
                        <img
                            src={logoMissionary}
                            alt=""
                            className="cameraEntradaImagemLogo"
                        />                    </div>

                    <h1 className="cameraTitulo">
                        Missionary Store Brasil
                    </h1>

                    <p className="cameraSubtitulo">
                        Registre momentos do distrito com fotos e vídeos
                    </p>
                    <label className="labelinput" >digite o seu distroto exemplo <br /> 39A-ESP3</label>
                    <input
                        type="text"
                        placeholder="Digite o distrito"
                        value={distrito}
                        onChange={(e) => {
                            setDistrito(e.target.value);
                        }}
                        className="cameraInputDistrito"
                    />

                    <button
                        className="cameraBotaoAbrir"
                        onClick={abrirCamera}
                    >
                        Iniciar câmera
                    </button>

                </div>
            )}

            {cameraAberta && (
                <div className="cameraArea">

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        controls={false}
                        disablePictureInPicture
                        className="cameraVideo"
                    />

                    <div className="cameraOverlay" />

                    <div className="cameraTopo">

                        <div className="cameraDistritoBox">

                            <div className="cameraDistritoPonto" />

                            <div className="cameraDistritoInfo">

                                <span className="cameraDistritoLabel">
                                    Distrito
                                </span>

                                <span className="cameraDistrito">
                                    {distrito}
                                </span>

                            </div>

                        </div>

                        {gravando && (
                            <div className="cameraTempo">

                                <div className="cameraTempoPulse" />

                                <span>
                                    REC
                                </span>

                                <strong>
                                    {tempoVideo}s
                                </strong>

                            </div>
                        )}

                    </div>

                    <div className="cameraLateral">

                        <div className="cameraMiniaturas">

                            {midias.map((item, index) => (

                                <div
                                    key={index}
                                    className="cameraMiniaturaItem"
                                >

                                    {item.tipo === "imagem" ? (
                                        <img
                                            src={item.preview}
                                            alt=""
                                            className="cameraPreviewImagem"
                                        />
                                    ) : (
                                        <video
                                            src={item.preview}
                                            className="cameraPreviewVideo"
                                        />
                                    )}

                                    <div className="cameraMiniaturaOverlay">

                                        <div
                                            className={
                                                item.tipo === "imagem"
                                                    ? "cameraMiniaturaIconFoto"
                                                    : "cameraMiniaturaIconVideo"
                                            }
                                        />

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                    <div
                        className="cameraBottom"
                        style={{
                            bottom: "90px"
                        }}
                    >

                        <button
                            className="cameraBotaoSecundario"
                            onClick={fecharTudo}
                            style={{
                                transform: "translateY(-10px)"
                            }}
                        >
                            <div className="cameraIconeFechar" />
                        </button>

                        <button
                            className="cameraBotaoVideo"
                            onClick={async () => {

                                try {

                                    if (gravando) {

                                        alert("Pare a gravação antes de virar a câmera");

                                        return;
                                    }

                                    const novoModo =
                                        cameraAtual === "environment"
                                            ? "user"
                                            : "environment";

                                    if (videoRef.current) {

                                        videoRef.current.pause();

                                        videoRef.current.srcObject = null;
                                    }

                                    if (streamRef.current) {

                                        streamRef.current
                                            .getTracks()
                                            .forEach((track) => {

                                                track.stop();
                                            });
                                    }

                                    const novoStream =
                                        await navigator.mediaDevices.getUserMedia({

                                            video: {

                                                facingMode: {
                                                    exact: novoModo
                                                },

                                                width: {
                                                    ideal: 1920
                                                },

                                                height: {
                                                    ideal: 1080
                                                }
                                            },

                                            audio: true
                                        });

                                    streamRef.current = novoStream;

                                    setCameraAtual(novoModo);

                                    if (videoRef.current) {

                                        videoRef.current.srcObject =
                                            novoStream;

                                        await videoRef.current.play();
                                    }

                                } catch (erro) {

                                    console.log(erro);

                                    alert("Não foi possível virar a câmera");
                                }
                            }}
                            style={{
                                transform: "translateY(-25px)"
                            }}
                        >
                            <div
                                style={{
                                    width: "24px",
                                    height: "24px",

                                    border: "3px solid white",

                                    borderRadius: "50%",

                                    position: "relative"
                                }}
                            >

                                <div
                                    style={{
                                        position: "absolute",

                                        top: "-6px",
                                        right: "-6px",

                                        width: "10px",
                                        height: "10px",

                                        borderTop: "3px solid white",
                                        borderRight: "3px solid white",

                                        transform: "rotate(45deg)"
                                    }}
                                />

                            </div>
                        </button>

                        {!gravando && (
                            <button
                                className="cameraBotaoVideo"
                                onClick={iniciarVideo}
                                style={{
                                    transform: "translateY(-45px)"
                                }}
                            >
                                <div className="cameraIconeVideo" />
                            </button>
                        )}

                        {gravando && (
                            <button
                                className="cameraBotaoParar"
                                onClick={pararVideo}
                                style={{
                                    transform: "translateY(-45px)"
                                }}
                            >
                                <div className="cameraIconeParar" />
                            </button>
                        )}

                        <button
                            className="cameraBotaoFoto"
                            onClick={tirarFoto}
                            style={{
                                transform: "translateY(-60px)"
                            }}
                        >
                            <div className="cameraBotaoFotoInterno" />
                        </button>

                        <button
                            className="cameraBotaoEnviar"
                            onClick={() => {
                                setModalConfirmar(true);
                            }}
                            disabled={enviando}
                            style={{
                                transform: "translateY(-25px)"
                            }}
                        >

                            <div className="cameraIconeEnviar" />

                            <span>
                                {enviando
                                    ? "Enviando"
                                    : "Finalizar"}
                            </span>

                        </button>

                    </div>

                </div>
            )}
            {modalConfirmar && (

                <div className="cameraModalOverlay">

                    <div className="cameraModal">

                        {!enviando && (
                            <>

                                <div className="cameraModalIcone">
                                    !
                                </div>

                                <h2 className="cameraModalTitulo">
                                    Finalizar postagem?
                                </h2>

                                <p className="cameraModalTexto">
                                    Todas as fotos e vídeos serão enviados para a postagem do distrito.
                                </p>

                                <div className="cameraModalBotoes">

                                    <button
                                        className="cameraModalCancelar"
                                        onClick={() => {
                                            setModalConfirmar(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="cameraModalConfirmar"
                                        onClick={async () => {

                                            setEnviando(true);

                                            try {

                                                await sairEEnviar();

                                                setTimeout(() => {

                                                    setModalConfirmar(false);

                                                    fecharTudo();

                                                    setDistrito("");

                                                }, 1800);

                                            } catch (erro) {

                                                console.log(erro);

                                            } finally {

                                                setEnviando(false);
                                            }
                                        }}
                                    >
                                        Confirmar
                                    </button>

                                </div>

                            </>
                        )}

                        {enviando && (
                            <>

                                <div className="cameraUploadSpinner" />

                                <h2 className="cameraUploadTitulo">
                                    Enviando arquivos...
                                </h2>

                                <p className="cameraUploadTexto">

                                    Aguarde enquanto as fotos e vídeos são enviados.

                                </p>

                                <div className="cameraUploadAviso">

                                    <div className="cameraUploadAvisoIcone">
                                        !
                                    </div>

                                    <div className="cameraUploadAvisoTextos">

                                        <strong>
                                            Não saia desta tela
                                        </strong>

                                        <span>
                                            Não desconecte a internet até o envio terminar.
                                        </span>

                                    </div>

                                </div>

                            </>
                        )}

                    </div>

                </div>
            )}
        </div>
    );
}