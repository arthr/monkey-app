import React from "react";
import useAuth from '../../auth/hooks/useAuth';

const Listar = () => {
    const auth = useAuth();
    const { user } = auth;
    const { profile } = user || {};

    return (
        <div className="px-6 py-8 mx-auto lg:py-0">
            <h3 className="text-2xl text-center text-white">Listar Remessas</h3>
            {profile && <p>Bem-vindo, {profile.name}!</p>}
            {/* Additional content can be added here */}
        </div>
    );
};

export default Listar;