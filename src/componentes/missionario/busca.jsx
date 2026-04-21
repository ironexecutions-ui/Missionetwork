import MissionarioConfig from "./config";

export default function BuscaMissionario({ atualizarLista }) {

    return (
        <div className="coluna-direita">
            <MissionarioConfig atualizarLista={atualizarLista} />
        </div>
    );
}