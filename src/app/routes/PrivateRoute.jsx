import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <Outlet />
    );
}

export default PrivateRoute;
