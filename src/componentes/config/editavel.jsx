import React, { useEffect, useState } from "react";
import "./editavel.css"
export default function EditableField({ label, value, onSave, sexo }) {

    const [editando, setEditando] = useState(false);
    const [valor, setValor] = useState("");

    useEffect(() => {
        setValor(value || "");
    }, [value]);

    const salvar = () => {
        setEditando(false);
        if (valor !== value) onSave(valor);
    };

    const formatarData = (v) => {
        let n = v.replace(/\D/g, "").slice(0, 8);
        if (n.length <= 2) return n;
        if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
        return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
    };

    const handleChange = (e) => {
        let v = e.target.value;
        if (label === "Data de nascimento") {
            v = formatarData(v);
        }
        setValor(v);
    };

    const opcoesSexo = ["Masculino", "Feminino"];

    const opcoesEstadoCivil = sexo === "Masculino"
        ? ["Solteiro", "Casado", "Viúvo"]
        : ["Solteira", "Casada", "Viúva"];

    return (
        <div style={{ marginBottom: 15 }}>

            <label>{label}</label>

            {editando ? (

                label === "Sexo" || label === "Estado civil" ? (

                    <select
                        value={valor}
                        onChange={(e) => {
                            setValor(e.target.value);
                            onSave(e.target.value);
                            setEditando(false);
                        }}
                    >
                        <option value="">Selecione</option>
                        {(label === "Sexo" ? opcoesSexo : opcoesEstadoCivil)
                            .map(o => <option key={o}>{o}</option>)}
                    </select>

                ) : (
                    <input
                        value={valor}
                        onChange={handleChange}
                        onBlur={salvar}
                        autoFocus
                    />
                )

            ) : (
                <div onClick={() => setEditando(true)} style={{ cursor: "pointer" }}>
                    {value || "Clique para editar"}
                </div>
            )}

        </div>
    );
}