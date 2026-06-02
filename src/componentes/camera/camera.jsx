import { useParams } from "react-router-dom";
import Camera from "./camera";

export default function Cameradigital() {

    const { token } = useParams();

    return (
        <div>
            <Camera />
        </div>
    );
}