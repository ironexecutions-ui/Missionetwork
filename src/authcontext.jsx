import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);

    // 🔥 CARREGA AO INICIAR
    useEffect(() => {
        carregar();
    }, []);

    const carregar = () => {
        const user = localStorage.getItem("usuario");

        if (user) {
            setUsuario(JSON.parse(user));
        } else {
            setUsuario(null);
        }
    };

    // 🔥 LOGIN GLOBAL
    const login = async (dados) => {
        localStorage.setItem("usuario", JSON.stringify(dados));
        setUsuario(dados);
    };

    // 🔥 LOGOUT GLOBAL
    const logout = async () => {
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}