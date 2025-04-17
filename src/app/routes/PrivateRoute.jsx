import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function PrivateRoute() {
    const { isLogged, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isLogged) {
        return <Navigate to="/" replace />;
    }

    return (
        <Outlet />
    );
}

export default PrivateRoute;
